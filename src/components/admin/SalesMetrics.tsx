import { useStore } from '../../data/store';
import { formatCurrency } from '../../utils/formatCurrency';
import { Package, AlertTriangle, DollarSign, ShoppingCart } from 'lucide-react';

interface SalesMetricsProps {
  onLowStockClick?: () => void;
}

export default function SalesMetrics({ onLowStockClick }: SalesMetricsProps) {
  const { phones, cart } = useStore();

  const dailyRevenue = phones.reduce((s, p) => s + p.price, 0) / 100 * 3.2;
  const queueOrders = phones.filter((f) => f.featured).length + cart.length;
  const lowStock = phones.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const totalSKUs = phones.length;

  const metrics = [
    { label: 'Ingresos del Día', value: formatCurrency(dailyRevenue), icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Órdenes en Cola', value: queueOrders.toString(), icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Productos con Stock Bajo', value: lowStock.toString(), icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', onClick: onLowStockClick },
    { label: 'Total SKUs', value: totalSKUs.toString(), icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const simulatedOrders = [
    { id: 'SMZ-1001', customer: 'María García', items: 2, total: 1450.00, status: 'Completado' },
    { id: 'SMZ-1002', customer: 'Carlos López', items: 1, total: 899.99, status: 'En Proceso' },
    { id: 'SMZ-1003', customer: 'Ana Martínez', items: 3, total: 2340.50, status: 'Pendiente' },
    { id: 'SMZ-1004', customer: 'José Rodríguez', items: 1, total: 299.99, status: 'Completado' },
    { id: 'SMZ-1005', customer: 'Laura Fernández', items: 2, total: 1180.00, status: 'En Proceso' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className={`${m.bg} rounded-xl p-5 ${m.onClick ? 'cursor-pointer hover:ring-2 hover:ring-yellow-500/50 transition-all' : ''}`} onClick={m.onClick}>
              <div className="flex items-center justify-between mb-3">
                <Icon size={24} className={m.color} />
                <span className="text-xs text-slate-500">{m.label}</span>
              </div>
              <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
              <p className="text-xs text-slate-500 mt-1">{m.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Últimas Órdenes Simuladas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-2 text-slate-400 font-medium">ID</th>
                <th className="text-left py-3 px-2 text-slate-400 font-medium">Cliente</th>
                <th className="text-center py-3 px-2 text-slate-400 font-medium">Artículos</th>
                <th className="text-right py-3 px-2 text-slate-400 font-medium">Total</th>
                <th className="text-right py-3 px-2 text-slate-400 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {simulatedOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-2 text-slate-300 font-mono">{order.id}</td>
                  <td className="py-3 px-2 text-white">{order.customer}</td>
                  <td className="py-3 px-2 text-center text-slate-300">{order.items}</td>
                  <td className="py-3 px-2 text-right text-white">{formatCurrency(order.total)}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Completado' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'En Proceso' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
