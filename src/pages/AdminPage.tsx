import { useState } from 'react';
import { useStore } from '../data/store';
import type { PhoneProduct, PromoBanner } from '../types/phone';
import AdminLayout from '../components/admin/AdminLayout';
import type { Tab } from '../components/admin/AdminLayout';
import SalesMetrics from '../components/admin/SalesMetrics';
import InventoryTable from '../components/admin/InventoryTable';
import ProductFormModal from '../components/admin/ProductFormModal';
import BannerFormModal from '../components/admin/BannerFormModal';

const IMG_EXTS = ['.webp', '.avif', '.jpg', '.jpeg', '.png'];
function hasExtension(path: string) { return IMG_EXTS.some(e => path.endsWith(e)); }
function BannerThumb({ image, color }: { image: string; color: string }) {
  const [extIdx, setExtIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const hasExt = hasExtension(image);
  const src = hasExt ? image : `${image}${IMG_EXTS[extIdx]}`;
  if (failed) return <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color} flex-shrink-0`} />;
  return (
    <img
      key={src}
      src={src}
      alt=""
      className="w-16 h-16 rounded-xl flex-shrink-0 object-cover"
      onError={() => {
        if (hasExt) { setFailed(true); return; }
        if (extIdx < IMG_EXTS.length - 1) setExtIdx(i => i + 1);
        else setFailed(true);
      }}
    />
  );
}

export default function AdminPage() {
  const { updateBanner, addBanner, removeBanner, banners } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [editingPhone, setEditingPhone] = useState<PhoneProduct | null>(null);
  const [addingPhone, setAddingPhone] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);
  const [addingBanner, setAddingBanner] = useState(false);
  const [lowStockFilter, setLowStockFilter] = useState(false);

  const handleEdit = (phone: PhoneProduct) => setEditingPhone(phone);
  const handleAdd = () => setAddingPhone(true);
  const handleCloseForm = () => { setEditingPhone(null); setAddingPhone(false); };

  const handleBannerSave = (banner: PromoBanner) => {
    const exists = banners.find(b => b.id === banner.id);
    if (exists) {
      updateBanner(banner);
    } else {
      addBanner(banner);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab !== 'inventario') setLowStockFilter(false);
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === 'dashboard' && <SalesMetrics onLowStockClick={() => { setLowStockFilter(true); setActiveTab('inventario'); }} />}

      {activeTab === 'inventario' && (
        <div className="mt-8">
          <InventoryTable onEdit={handleEdit} onAdd={handleAdd} lowStockFilter={lowStockFilter} />
        </div>
      )}

      {activeTab === 'promociones' && (
        <div className="mt-8 bg-slate-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Control de Promociones (Banners)</h2>
            <button
              onClick={() => setAddingBanner(true)}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 transition-colors"
            >
              + Agregar Banner
            </button>
          </div>
          <div className="grid gap-4">
            {banners.map(banner => (
              <div key={banner.id} className="bg-slate-800/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div
                  className="flex items-center gap-4 flex-1 cursor-pointer"
                  onClick={() => setEditingBanner(banner)}
                >
                  {banner.image ? (
                    <BannerThumb image={banner.image} color={banner.color} />
                  ) : (
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${banner.color} flex-shrink-0`} />
                  )}
                  <div>
                    <p className="text-white font-medium">{banner.title}</p>
                    <p className="text-xs text-slate-400">{banner.subtitle}</p>
                    <p className="text-xs text-teal-400 mt-1">{banner.discount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={banner.active}
                      onChange={() => updateBanner({ ...banner, active: !banner.active })}
                      className="h-4 w-4 rounded border-gray-600 text-teal-600 focus:ring-teal-500 bg-slate-700"
                    />
                    Activo
                  </label>
                  <button
                    onClick={() => removeBanner(banner.id)}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(editingPhone || addingPhone) && (
        <ProductFormModal phone={editingPhone} onClose={handleCloseForm} />
      )}

      {(editingBanner || addingBanner) && (
        <BannerFormModal
          banner={editingBanner}
          onClose={() => { setEditingBanner(null); setAddingBanner(false); }}
          onSave={handleBannerSave}
        />
      )}
    </AdminLayout>
  );
}
