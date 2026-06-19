import { useState, useEffect } from 'react'
import { useStore } from '../../data/store'
import { Timer, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'
import ProductImage from '../shared/ProductImage'

function useCountdown(target: number) {
  const [remaining, setRemaining] = useState(target - Date.now())

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(target - Date.now(), 0))
    }, 1000)
    return () => clearInterval(id)
  }, [target])

  return remaining
}

function Countdown({ ms }: { ms: number }) {
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-rose-600">
      <Timer className="w-4 h-4" />
      <span>{pad(h)}h {pad(m)}m {pad(s)}s</span>
    </div>
  )
}

export default function PromoDeals() {
  const { phones } = useStore()
  const deals = phones.filter(p => p.oldPrice && p.oldPrice > p.price && p.category === 'celulares')
  const deadline = useState(() => Date.now() + 24 * 60 * 60 * 1000)[0]
  const remaining = useCountdown(deadline)

  if (deals.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ofertas por Tiempo Limitado</h2>
          <p className="text-sm text-gray-500 mt-2">Aprovecha descuentos exclusivos antes de que terminen</p>
        </div>
        <Countdown ms={remaining} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {deals.map(phone => {
          const discountPercent = phone.oldPrice
            ? Math.round(((phone.oldPrice - phone.price) / phone.oldPrice) * 100)
            : 0
          const inStock = phone.stock > 0

          return (
            <Link
              key={phone.id}
              to={`/celulares?highlight=${phone.id}`}
              className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg overflow-hidden cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <ProductImage name={phone.name} brand={phone.brand} color={phone.image_data || phone.image} className="h-full w-full" />
                {discountPercent > 0 && (
                  <span className="absolute top-3 right-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
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
                <h3 className="text-base font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                  {phone.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {phone.specs.storage && `${phone.specs.storage} · `}{phone.specs.ram && `${phone.specs.ram}`}
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                  {phone.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(phone.oldPrice)}
                    </span>
                  )}
                  <span className="text-xl font-extrabold text-gray-900">
                    {formatCurrency(phone.price)}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      inStock ? 'bg-emerald-500' : 'bg-red-400'
                    }`}
                  />
                  <span className={`text-xs font-medium ${inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                    {inStock ? `${phone.stock} en stock` : 'Agotado'}
                  </span>
                </div>

                <span
                  onClick={(e) => e.stopPropagation()}
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-teal-700 active:scale-95"
                >
                  Ver Oferta
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
