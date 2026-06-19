import { useState, useMemo } from 'react'
import type { PhoneProduct } from '../../types/phone'
import { useStore } from '../../data/store'
import { formatCurrency } from '../../utils/formatCurrency'
import ProductImage from '../shared/ProductImage'
import { Eye, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  phone: PhoneProduct
  onViewSpecs: (phone: PhoneProduct) => void
}

export default function ProductCard({ phone, onViewSpecs }: ProductCardProps) {
  const { addToCart, triggerCartHighlight } = useStore()

  const variants = phone.specs.variants
  const uniqueStorages = useMemo(() => {
    if (!variants) return []
    const storages = new Set(variants.map(v => v.storage))
    storages.add(phone.specs.storage)
    return [...storages]
  }, [variants, phone.specs.storage])
  const hasVariants = variants && variants.length > 0

  const discount =
    phone.oldPrice ? Math.round((1 - phone.price / phone.oldPrice) * 100) : null

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasVariants) {
      onViewSpecs(phone)
    } else {
      addToCart(phone)
      triggerCartHighlight()
    }
  }

  const stockLabel = () => {
    if (phone.stock === 0) return <span className="text-xs font-semibold text-red-500">Agotado</span>
    if (phone.stock < 5) return <span className="text-xs font-semibold text-yellow-500">Últimas unidades</span>
    return <span className="text-xs font-semibold text-green-500">Disponible ({phone.stock})</span>
  }

  return (
    <div
      onClick={() => onViewSpecs(phone)}
      className="group relative flex flex-col rounded-2xl bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] active:shadow-lg cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
        <ProductImage name={phone.name} brand={phone.brand} color={phone.image_data || phone.image} className="h-full w-full" />
        {phone.brand && (
          <span className="absolute left-3 top-3 max-w-[45%] truncate rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-700 shadow-sm backdrop-blur-sm sm:px-3 sm:py-1 sm:text-xs">
            {phone.brand}
          </span>
        )}
        {phone.condition && (
          <span className={`absolute right-3 top-3 max-w-[45%] truncate rounded-full px-2 py-0.5 text-[10px] font-semibold sm:px-3 sm:py-1 sm:text-xs ${
            phone.condition === 'Nuevo' ? 'bg-green-100 text-green-700' :
            phone.condition === 'Seminuevo' ? 'bg-amber-100 text-amber-700' :
            'bg-violet-100 text-violet-700'
          }`}>
            {phone.condition}
          </span>
        )}
        {discount !== null && (
          <span className="absolute bottom-3 left-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
            -{discount}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:gap-3 sm:p-6">
        <h3 className="truncate text-sm font-bold text-gray-800 sm:text-base">{phone.name}</h3>
        {phone.specs.storage && phone.specs.ram && (
          <p className="text-xs text-gray-500 sm:text-sm">
            {phone.specs.storage} · {phone.specs.ram}
          </p>
        )}

        <div className="flex items-baseline gap-2 sm:gap-3">
          <span className="text-base font-bold text-teal-600 sm:text-xl">{formatCurrency(phone.price)}</span>
          {phone.oldPrice && (
            <span className="text-xs text-gray-400 line-through sm:text-sm">{formatCurrency(phone.oldPrice)}</span>
          )}
        </div>

        {hasVariants && (
          <div className="text-[10px] text-gray-400 leading-relaxed sm:text-[11px]">
            {uniqueStorages.length > 1 && <span>Almacenamiento: {uniqueStorages.join(' · ')}</span>}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2 sm:pt-3">
          {stockLabel()}
        </div>

        <div className="mt-2 flex gap-2 sm:mt-4 sm:gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onViewSpecs(phone); }}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-300 px-2 py-2 text-[11px] font-semibold text-gray-700 transition-colors hover:bg-gray-100 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-xs"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Ver Detalles</span>
            <span className="sm:hidden">Ver</span>
          </button>
          <button
            onClick={handleAdd}
            disabled={phone.stock === 0}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-teal-600 px-2 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-xs"
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            Añadir
          </button>
        </div>
      </div>
    </div>
  )
}

