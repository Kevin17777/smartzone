import { useStore } from '../../data/store';
import { formatCurrency } from '../../utils/formatCurrency';
import ProductImage from '../shared/ProductImage';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartDiscount,
    cartNetTotal,
    cartCount,
    setCheckoutOpen,
  } = useStore();

  const count = cartCount();

  return (
    <>
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setCartOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] bg-gray-950 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">
            Tu Carrito ({count} {count === 1 ? 'item' : 'items'})
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg font-medium mb-2">Tu carrito está vacío</p>
            <p className="text-gray-600 text-sm mb-6">Agrega productos para empezar tu compra</p>
            <button
              onClick={() => setCartOpen(false)}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-xl transition-colors"
            >
              Explorar productos
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.map((item) => {
                const variantLabel = [item.selectedStorage, item.selectedRam].filter(Boolean).join(' / ')
                return (
                  <div
                    key={`${item.product.id}_${item.selectedStorage || ''}_${item.selectedRam || ''}`}
                    className="flex gap-3 bg-gray-900/60 rounded-xl p-3 border border-gray-800/50"
                  >
                    <ProductImage name={item.product.name} brand={item.product.brand} color={item.product.image} className="w-16 h-16 rounded-xl flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{item.product.name}</p>
                      {variantLabel && (
                        <p className="text-gray-500 text-xs mt-0.5">{variantLabel}</p>
                      )}
                      {!variantLabel && (
                        <p className="text-gray-500 text-xs mt-0.5">{item.product.specs.storage}</p>
                      )}
                      <p className="text-teal-400 text-sm font-semibold mt-1">
                        {formatCurrency(item.price ?? item.product.price)}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedStorage, item.selectedRam)}
                            className="p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                          >
                            {item.quantity === 1 ? (
                              <Trash2 className="w-3.5 h-3.5" />
                            ) : (
                              <Minus className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span className="w-7 text-center text-white text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedStorage, item.selectedRam)}
                            className="p-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm">
                            {formatCurrency((item.price ?? item.product.price) * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedStorage, item.selectedRam)}
                            className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-900/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-gray-800 px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-medium">{formatCurrency(cartTotal())}</span>
              </div>
              {cartDiscount() > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Descuento total</span>
                  <span className="text-emerald-400 font-medium">
                    -{formatCurrency(cartDiscount())}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold border-t border-gray-800 pt-3">
                <span className="text-white">Total</span>
                <span className="text-teal-400">{formatCurrency(cartNetTotal())}</span>
              </div>
              <button
                onClick={() => {
                  setCheckoutOpen(true);
                }}
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors mt-2"
              >
                Proceder al Pago
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
