export type PhoneProduct = {
  id: string;
  name: string;
  brand: string;
  category: 'celulares' | 'accesorios';
  price: number;
  oldPrice?: number;
  description: string;
  stock: number;
  image: string;
  image_data?: string;
  featured: boolean;
  specs: {
    storage: string;
    ram: string;
    storageOptions?: string[];
    ramOptions?: string[];
    variants?: { storage: string; ram: string; price?: number }[];
    battery: string;
    camera: string;
    screen: string;
    accesoryType?: 'audifonos' | 'cargadores' | 'cases';
  };
  condition: 'Nuevo' | 'Seminuevo' | 'Usado';
  tier: 'Premium' | 'Media' | 'Económica';
};

export interface CartItem {
  product: PhoneProduct;
  quantity: number;
  selectedStorage?: string;
  selectedRam?: string;
  price?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface PromoBannerSpec {
  label: string;
  icon: string;
}

export type BannerCategory = 'celulares' | 'accesorios';

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  discount?: string;
  color: string;
  image?: string;
  active: boolean;
  category?: BannerCategory;
  specs?: PromoBannerSpec[];
}

export type ThemeColor = 'teal' | 'purple' | 'orange' | 'emerald';

export type OrderFormData = {
  name: string;
  address: string;
  payment: string;
};
