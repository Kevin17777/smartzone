import { useEffect, useState, useMemo } from 'react'
import type { PhoneProduct } from '../../types/phone'
import { X, Battery, Camera, Smartphone, Cpu, HardDrive, Check, Minus, Plus } from 'lucide-react'
import { useStore } from '../../data/store'
import { formatCurrency } from '../../utils/formatCurrency'
import ProductImage from '../shared/ProductImage'
import AddToCartButton from './AddToCartButton'

interface SpecsModalProps {
  phone: PhoneProduct | null
  onClose: () => void
}

function getVariantPrice(variants: { storage: string; ram: string; price?: number }[], storage: string, ram: string, basePrice: number): number {
  const match = variants.find(v => v.storage === storage && v.ram === ram)
  return match?.price ?? basePrice
}

export default function SpecsModal({ phone, onClose }: SpecsModalProps) {
  const { addToCart, triggerCartHighlight } = useStore()

  const variants = phone?.specs.variants
  const uniqueStorages = useMemo(() => {
    if (!variants) return []
    const storages = new Set(variants.map(v => v.storage))
    if (phone) storages.add(phone.specs.storage)
    return [...storages]
  }, [variants, phone])
  const hasVariants = variants && variants.length > 0

  const [selectedStorage, setSelectedStorage] = useState(phone?.specs.storage || '')
  const [selectedRam, setSelectedRam] = useState(phone?.specs.ram || '')
  const [quantity, setQuantity] = useState(1)

  const compatibleRams = useMemo(() => {
    if (!variants) return []
    const rams = new Set(variants.filter(v => v.storage === selectedStorage).map(v => v.ram))
    if (phone && selectedStorage === phone.specs.storage) rams.add(phone.specs.ram)
    return [...rams]
  }, [variants, selectedStorage, phone])

  const hasRamVariants = compatibleRams.length > 0

  const displayPrice = useMemo(() => {
    if (!phone) return 0
    if (!variants) return phone.price
    return getVariantPrice(variants, selectedStorage, selectedRam, phone.price)
  }, [phone, variants, selectedStorage, selectedRam])

  useEffect(() => {
    if (!phone) return
    setSelectedStorage(phone.specs.storage)
    setSelectedRam(phone.specs.ram)
    setQuantity(1)
  }, [phone])

  useEffect(() => {
    if (!compatibleRams.includes(selectedRam) && compatibleRams.length > 0) {
      setSelectedRam(compatibleRams[0])
    }
  }, [compatibleRams, selectedRam])

  useEffect(() => {
    if (!phone) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [phone, onClose])

  const exceededStock = quantity > (phone?.stock ?? 0)

  const handleAddToCart = () => {
    if (!phone || exceededStock) return
    addToCart(phone, selectedStorage, selectedRam, quantity)
  }

  if (!phone) return null

  const variantOldPrice = variants
    ? variants.find(v => v.storage === selectedStorage && v.ram === selectedRam)?.price
    : undefined
  const displayOldPrice = variantOldPrice && phone.oldPrice ? phone.oldPrice + (variantOldPrice - phone.price) : phone.oldPrice
  const discount = displayOldPrice ? Math.round((1 - displayPrice / displayOldPrice) * 100) : null

  const stockLabel = () => {
    if (phone.stock === 0) return <span className="text-sm font-semibold text-red-500">Agotado</span>
    if (phone.stock < 5) return <span className="text-sm font-semibold text-yellow-500">Últimas unidades</span>
    return <span className="text-sm font-semibold text-green-500">Disponible ({phone.stock})</span>
  }

  const specs = [
    { icon: HardDrive, label: 'Almacenamiento', value: selectedStorage },
    { icon: Cpu, label: 'RAM', value: selectedRam },
    { icon: Battery, label: 'Batería', value: phone.specs.battery },
    { icon: Camera, label: 'Cámara', value: phone.specs.camera },
    { icon: Smartphone, label: 'Pantalla', value: phone.specs.screen },
  ].filter((s) => s.value)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-3xl max-h-[90vh] animate-scale-up rounded-2xl bg-white shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
        <div className="relative w-full md:w-2/5 min-h-[180px] md:min-h-[520px] bg-gray-100">
          <ProductImage name={phone.name} brand={phone.brand} color={phone.image_data || phone.image} className="absolute inset-0 w-full h-full" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-black/30 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute left-3 bottom-3 z-10 flex gap-2">
            {phone.condition === 'Nuevo' && (
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 shadow">
                Nuevo
              </span>
            )}
            {phone.condition === 'Seminuevo' && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 shadow">
                Seminuevo
              </span>
            )}
            {phone.condition === 'Usado' && (
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 shadow">
                Usado
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{phone.brand}</span>
              <h2 className="text-lg font-bold text-gray-800 leading-tight">{phone.name}</h2>
            </div>
            {discount !== null && (
              <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                -{discount}%
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-teal-600">{formatCurrency(displayPrice)}</span>
            {displayOldPrice && displayOldPrice > displayPrice && (
              <span className="text-xs text-gray-400 line-through">{formatCurrency(displayOldPrice)}</span>
            )}
          </div>

          {phone.description && (
            <p className="text-xs leading-relaxed text-gray-600">{phone.description}</p>
          )}

          {hasVariants && (
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5 block">
                Almacenamiento {uniqueStorages.length === 1 && '(única opción)'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {uniqueStorages.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStorage(s)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      selectedStorage === s
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {selectedStorage === s && <Check className="w-3 h-3" />}
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasRamVariants && (
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5 block">
                RAM {compatibleRams.length === 1 && '(única opción)'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {compatibleRams.map(r => (
                  <button
                    key={r}
                    onClick={() => setSelectedRam(r)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      selectedRam === r
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {selectedRam === r && <Check className="w-3 h-3" />}
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {specs.map((s) => (
              <div key={s.label} className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                <s.icon className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-500">{s.label}</p>
                  <p className="text-xs font-medium text-gray-800">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">{stockLabel()}</div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-gray-800 select-none">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(phone.stock, q + 1))}
                disabled={quantity >= phone.stock}
                className="p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {exceededStock && (
              <span className="text-xs font-medium text-red-500">Supera el stock disponible</span>
            )}
          </div>

          <div className="flex justify-center">
            <AddToCartButton
              onAddToCart={handleAddToCart}
              onAnimationComplete={() => { onClose(); setTimeout(() => triggerCartHighlight(), 400); }}
              disabled={phone.stock === 0 || exceededStock}
              accesoryType={phone.specs.accesoryType}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
