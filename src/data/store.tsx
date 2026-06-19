import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { PhoneProduct, CartItem, PromoBanner, ThemeColor, OrderFormData } from '../types/phone';
import { defaultPhones } from './mockPhones';
import { defaultBanners } from './mockCategories';
import { storage } from '../utils/storage';

function cartItemMatches(item: CartItem, productId: string, selectedStorage?: string, selectedRam?: string) {
  return item.product.id === productId
    && (item.selectedStorage || '') === (selectedStorage || '')
    && (item.selectedRam || '') === (selectedRam || '');
}

interface StoreContextType {
  phones: PhoneProduct[];
  banners: PromoBanner[];
  cart: CartItem[];
  theme: ThemeColor;
  setTheme: (t: ThemeColor) => void;
  addToCart: (product: PhoneProduct, selectedStorage?: string, selectedRam?: string, quantity?: number) => void;
  removeFromCart: (productId: string, selectedStorage?: string, selectedRam?: string) => void;
  updateQuantity: (productId: string, qty: number, selectedStorage?: string, selectedRam?: string) => void;
  clearCart: () => void;
  updatePhone: (phone: PhoneProduct) => void;
  addPhone: (phone: PhoneProduct) => void;
  deletePhone: (id: string) => void;
  updateBanner: (banner: PromoBanner) => void;
  addBanner: (banner: PromoBanner) => void;
  removeBanner: (id: string) => void;
  resetDemo: () => void;
  cartTotal: () => number;
  cartDiscount: () => number;
  cartNetTotal: () => number;
  cartCount: () => number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (v: boolean) => void;
  cartHighlight: number;
  triggerCartHighlight: () => void;
  processOrder: (data: OrderFormData) => string;
}

const StoreContext = createContext<StoreContextType | null>(null);

async function api<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`/api${path}`, init)
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

async function fetchInitialPhones(): Promise<PhoneProduct[]> {
  try {
    const data = await api<PhoneProduct[]>('/phones')
    if (data && data.length > 0) return data
  } catch {}
  const stored = storage.getPhones();
  if (stored) return stored
  return defaultPhones;
}

async function fetchInitialBanners(): Promise<PromoBanner[]> {
  try {
    const data = await api<PromoBanner[]>('/banners')
    if (data && data.length > 0) return data
  } catch {}
  const stored = storage.getBanners();
  if (stored) return stored
  return defaultBanners;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [phones, setPhones] = useState<PhoneProduct[]>(defaultPhones);

  useEffect(() => {
    fetchInitialPhones().then(data => {
      const defaultMap = new Map(defaultPhones.map(p => [p.id, p]));
      const migrated = data.map(p => {
        const tier = (p as any).tier || (
          p.price >= 800 ? 'Premium' :
          p.price >= 200 ? 'Media' : 'Económica'
        );
        const def = defaultMap.get(p.id);
        let variants: { storage: string; ram: string; price?: number }[] | undefined = (p.specs as any).variants || def?.specs.variants;
        if (variants && def?.specs.variants) {
          const priceMap = new Map(def.specs.variants.map(v => [`${v.storage}|${v.ram}`, v.price]));
          variants = variants.map(v => ({ ...v, price: v.price ?? priceMap.get(`${v.storage}|${v.ram}`) }));
        }
        if (!variants) {
          const so = (p.specs as any).storageOptions || def?.specs.storageOptions;
          const ro = (p.specs as any).ramOptions || def?.specs.ramOptions;
          if (so && so.length > 1) {
            const ramArr: string[] = ro && ro.length > 1 ? ro : [p.specs.ram];
            variants = so.flatMap((s: string) => ramArr.map((r: string) => ({ storage: s, ram: r })));
          }
        }
        let accesoryType = (p.specs as any).accesoryType;
        if (p.category === 'accesorios' && !accesoryType) {
          const name = p.name.toLowerCase();
          if (name.includes('airpods') || name.includes('buds')) accesoryType = 'audifonos';
          else if (name.includes('cargador') || name.includes('cable')) accesoryType = 'cargadores';
          else if (name.includes('case') || name.includes('funda')) accesoryType = 'cases';
        }
        return { ...p, tier, specs: { ...p.specs, accesoryType, variants, storageOptions: undefined, ramOptions: undefined } };
      });
      setPhones(migrated);
    });
  }, []);
  const [banners, setBanners] = useState<PromoBanner[]>(defaultBanners);
  const [cart, setCart] = useState<CartItem[]>(() => storage.getCart() || []);
  const [theme, setThemeState] = useState<ThemeColor>(() => storage.getTheme() || 'teal');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartHighlight, setCartHighlight] = useState(0);

  useEffect(() => {
    fetchInitialBanners().then(setBanners)
  }, [])

  useEffect(() => { storage.setPhones(phones); }, [phones]);
  useEffect(() => { storage.setBanners(banners); }, [banners]);
  useEffect(() => { storage.setCart(cart); }, [cart]);

  const setTheme = useCallback((t: ThemeColor) => {
    setThemeState(t);
    storage.setTheme(t);
  }, []);

  const getVariantPrice = (product: PhoneProduct, storage?: string, ram?: string): number => {
    if (!product.specs.variants || !storage && !ram) return product.price
    const match = product.specs.variants.find(v =>
      (!storage || v.storage === storage) &&
      (!ram || v.ram === ram)
    )
    return match?.price ?? product.price
  }

  const addToCart = useCallback((product: PhoneProduct, selectedStorage?: string, selectedRam?: string, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => cartItemMatches(item, product.id, selectedStorage, selectedRam));
      if (existing) {
        return prev.map(item =>
          cartItemMatches(item, product.id, selectedStorage, selectedRam)
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
            : item
        );
      }
      const variantPrice = getVariantPrice(product, selectedStorage, selectedRam)
      return [...prev, { product, quantity: Math.min(quantity, product.stock || 99), selectedStorage, selectedRam, price: variantPrice }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, selectedStorage?: string, selectedRam?: string) => {
    setCart(prev => prev.filter(item => !cartItemMatches(item, productId, selectedStorage, selectedRam)));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number, selectedStorage?: string, selectedRam?: string) => {
    if (qty <= 0) {
      removeFromCart(productId, selectedStorage, selectedRam);
      return;
    }
    setCart(prev => prev.map(item =>
      cartItemMatches(item, productId, selectedStorage, selectedRam)
        ? { ...item, quantity: qty }
        : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const triggerCartHighlight = useCallback(() => {
    setCartHighlight(h => h + 1);
  }, []);

  const updatePhone = useCallback((phone: PhoneProduct) => {
    setPhones(prev => prev.map(p => p.id === phone.id ? phone : p));
    api(`/phones/${phone.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(phone) });
  }, []);

  const addPhone = useCallback((phone: PhoneProduct) => {
    setPhones(prev => [...prev, phone]);
    api('/phones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(phone) });
  }, []);

  const deletePhone = useCallback((id: string) => {
    setPhones(prev => prev.filter(p => p.id !== id));
    api(`/phones/${id}`, { method: 'DELETE' });
  }, []);

  const updateBanner = useCallback((banner: PromoBanner) => {
    setBanners(prev => prev.map(b => b.id === banner.id ? banner : b));
    api(`/banners/${banner.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(banner) });
  }, []);

  const addBanner = useCallback((banner: PromoBanner) => {
    setBanners(prev => [...prev, banner]);
    api('/banners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(banner) });
  }, []);

  const removeBanner = useCallback((id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    api(`/banners/${id}`, { method: 'DELETE' });
  }, []);

  const resetDemo = useCallback(() => {
    storage.clearAll();
    api('/phones/seed', { method: 'POST' });
    api('/banners/seed', { method: 'POST' });
    setPhones(defaultPhones);
    setBanners(defaultBanners);
    setCart([]);
    setThemeState('teal');
  }, [setTheme]);

  const itemPrice = (item: CartItem) => item.price ?? item.product.price;

  const cartTotal = useCallback(() => cart.reduce((sum, item) => sum + itemPrice(item) * item.quantity, 0), [cart]);
  const cartDiscount = useCallback(() => 0, []);
  const cartNetTotal = useCallback(() => cartTotal(), [cartTotal]);
  const cartCount = useCallback(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const processOrder = useCallback((data: OrderFormData): string => {
    const itemSummary = cart
      .map(item => {
        const variant = [item.selectedStorage, item.selectedRam].filter(Boolean).join(' / ');
        const suffix = variant ? ` (${variant})` : ` (${item.product.specs.storage || 'N/A'})`;
        return `- ${item.product.name}${suffix} x${item.quantity}`;
      })
      .join('\n');
    const total = cartNetTotal();
    const message = `Hola SmartZone, mi nombre es ${data.name}. Me interesa adquirir los siguientes equipos:\n${itemSummary}\n\nTotal estimado: $${total.toFixed(2)}\nDirección de Entrega: ${data.address}\nMétodo de pago: ${data.payment}\n¡Quedo a la espera de la confirmación del stock!`;
    return `https://api.whatsapp.com/send?phone=50370000000&text=${encodeURIComponent(message)}`;
  }, [cart, cartNetTotal]);

  return (
    <StoreContext.Provider value={{
      phones, banners, cart, theme, setTheme,
      addToCart, removeFromCart, updateQuantity, clearCart,
      updatePhone, addPhone, deletePhone, updateBanner, addBanner, removeBanner, resetDemo,
      cartTotal, cartDiscount, cartNetTotal, cartCount,
      cartOpen, setCartOpen, checkoutOpen, setCheckoutOpen, cartHighlight, triggerCartHighlight, processOrder,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
