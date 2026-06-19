import { useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../data/store'

const defaultBrands = ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Motorola', 'Google', 'Huawei', 'Oppo']

export default function BrandMarquee() {
  const navigate = useNavigate()
  const { phones } = useStore()
  const brands = useMemo(() => {
    const dynamic = [...new Set(phones.map(p => p.brand).filter(b => b && b !== 'SmartZone'))]
    return dynamic.length >= 3 ? dynamic : defaultBrands
  }, [phones])

  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const posRef = useRef(0)
  const pausedRef = useRef(false)
  const draggingRef = useRef(false)
  const lastXRef = useRef(0)
  const velocityRef = useRef(0)
  const historyRef = useRef<Array<{ x: number; t: number }>>([])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const step = () => {
      const first = track.firstElementChild as HTMLElement | null
      if (first) {
        const firstW = first.offsetWidth + 16
        if (posRef.current < -firstW) {
          posRef.current += firstW
          track.appendChild(first)
        } else if (posRef.current > 0) {
          const last = track.lastElementChild as HTMLElement | null
          if (last) {
            posRef.current -= last.offsetWidth + 16
            track.prepend(last)
          }
        }
      }

      if (!draggingRef.current) {
        if (velocityRef.current !== 0) {
          posRef.current += velocityRef.current
          velocityRef.current *= 0.92
          if (Math.abs(velocityRef.current) < 0.1) {
            velocityRef.current = 0
          }
        } else if (!pausedRef.current) {
          posRef.current -= 0.4
        }
      }

      track.style.transform = `translateX(${posRef.current}px)`
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [brands])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onMove = (clientX: number) => {
      if (!draggingRef.current) return
      const dx = clientX - lastXRef.current
      lastXRef.current = clientX
      posRef.current += dx
      historyRef.current.push({ x: clientX, t: performance.now() })
      if (historyRef.current.length > 5) historyRef.current.shift()
    }

    const onEnd = () => {
      if (!draggingRef.current) return
      draggingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''

      const h = historyRef.current
      if (h.length >= 2) {
        const dt = h[h.length - 1].t - h[0].t
        const dx = h[h.length - 1].x - h[0].x
        if (dt > 0) {
          const vel = (dx / dt) * 16
          velocityRef.current = Math.max(-30, Math.min(30, vel))
        }
      }
      historyRef.current = []
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX)
    const onMouseUp = () => onEnd()

    const onTouchMove = (e: TouchEvent) => {
      onMove(e.touches[0].clientX)
      e.preventDefault()
    }
    const onTouchEnd = () => onEnd()

    const onDown = (clientX: number) => {
      draggingRef.current = true
      lastXRef.current = clientX
      velocityRef.current = 0
      historyRef.current = []
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      document.addEventListener('touchmove', onTouchMove, { passive: false })
      document.addEventListener('touchend', onTouchEnd)
    }

    const onMouseDown = (e: MouseEvent) => {
      onDown(e.clientX)
      e.preventDefault()
    }
    const onTouchStart = (e: TouchEvent) => {
      onDown(e.touches[0].clientX)
    }

    container.addEventListener('mousedown', onMouseDown)
    container.addEventListener('touchstart', onTouchStart, { passive: true })

    return () => {
      container.removeEventListener('mousedown', onMouseDown)
      container.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [brands])

  return (
    <div className="relative overflow-hidden py-8 select-none" style={{ touchAction: 'none' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4 text-center">Marcas Disponibles</p>
      </div>
      <div
        ref={containerRef}
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
      >
        <div
          ref={trackRef}
          className="flex gap-4 cursor-grab active:cursor-grabbing"
          style={{ width: 'max-content' }}
        >
          {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
            <button
              key={`${brand}-${i}`}
              onClick={(e) => {
                if (draggingRef.current) return
                e.stopPropagation()
                navigate(`/celulares?marca=${brand.toLowerCase()}`)
              }}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm whitespace-nowrap transition-all hover:border-teal-300 hover:text-teal-600 hover:shadow-md cursor-grab active:cursor-grabbing"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
