import { useState } from 'react';
import { useStore } from '../../data/store';
import { formatCurrency } from '../../utils/formatCurrency';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import type { PhoneProduct } from '../../types/phone';
import ProductImage from '../shared/ProductImage';

interface InventoryTableProps {
  onEdit: (phone: PhoneProduct) => void;
  onAdd: () => void;
  lowStockFilter?: boolean;
}

export default function InventoryTable({ onEdit, onAdd, lowStockFilter }: InventoryTableProps) {
  const { phones, deletePhone } = useStore();
  const [search, setSearch] = useState('');

  const filtered = phones
    .filter((p) => !lowStockFilter || (p.stock > 0 && p.stock <= 5))
    .filter(
      (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
    );

  const handleDelete = (phone: PhoneProduct) => {
    if (window.confirm(`¿Eliminar "${phone.name}"? Esta acción no se puede deshacer.`)) {
      deletePhone(phone.id);
    }
  };

  const stockColor = (stock: number) => {
    if (stock === 0) return 'text-red-400';
    if (stock <= 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">Inventario</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Añadir Producto
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar por nombre o marca..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 text-white pl-10 pr-4 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm placeholder:text-slate-500"
        />
      </div>

      <div className="hidden lg:block bg-slate-900 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Producto</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Categoría</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">Precio</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">Stock</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Condición</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((phone) => (
              <tr key={phone.id} onClick={() => onEdit(phone)} className="border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <ProductImage name={phone.name} brand={phone.brand} color={phone.image_data || phone.image} className="w-10 h-10 rounded-lg flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">{phone.name}</p>
                      <p className="text-xs text-slate-500">{phone.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-300 capitalize">{phone.category}</td>
                <td className="py-3 px-4 text-right text-white">{formatCurrency(phone.price)}</td>
                <td className={`py-3 px-4 text-right font-medium ${stockColor(phone.stock)}`}>{phone.stock}</td>
                <td className="py-3 px-4 text-slate-300">{phone.condition}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(phone); }}
                      className="p-1.5 text-slate-400 hover:text-teal-400 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(phone); }}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-8">No se encontraron productos.</p>
        )}
      </div>

      <div className="lg:hidden grid gap-4">
        {filtered.map((phone) => (
          <div key={phone.id} onClick={() => onEdit(phone)} className="bg-slate-900 rounded-xl p-4 cursor-pointer hover:bg-slate-800/80 transition-colors">
            <div className="flex items-start gap-3">
              <ProductImage name={phone.name} brand={phone.brand} color={phone.image_data || phone.image} className="w-12 h-12 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{phone.name}</p>
                <p className="text-xs text-slate-500">{phone.brand}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs capitalize text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{phone.category}</span>
                  <span className="text-xs text-slate-400">{phone.condition}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={(e) => { e.stopPropagation(); onEdit(phone); }} className="p-1.5 text-slate-400 hover:text-teal-400">
                  <Pencil size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(phone); }} className="p-1.5 text-slate-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
              <span className="text-white font-semibold">{formatCurrency(phone.price)}</span>
              <span className={`text-sm font-medium ${stockColor(phone.stock)}`}>
                Stock: {phone.stock}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-8">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
}
