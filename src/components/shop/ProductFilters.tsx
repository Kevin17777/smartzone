import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface ProductFiltersProps {
  search: string
  onSearchChange: (v: string) => void
  selectedBrands: string[]
  onBrandsChange: (v: string[]) => void
  selectedStorage: string[]
  onStorageChange: (v: string[]) => void
  selectedCondition: string
  onConditionChange: (v: string) => void
  selectedTiers?: string[]
  onTiersChange?: (v: string[]) => void
  sortBy: string
  onSortChange: (v: string) => void
  showStorage?: boolean
  showTier?: boolean
}

const BRANDS = ['Samsung', 'Apple', 'Xiaomi', 'OnePlus', 'Motorola']
const STORAGES = ['64GB', '128GB', '256GB', '512GB', '1TB']
const CONDITIONS = ['Todas', 'Nuevo', 'Seminuevo', 'Usado']
const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Menor Precio' },
  { value: 'price-desc', label: 'Mayor Precio' },
  { value: 'newest', label: 'Novedades' },
]

export default function ProductFilters({
  search,
  onSearchChange,
  selectedBrands,
  onBrandsChange,
  selectedStorage,
  onStorageChange,
  selectedCondition,
  onConditionChange,
  selectedTiers = [],
  onTiersChange = () => {},
  sortBy,
  onSortChange,
  showStorage = true,
  showTier = true,
}: ProductFiltersProps) {
  const [open, setOpen] = useState(false)

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter((b) => b !== brand))
    } else {
      onBrandsChange([...selectedBrands, brand])
    }
  }

  const toggleStorage = (s: string) => {
    if (selectedStorage.includes(s)) {
      onStorageChange(selectedStorage.filter((x) => x !== s))
    } else {
      onStorageChange([...selectedStorage, s])
    }
  }

  const toggleTier = (tier: string) => {
    if (selectedTiers.includes(tier)) {
      onTiersChange(selectedTiers.filter((t) => t !== tier))
    } else {
      onTiersChange([...selectedTiers, tier])
    }
  }

  const resetAll = () => {
    onSearchChange('')
    onBrandsChange([])
    onStorageChange([])
    onConditionChange('Todas')
    onTiersChange([])
    onSortChange('price-asc')
  }

  const filterContent = (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Marca</label>
        {BRANDS.map((brand) => (
          <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => toggleBrand(brand)}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            {brand}
          </label>
        ))}
      </div>

      {showStorage && <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Almacenamiento</label>
        {STORAGES.map((s) => (
          <label key={s} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={selectedStorage.includes(s)}
              onChange={() => toggleStorage(s)}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            {s}
          </label>
        ))}
      </div>}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Condición</label>
        {CONDITIONS.map((c) => (
          <label key={c} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="condition"
              checked={selectedCondition === c}
              onChange={() => onConditionChange(c)}
              className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            {c}
          </label>
        ))}
      </div>

      {showTier && <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Gama</label>
        {['Premium', 'Media', 'Económica'].map((t) => (
          <label key={t} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={selectedTiers.includes(t)}
              onChange={() => toggleTier(t)}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            {t}
          </label>
        ))}
      </div>}

      <button
        onClick={resetAll}
        className="text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        Limpiar Filtros
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              {open ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
              Filtros
            </button>
          </div>
        </div>
        {open && (
          <div className="rounded-lg bg-gray-50 p-4">{filterContent}</div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {filterContent}
        </div>
      </div>
    </>
  )
}
