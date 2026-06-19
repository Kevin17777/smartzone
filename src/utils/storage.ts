import type { PhoneProduct, PromoBanner, ThemeColor } from '../types/phone';

const KEYS = {
  PHONES: 'smartzone_phones',
  BANNERS: 'smartzone_banners',
  THEME: 'smartzone_theme',
  CART: 'smartzone_cart',
};

export const storage = {
  getPhones(): PhoneProduct[] | null {
    const data = localStorage.getItem(KEYS.PHONES);
    return data ? JSON.parse(data) : null;
  },
  setPhones(phones: PhoneProduct[]): void {
    localStorage.setItem(KEYS.PHONES, JSON.stringify(phones));
  },
  getBanners(): PromoBanner[] | null {
    const data = localStorage.getItem(KEYS.BANNERS);
    return data ? JSON.parse(data) : null;
  },
  setBanners(banners: PromoBanner[]): void {
    localStorage.setItem(KEYS.BANNERS, JSON.stringify(banners));
  },
  getTheme(): ThemeColor | null {
    return localStorage.getItem(KEYS.THEME) as ThemeColor | null;
  },
  setTheme(theme: ThemeColor): void {
    localStorage.setItem(KEYS.THEME, theme);
  },
  getCart(): any[] | null {
    const data = localStorage.getItem(KEYS.CART);
    return data ? JSON.parse(data) : null;
  },
  setCart(cart: any[]): void {
    localStorage.setItem(KEYS.CART, JSON.stringify(cart));
  },
  clearAll(): void {
    localStorage.removeItem(KEYS.PHONES);
    localStorage.removeItem(KEYS.BANNERS);
    localStorage.removeItem(KEYS.THEME);
    localStorage.removeItem(KEYS.CART);
  },
};
