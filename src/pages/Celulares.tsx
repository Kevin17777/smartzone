import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../data/store';
import type { PhoneProduct } from '../types/phone';
import ProductCard from '../components/shop/ProductCard';
import ProductFilters from '../components/shop/ProductFilters';
import SpecsModal from '../components/shop/SpecsModal';

function BrandBox({ brand, selected, onToggle }: { brand: string; selected: boolean; onToggle: () => void }) {
  const [logoFailed, setLogoFailed] = useState(false);
  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer transition-all duration-200 rounded-xl p-4 text-center flex flex-col items-center justify-center ${
        selected
          ? 'bg-gradient-to-br from-teal-50 to-emerald-50 ring-2 ring-teal-500 shadow-md'
          : 'bg-gradient-to-br from-slate-50 to-gray-100 shadow hover:shadow-md'
      }`}
    >
      {logoFailed ? (
        <span className="text-lg font-bold text-slate-600 leading-none mb-1">{brand[0]}</span>
      ) : (
        <img
          src={`/images/logos/${brand.toLowerCase()}.svg`}
          alt={brand}
          className="h-6 mx-auto mb-1"
          onError={() => setLogoFailed(true)}
        />
      )}
      <p className="text-xs font-medium text-slate-700">{brand}</p>
    </div>
  );
}



export default function Celulares() {
  const { phones } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const marca = new URLSearchParams(location.search).get('marca');
    return marca ? [marca.charAt(0).toUpperCase() + marca.slice(1)] : [];
  });
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState('Todas');
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('price-asc');
  const [specsPhone, setSpecsPhone] = useState<PhoneProduct | null>(null);
  const [highlightId] = useState(() => new URLSearchParams(location.search).get('highlight'));
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      navigate(location.pathname, { replace: true });
    }
  }, []);

  useEffect(() => {
    const marca = new URLSearchParams(location.search).get('marca');
    if (marca) {
      setSelectedBrands([marca.charAt(0).toUpperCase() + marca.slice(1)]);
    }
  }, [location.search]);

  const celulares = useMemo(() => phones.filter(p => p.category === 'celulares'), [phones]);

  const filtered = useMemo(() => {
    let result = [...celulares];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.some(b => p.brand.toLowerCase() === b.toLowerCase()));
    }
    if (selectedStorage.length > 0) {
      result = result.filter(p => selectedStorage.includes(p.specs.storage));
    }
    if (selectedCondition !== 'Todas') {
      result = result.filter(p => p.condition === selectedCondition);
    }
    if (selectedTiers.length > 0) {
      result = result.filter(p => selectedTiers.includes(p.tier));
    }

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1)); break;
    }

    return result;
  }, [celulares, search, selectedBrands, selectedStorage, selectedCondition, selectedTiers, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      <div className="mb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Celulares</h1>
        <p className="text-slate-500 mt-1">{filtered.length} modelos encontrados</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {['Samsung', 'Apple', 'Xiaomi'].map(brand => (
          <BrandBox
            key={brand}
            brand={brand}
            selected={selectedBrands.some(b => b.toLowerCase() === brand.toLowerCase())}
            onToggle={() => {
              if (selectedBrands.length === 1 && selectedBrands.some(b => b.toLowerCase() === brand.toLowerCase())) {
                setSelectedBrands([]);
              } else {
                setSelectedBrands([brand]);
              }
            }}
          />
        ))}
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
          selectedTiers={selectedTiers}
          onTiersChange={setSelectedTiers}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No encontramos productos con esos filtros.</p>
              <button onClick={() => { setSearch(''); setSelectedBrands([]); setSelectedStorage([]); setSelectedCondition('Todas'); setSelectedTiers([]); }} className="mt-4 text-teal-600 font-medium hover:text-teal-700">
                Limpiar filtros
              </button>
            </div>
          ) : (
            ['Premium', 'Media', 'Económica'].map(tier => {
              const tierPhones = filtered.filter(p => p.tier === tier);
              if (tierPhones.length === 0) return null;
              return (
                <div key={tier} className="mb-10">
                  <div className="flex items-center gap-3 mb-5 mt-6">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      tier === 'Premium' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 ring-1 ring-amber-300' :
                      tier === 'Media' ? 'bg-gradient-to-r from-sky-100 to-blue-100 text-blue-800 ring-1 ring-blue-300' :
                      'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 ring-1 ring-slate-300'
                    }`}>
                      {tier}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    {tierPhones.map(phone => (
                      <div key={phone.id} ref={phone.id === highlightId ? highlightRef : undefined} className={phone.id === highlightId ? 'relative z-10 ring-4 ring-teal-400 rounded-2xl animate-highlight-fade' : ''}>
                        <ProductCard phone={phone} onViewSpecs={setSpecsPhone} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <SpecsModal phone={specsPhone} onClose={() => setSpecsPhone(null)} />
    </div>
  );
}
