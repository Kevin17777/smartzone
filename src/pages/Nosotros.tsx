import { Shield, Award, Truck, Headphones, Mail, MapPin, Phone } from 'lucide-react';

const values = [
  { icon: Shield, title: 'Garantía de 1 año', desc: 'Todos nuestros equipos cuentan con garantía local y soporte técnico directo.' },
  { icon: Award, title: 'Productos Originales', desc: 'Trabajamos exclusivamente con distribuidores autorizados y sellos de garantía.' },
  { icon: Truck, title: 'Envío Gratis', desc: 'Envío sin costo en accesorios seleccionados y equipos premium a nivel nacional.' },
  { icon: Headphones, title: 'Soporte 24/7', desc: 'Atención personalizada por WhatsApp, chat en vivo y llamada directa.' },
];

export default function Nosotros() {
  return (
    <div>
      <section className="bg-gradient-to-br from-teal-600 to-emerald-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">SmartZone</h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Tu tienda de tecnología móvil de confianza. Somos apasionados por conectar 
            a las personas con la mejor tecnología al precio más justo.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Nuestra Filosofía</h2>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
            Creemos que la tecnología debe ser accesible, transparente y confiable. 
            Por eso ofrecemos precios competitivos, asesoría personalizada y un servicio 
            postventa excepcional.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Políticas de Garantía</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Cobertura de Garantía</h3>
              <p className="text-sm text-slate-600">Todos nuestros smartphones nuevos incluyen 1 año de garantía contra defectos de fábrica. Los equipos seminuevos tienen 6 meses de garantía. Equipos usados tienen 1 mes de garantía.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Devoluciones</h3>
              <p className="text-sm text-slate-600">Aceptamos devoluciones dentro de los primeros 7 días posteriores a la compra, siempre que el equipo se encuentre en su empaque original y sin señales de uso.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Servicio Técnico</h3>
              <p className="text-sm text-slate-600">Contamos con servicio técnico especializado para diagnóstico y reparación de equipos. Tiempo de respuesta promedio: 24-48 horas hábiles.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Contacto</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-6 border border-slate-100 text-center">
            <Mail className="w-6 h-6 text-teal-600 mx-auto mb-3" />
            <p className="font-medium text-slate-900">Email</p>
            <p className="text-sm text-slate-500">hola@smartzone.demo</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-100 text-center">
            <Phone className="w-6 h-6 text-teal-600 mx-auto mb-3" />
            <p className="font-medium text-slate-900">WhatsApp</p>
            <p className="text-sm text-slate-500">+503 7000-0000</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-100 text-center">
            <MapPin className="w-6 h-6 text-teal-600 mx-auto mb-3" />
            <p className="font-medium text-slate-900">Ubicación</p>
            <p className="text-sm text-slate-500">San Salvador, El Salvador</p>
          </div>
        </div>
      </section>
    </div>
  );
}
