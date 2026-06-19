import { useState } from 'react';
import { useStore } from '../../data/store';
import { formatCurrency } from '../../utils/formatCurrency';
import { X, Wallet, CreditCard, Building2 } from 'lucide-react';

const paymentMethods = [
  { value: 'Efectivo', label: 'Efectivo', icon: Wallet },
  { value: 'Tarjeta de Crédito/Débito', label: 'Tarjeta Crédito/Débito', icon: CreditCard },
  { value: 'Transferencia Bancaria', label: 'Transferencia Bancaria', icon: Building2 },
];

export default function CheckoutForm() {
  const {
    checkoutOpen,
    setCheckoutOpen,
    cart,
    processOrder,
    clearCart,
    cartNetTotal,
  } = useStore();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('Efectivo');
  const [errors, setErrors] = useState<{ name?: string; address?: string }>({});
  const [success, setSuccess] = useState(false);

  if (!checkoutOpen) return null;

  const handleSubmit = () => {
    const newErrors: { name?: string; address?: string } = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!address.trim()) newErrors.address = 'La dirección es obligatoria';
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const url = processOrder({ name: name.trim(), address: address.trim(), payment });
    window.open(url, '_blank');
    clearCart();
    setSuccess(true);
    setName('');
    setAddress('');
    setPayment('Efectivo');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setCheckoutOpen(false)}
      />

      <div className="relative w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">
            {success ? '¡Pedido Enviado!' : 'Finalizar Compra'}
          </h2>
          <button
            onClick={() => {
              setCheckoutOpen(false);
              setSuccess(false);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white text-lg font-medium">Tu pedido fue procesado</p>
            <p className="text-gray-400 text-sm">
              Serás redirigido a WhatsApp para confirmar tu compra.
            </p>
            <button
              onClick={() => {
                setCheckoutOpen(false);
                setSuccess(false);
              }}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-800/50">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Resumen del pedido
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-400 truncate mr-2">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="text-white font-medium whitespace-nowrap">
                      {formatCurrency((item.price ?? item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-base font-bold mt-3 pt-3 border-t border-gray-800">
                <span className="text-white">Total</span>
                <span className="text-teal-400">{formatCurrency(cartNetTotal())}</span>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Nombre Completo <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Ingresa tu nombre completo"
                  autoComplete="name"
                  className={`w-full px-4 py-2.5 bg-gray-900 border ${
                    errors.name ? 'border-red-500' : 'border-gray-700'
                  } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Dirección de Entrega <span className="text-red-400">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                  }}
                  placeholder="Ingresa tu dirección"
                  autoComplete="street-address"
                  className={`w-full px-4 py-2.5 bg-gray-900 border ${
                    errors.address ? 'border-red-500' : 'border-gray-700'
                  } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors`}
                />
                {errors.address && (
                  <p className="text-red-400 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Método de Pago
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const selected = payment === method.value;
                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setPayment(method.value)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                          selected
                            ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                            : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800">
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors"
              >
                Finalizar Pedido por WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
