import { Smartphone, Zap, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const marcas = ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Motorola']

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-6 h-6 text-teal-400" />
              <span className="text-lg font-bold">SmartZone</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tu tienda de confianza para smartphones y accesorios originales.
              Tecnología al alcance de tu mano con los mejores precios del mercado.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Marcas</h3>
            <ul className="space-y-2">
              {marcas.map((marca) => (
                <li key={marca}>
                  <Link
                    to={`/celulares?marca=${marca.toLowerCase()}`}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {marca}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/celulares" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">
                  Celulares
                </Link>
              </li>
              <li>
                <Link to="/accesorios" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">
                  Accesorios
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-teal-400" />
                Av. Tecnológica 123, Ciudad Digital
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-teal-400" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-teal-400" />
                hola@smartzone.demo
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Zap className="w-4 h-4 mt-0.5 shrink-0 text-teal-400" />
                Lun–Sáb 9:00 – 20:00
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            &copy; 2026 SmartZone. Esta página es una maqueta frontend interactiva, creada para demostración de software comercial y experiencia de usuario.
          </p>
        </div>
      </div>
    </footer>
  )
}
