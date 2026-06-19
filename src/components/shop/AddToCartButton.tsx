import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './AddToCartButton.css'

interface Props {
  onAddToCart: () => void
  onAnimationComplete?: () => void
  disabled?: boolean
  accesoryType?: string
}

const ICON_PATHS: Record<string, { body: string; details: string[] }> = {
  celulares: {
    body: 'M5 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3z',
    details: ['M7 5.5h10v12H7z', 'M11 3.5h2v.5h-2z'],
  },
  audifonos: {
    body: 'M5 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0z M13 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0z M6 9 Q 12 4 18 9 L 18 11 Q 12 6 6 11 Z',
    details: [],
  },
  cargadores: {
    body: 'M13 2L4 14h7l-2 8 9-12h-7l2-8z',
    details: [],
  },
  cases: {
    body: 'M5 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3z',
    details: ['M7 5h10v10H7z', 'M10 19h4v1h-4z', 'M8 2h8v2H8z'],
  },
}

export default function AddToCartButton({ onAddToCart, onAnimationComplete, disabled, accesoryType }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const onAddRef = useRef(onAddToCart)
  const onCompleteRef = useRef(onAnimationComplete)

  onAddRef.current = onAddToCart
  onCompleteRef.current = onAnimationComplete

  const icon = (accesoryType && ICON_PATHS[accesoryType]) ? ICON_PATHS[accesoryType] : ICON_PATHS.celulares

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const handleClick = (e: Event) => {
      e.preventDefault()
      if (button.classList.contains('active')) return
      button.classList.add('active')
      button.style.setProperty('--text-o', '0')
      onAddRef.current()

      gsap.to(button, {
        keyframes: [
          { '--background-scale': 0.97, duration: 0.15 },
          { '--background-scale': 1, delay: 0.125, duration: 1.2, ease: 'elastic.out(1, .6)' },
        ],
      })

      gsap.to(button, {
        keyframes: [
          { '--shirt-scale': 1, '--shirt-y': '-42px', '--cart-x': '0px', '--cart-scale': 1, duration: 0.4, ease: 'power1.in' },
          { '--shirt-y': '-40px', duration: 0.3 },
          { '--shirt-y': '16px', '--shirt-scale': 0.9, duration: 0.25, ease: 'none' },
          { '--shirt-scale': 0, duration: 0.3, ease: 'none' },
        ],
      })

      gsap.to(button, {
        '--shirt-second-y': '0px',
        delay: 0.835,
        duration: 0.12,
      })

      gsap.to(button, {
        keyframes: [
          { '--cart-clip': '12px', '--cart-clip-x': '3px', delay: 0.9, duration: 0.06 },
          { '--cart-y': '2px', duration: 0.1 },
          {
            '--cart-tick-offset': '0px',
            '--cart-y': '0px',
            duration: 0.2,
            onComplete() {
              button.style.overflow = 'hidden'
            },
          },
          { '--cart-x': '52px', '--cart-rotate': '-15deg', duration: 0.2 },
          {
            '--cart-x': '200px',
            '--cart-rotate': '0deg',
            duration: 0.25,
            onComplete() {
              button.classList.remove('active')
              button.querySelector('.cart')?.setAttribute('style', 'display:none')
              button.style.setProperty('--text-o', '1')
              button.style.setProperty('--text-x', '0px')
              if (textRef.current) textRef.current.textContent = '✓ Añadido al carrito'
              setTimeout(() => {
                onCompleteRef.current?.()
              }, 1500)
            },
          },
        ],
      })
    }

    button.addEventListener('click', handleClick)

    return () => {
      gsap.killTweensOf(button)
      button.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      className="add-to-cart-btn"
      disabled={disabled}
      type="button"
    >
      <span ref={textRef}>Añadir al carrito</span>
      <svg className="morph" viewBox="0 0 64 13">
        <path d="M0 12C6 12 17 12 32 12C47.9024 12 58 12 64 12V13H0V12Z" />
      </svg>
      <div className="shirt">
        <svg className="first" viewBox="0 0 24 24">
          <path d={icon.body} />
          {icon.details.map((d, i) => <g key={i}><path d={d} /></g>)}
        </svg>
        <svg className="second" viewBox="0 0 24 24">
          <path d={icon.body} />
          {icon.details.map((d, i) => <g key={i}><path d={d} /></g>)}
        </svg>
      </div>
      <div className="cart">
        <svg viewBox="0 0 36 26">
          <path d="M1 2.5H6L10 18.5H25.5L28.5 7.5L7.5 7.5" className="shape" />
          <path d="M11.5 25C12.6046 25 13.5 24.1046 13.5 23C13.5 21.8954 12.6046 21 11.5 21C10.3954 21 9.5 21.8954 9.5 23C9.5 24.1046 10.3954 25 11.5 25Z" className="wheel" />
          <path d="M24 25C25.1046 25 26 24.1046 26 23C26 21.8954 25.1046 21 24 21C22.8954 21 22 21.8954 22 23C22 24.1046 22.8954 25 24 25Z" className="wheel" />
          <path d="M14.5 13.5L16.5 15.5L21.5 10.5" className="tick" />
        </svg>
      </div>
    </button>
  )
}
