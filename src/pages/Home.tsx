import { useStore } from '../data/store';
import { formatCurrency } from '../utils/formatCurrency';
import HeroSlider from '../components/home/HeroSlider';
import BrandMarquee from '../components/home/BrandMarquee';
import PromoDeals from '../components/home/PromoDeals';
import ProductImage from '../components/shared/ProductImage';
import { Link } from 'react-router-dom';
import { ChevronRight, Smartphone, Headphones, Shield, Zap } from 'lucide-react';
import { categories } from '../data/mockCategories';

const iconMap: Record<string, any> = { Smartphone, Headphones, Shield, Zap };

const CATEGORY_LINKS: Record<string, string> = {
  c1: '/celulares',
  c2: '/celulares',
  c3: '/celulares?marca=Apple',
  c4: '/celulares?marca=Samsung',
  c5: '/celulares?marca=Xiaomi',
  c6: '/accesorios?tipo=audifonos',
  c7: '/accesorios?tipo=cargadores',
  c8: '/accesorios?tipo=cases',
};

export default function Home() {
  const { phones } = useStore();
  const featured = phones.filter(p => p.featured && p.category === 'celulares').slice(0, 4);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-8">
        <HeroSlider />
      </div>
      <div className="mb-6">
        <BrandMarquee />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Categorías</h2>
          <p className="text-slate-500 mt-3">Explora nuestro catálogo por categoría</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {categories.map(cat => {
            const Icon = iconMap[cat.icon] || Smartphone;
            return (
              <Link
                key={cat.id}
                to={CATEGORY_LINKS[cat.id] || '/celulares'}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100"
              >
                <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-teal-100 transition-colors">
                  <Icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base md:text-lg">{cat.name}</h3>
                <p className="text-sm text-slate-500 mt-2">{cat.count} modelos</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Más Vendidos</h2>
              <p className="text-slate-500 mt-2">Los favoritos de nuestros clientes</p>
            </div>
            <Link to="/celulares" className="hidden sm:flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium text-sm">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {featured.map(phone => (
              <Link key={phone.id} to={`/celulares?highlight=${phone.id}`} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[3/4] overflow-hidden">
                  <ProductImage name={phone.name} brand={phone.brand} color={phone.image_data || phone.image} className="h-full w-full" />
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">{phone.brand}</span>
                    {phone.condition === 'Nuevo' && (
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full">Nuevo</span>
                    )}
                    {phone.condition === 'Seminuevo' && (
                      <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">Seminuevo</span>
                    )}
                    {phone.condition === 'Usado' && (
                      <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full">Usado</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 mt-3 text-sm md:text-base">{phone.name}</h3>
                  <p className="text-sm text-slate-500 mt-2">{phone.specs.storage} / {phone.specs.ram}</p>
                  <div className="flex items-center gap-2 mt-3 sm:gap-3">
                    <span className="text-base font-bold text-teal-600 sm:text-xl">{formatCurrency(phone.price)}</span>
                    {phone.oldPrice && (
                      <span className="text-[11px] text-slate-400 line-through sm:text-sm">{formatCurrency(phone.oldPrice)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/celulares" className="inline-flex items-center gap-1 text-teal-600 font-medium text-sm">
              Ver todos los productos <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-3xl p-12 md:p-20 text-white text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">¿Buscas el smartphone perfecto?</h2>
          <p className="text-teal-100 max-w-2xl mx-auto mb-6">
            Nuestros asesores te ayudarán a encontrar el dispositivo ideal para ti. 
            Asesoría personalizada, mejores precios y garantía de 1 año.
          </p>
          <Link to="/celulares" className="inline-flex items-center gap-2 bg-white text-teal-700 px-8 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-colors shadow-lg">
            Explorar Catálogo
          </Link>
        </div>
      </section>

      <PromoDeals />
    </div>
  );
}
