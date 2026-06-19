import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../data/store';
import type { PhoneProduct } from '../types/phone';
import ProductCard from '../components/shop/ProductCard';
import ProductFilters from '../components/shop/ProductFilters';
import SpecsModal from '../components/shop/SpecsModal';
import { Headphones, Zap, Shield } from 'lucide-react';

type Subcategory = 'audifonos' | 'cargadores' | 'cases';

export default function Accesorios() {
  const { phones } = useStore();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState('Todas');
  const [sortBy, setSortBy] = useState('price-asc');
  const [specsPhone, setSpecsPhone] = useState<PhoneProduct | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(() => {
    const tipo = new URLSearchParams(location.search).get('tipo');
    if (tipo === 'audifonos' || tipo === 'cargadores' || tipo === 'cases') return tipo;
    return null;
  });

  const accesorios = useMemo(() => phones.filter(p => p.category === 'accesorios'), [phones]);

  const filtered = useMemo(() => {
    let result = [...accesorios];
    if (subcategory) {
      result = result.filter(p => p.specs.accesoryType === subcategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }
    if (selectedStorage.length > 0) {
      result = result.filter(p => selectedStorage.includes(p.specs.storage));
    }
    if (selectedCondition !== 'Todas') {
      result = result.filter(p => p.condition === selectedCondition);
    }
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1)); break;
    }
    return result;
  }, [accesorios, search, selectedBrands, selectedStorage, selectedCondition, sortBy, subcategory]);

  const handleSubcategoryClick = (cat: Subcategory) => {
    setSubcategory(prev => prev === cat ? null : cat);
  };

  const subCatClass = (cat: Subcategory) =>
    `cursor-pointer transition-all duration-200 rounded-xl p-4 text-center flex flex-col items-center justify-center ${
      subcategory === cat
        ? 'ring-2 ring-teal-500 shadow-md'
        : 'hover:shadow-md'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      <div className="mb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Accesorios</h1>
        <p className="text-slate-500 mt-1">Complementa tu dispositivo con nuestros accesorios</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div onClick={() => handleSubcategoryClick('audifonos')} className={`bg-gradient-to-br from-teal-50 to-emerald-50 ${subCatClass('audifonos')}`}>
          <Headphones className="w-6 h-6 text-teal-600 mx-auto mb-1" />
          <p className="text-xs font-medium text-slate-700">Audífonos</p>
        </div>
        <div onClick={() => handleSubcategoryClick('cargadores')} className={`bg-gradient-to-br from-amber-50 to-orange-50 ${subCatClass('cargadores')}`}>
          <Zap className="w-6 h-6 text-amber-600 mx-auto mb-1" />
          <p className="text-xs font-medium text-slate-700">Cargadores</p>
        </div>
        <div onClick={() => handleSubcategoryClick('cases')} className={`bg-gradient-to-br from-blue-50 to-indigo-50 ${subCatClass('cases')}`}>
          <Shield className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <p className="text-xs font-medium text-slate-700">Cases</p>
        </div>
      </div>

      <div className="lg:flex lg:gap-8">
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          selectedBrands={selectedBrands}
          onBrandsChange={setSelectedBrands}
          selectedStorage={selectedStorage}
          onStorageChange={setSelectedStorage}
          selectedCondition={selectedCondition}
          onConditionChange={setSelectedCondition}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showStorage={false}
          showTier={false}
        />

        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-6 lg:mt-0">
            {filtered.map(item => (
              <ProductCard key={item.id} phone={item} onViewSpecs={setSpecsPhone} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No encontramos accesorios con esos filtros.</p>
              <button onClick={() => { setSearch(''); setSelectedBrands([]); setSelectedStorage([]); setSelectedCondition('Todas'); setSubcategory(null); }} className="mt-4 text-teal-600 font-medium hover:text-teal-700">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      <SpecsModal phone={specsPhone} onClose={() => setSpecsPhone(null)} />
    </div>
  );
}
