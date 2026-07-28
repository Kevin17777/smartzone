import { useState, useEffect, useRef } from 'react'
import { useStore } from '../../data/store'
import { ChevronLeft, ChevronRight, Star, Zap, Battery, Shield, Headphones, Cpu, Camera, Smartphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const iconMap: Record<string, any> = { Star, Zap, Battery, Shield, Headphones, Cpu, Camera, Smartphone }
const IMG_EXTS = ['.webp', '.avif', '.jpg', '.jpeg', '.png']

function hasExtension(path: string) {
  return IMG_EXTS.some(e => path.endsWith(e))
}

function BannerImage({ image }: { image: string }) {
  const [extIdx, setExtIdx] = useState(0)
  const [failed, setFailed] = useState(false)
  const hasExt = hasExtension(image)
  const src = hasExt ? image : `${image}${IMG_EXTS[extIdx]}`
  if (failed) return <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
  return (
    <>
      <img
        key={src}
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-fill"
        onError={() => {
          if (hasExt) { setFailed(true); return }
          if (extIdx < IMG_EXTS.length - 1) setExtIdx(i => i + 1)
          else setFailed(true)
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
    </>
  )
}

export default function HeroSlider() {
  const { banners } = useStore()
  const navigate = useNavigate()
  const activeBanners = banners.filter(b => b.active)
  const [current, setCurrent] = useState(0)
  const [prevIdx, setPrevIdx] = useState<number | null>(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    if (activeBanners.length === 0) return
    const timer = setInterval(() => {
      if (!pausedRef.current) setCurrent(prev => (prev + 1) % activeBanners.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [activeBanners.length])

  useEffect(() => {
    if (prevIdx !== null) {
      const t = setTimeout(() => setPrevIdx(null), 500)
      return () => clearTimeout(t)
    }
  }, [prevIdx])

  if (activeBanners.length === 0) return null

  const banner = activeBanners[current]

  const goTo = (idx: number) => {
    if (idx === current) return
    setPrevIdx(current)
    setCurrent(idx)
  }

  const next = () => goTo((current + 1) % activeBanners.length)
  const prev = () => goTo((current - 1 + activeBanners.length) % activeBanners.length)

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl" onMouseEnter={() => { pausedRef.current = true }} onMouseLeave={() => { pausedRef.current = false }}>
      <div
        className={`relative flex min-h-[420px] sm:min-h-[480px] md:min-h-[560px] items-center px-8 sm:px-12 md:px-16 py-12 transition-all duration-700 bg-gradient-to-r ${banner.color}`}
      >
        {banner.image && (
          <BannerImage key={banner.image} image={banner.image} />
        )}

        {prevIdx !== null && (
          <div key={prevIdx} className={`absolute inset-0 z-10 flex items-center px-8 sm:px-12 md:px-16 bg-gradient-to-r ${activeBanners[prevIdx].color} pointer-events-none animate-fade-out`}>
            <div className="max-w-xl">
              {activeBanners[prevIdx].discount && <span className="inline-block mb-4 rounded-full bg-white/20 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                {activeBanners[prevIdx].discount}
              </span>}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                {activeBanners[prevIdx].title}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/80 max-w-lg leading-relaxed">
                {activeBanners[prevIdx].subtitle}
              </p>
            </div>
          </div>
        )}

        <div key={current} className="relative z-10 max-w-xl animate-fade-in">
          {banner.discount && <span className="inline-block mb-4 rounded-full bg-white/20 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {banner.discount}
          </span>}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
            {banner.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/80 max-w-lg leading-relaxed">
            {banner.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate(banner.category === 'accesorios' ? '/accesorios' : '/celulares')}
              className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Explorar ofertas
            </button>
            <button
              onClick={() => navigate(banner.category === 'accesorios' ? '/accesorios' : '/celulares')}
              className="rounded-lg border border-white/40 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Ver Lanzamientos
            </button>
          </div>
        </div>

        {banner.specs && banner.specs.length > 0 && (
          <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-3">
            {banner.specs.map((spec, i) => {
              const Icon = iconMap[spec.icon]
              if (!Icon) return null
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-md"
                >
                  <Icon className="w-4 h-4 text-yellow-300" />
                  <span className="text-xs font-medium text-white whitespace-nowrap">{spec.label}</span>
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/40"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/40"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {activeBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-6 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
