import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../../data/store'
import { ShoppingCart, Menu, X, Smartphone, Headphones, Info, Settings } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const themeAccent: Record<string, string> = {
  teal: 'text-teal-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  emerald: 'text-emerald-600',
}

const links = [
  { label: 'Inicio', path: '/', icon: Smartphone },
  { label: 'Celulares', path: '/celulares', icon: Smartphone },
  { label: 'Accesorios', path: '/accesorios', icon: Headphones },
  { label: 'Prueba', path: '/nosotros', icon: Info },
  { label: 'Admin', path: '/admin', icon: Settings },
]

export default function Navbar() {
  const { cartCount, cartOpen, setCartOpen, theme, cartHighlight } = useStore()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [highlight, setHighlight] = useState(false)
  const highlightRef = useRef<ReturnType<typeof setTimeout>>()

  const accent = themeAccent[theme] || 'text-teal-600'
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    if (cartHighlight > 0) {
      setHighlight(true)
      clearTimeout(highlightRef.current)
      highlightRef.current = setTimeout(() => setHighlight(false), 1900)
    }
    return () => clearTimeout(highlightRef.current)
  }, [cartHighlight])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-sm border-b ${
      isAdmin ? 'bg-slate-900 border-slate-800' : 'bg-white/80 border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className={`flex items-center gap-2 text-xl font-bold ${isAdmin ? 'text-white' : 'text-gray-900'}`}>
            <Smartphone className="w-6 h-6" />
            SmartZone
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const isActive = pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-medium transition-colors ${
                    isAdmin
                      ? isActive ? 'text-teal-400' : 'text-slate-400 hover:text-white'
                      : isActive ? accent : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className={`relative px-4 py-2.5 rounded-lg transition-colors ${
                isAdmin ? 'text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200'
              } ${highlight ? 'animate-cart-highlight' : ''}`}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount() > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full bg-teal-600">
                  {cartCount()}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className={`md:hidden border-t backdrop-blur-md ${
          isAdmin ? 'bg-slate-900 border-slate-800' : 'bg-white/95 border-gray-100'
        }`}>
          <div className="px-4 py-3 space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.path
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-lg font-medium transition-colors ${
                    isActive
                      ? isAdmin ? 'text-teal-400 bg-slate-800' : `${accent} bg-gray-50`
                      : isAdmin ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
