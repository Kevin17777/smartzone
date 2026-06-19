import type { Category, PromoBanner } from '../types/phone';

export const categories: Category[] = [
  { id: 'c1', name: 'Smartphones Premium', icon: 'Smartphone', count: 14 },
  { id: 'c2', name: 'Gama Media / Económica', icon: 'Smartphone', count: 10 },
  { id: 'c3', name: 'Apple (iPhone)', icon: 'Apple', count: 6 },
  { id: 'c4', name: 'Samsung (Galaxy)', icon: 'Smartphone', count: 6 },
  { id: 'c5', name: 'Xiaomi / Redmi', icon: 'Tablet', count: 6 },
  { id: 'c6', name: 'Audífonos y Audio', icon: 'Headphones', count: 4 },
  { id: 'c7', name: 'Cargadores y Cables', icon: 'Zap', count: 5 },
  { id: 'c8', name: 'Protectores y Cases', icon: 'Shield', count: 4 },
];

export const defaultBanners: PromoBanner[] = [
  {
    id: 'b1',
    title: 'Lanzamiento: Galaxy S25 Ultra',
    subtitle: '200MP de cámara, IA integrada y 512GB de almacenamiento',
    discount: 'Hasta -$200 OFF',
    color: 'from-violet-700 to-indigo-900',
    image: '/images/banners/banner-s25.jpg',
    category: 'celulares',
    specs: [{ label: '200MP Cámara', icon: 'Star' }, { label: '120W Carga', icon: 'Zap' }, { label: '512GB', icon: 'Battery' }],
    active: true,
  },
  {
    id: 'b2',
    title: 'iPhone 16 Pro Max',
    subtitle: 'El poder del chip A18 Pro en tus manos. Titanio y 48MP.',
    discount: '12 meses sin intereses',
    category: 'celulares',
    color: 'from-slate-800 to-zinc-950',
    active: true,
  },
  {
    id: 'b3',
    title: 'Ofertas en Accesorios',
    subtitle: 'Audífonos, cargadores y cases con hasta 40% de descuento',
    discount: '40% OFF',
    category: 'accesorios',
    color: 'from-teal-600 to-emerald-900',
    image: '/images/banners/banner-accesorios.jpg',
    active: true,
  },
];
