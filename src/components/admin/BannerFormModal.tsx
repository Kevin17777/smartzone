import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { BannerCategory, PromoBanner } from '../../types/phone';

interface BannerFormModalProps {
  banner: PromoBanner | null;
  onClose: () => void;
  onSave: (banner: PromoBanner) => void;
}

export default function BannerFormModal({ banner, onClose, onSave }: BannerFormModalProps) {
  const [previewSrc, setPreviewSrc] = useState('');
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    discount: '',
    category: 'celulares' as BannerCategory,
    color: 'from-violet-700 to-indigo-900',
    image: '',
    active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setPreviewSrc('');
    if (banner) {
      setForm({
        title: banner.title,
        subtitle: banner.subtitle,
        discount: banner.discount || '',
        category: banner.category || 'celulares',
        color: banner.color,
        image: banner.image || '',
        active: banner.active,
      });
    }
  }, [banner]);

  const set = (field: string, value: string | boolean) => {
    if (field === 'category') setPreviewSrc('');
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'El título es obligatorio';
    if (!form.subtitle.trim()) errs.subtitle = 'El subtítulo es obligatorio';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: PromoBanner = {
      id: banner ? banner.id : Date.now().toString(),
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      discount: form.discount.trim() || undefined,
      category: form.category,
      color: form.color,
      image: form.image.trim() || undefined,
      active: form.active,
    };
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-white mb-6">
          {banner ? 'Editar Banner' : 'Agregar Banner'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className={`w-full bg-slate-800 text-white px-3 py-2 rounded-lg border ${errors.title ? 'border-red-500' : 'border-slate-700'} focus:outline-none focus:border-teal-500 text-sm`}
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Subtítulo *</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => set('subtitle', e.target.value)}
              className={`w-full bg-slate-800 text-white px-3 py-2 rounded-lg border ${errors.subtitle ? 'border-red-500' : 'border-slate-700'} focus:outline-none focus:border-teal-500 text-sm`}
            />
            {errors.subtitle && <p className="text-xs text-red-400 mt-1">{errors.subtitle}</p>}
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Texto de descuento</label>
            <input
              type="text"
              value={form.discount}
              onChange={(e) => set('discount', e.target.value)}
              placeholder="Ej: 40% OFF"
              className={`w-full bg-slate-800 text-white px-3 py-2 rounded-lg border ${errors.discount ? 'border-red-500' : 'border-slate-700'} focus:outline-none focus:border-teal-500 text-sm`}
            />
            {errors.discount && <p className="text-xs text-red-400 mt-1">{errors.discount}</p>}
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Categoría de destino</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm"
            >
              <option value="celulares">Celulares</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Gradiente (color de fondo)</label>
              <select
                value={form.color}
                onChange={(e) => set('color', e.target.value)}
                className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm"
              >
                <option value="from-violet-700 to-indigo-900">Violeta a índigo</option>
                <option value="from-slate-800 to-zinc-950">Oscuro</option>
                <option value="from-teal-600 to-emerald-900">Verde teal</option>
                <option value="from-blue-700 to-cyan-900">Azul a cian</option>
                <option value="from-rose-700 to-pink-900">Rosa</option>
                <option value="from-amber-600 to-orange-900">Ámbar</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <div className={`w-full h-10 rounded-lg bg-gradient-to-r ${form.color}`} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Imagen de fondo</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.image}
                onChange={(e) => set('image', e.target.value)}
                placeholder="/images/banners/mi-banner"
                className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm"
              />
              <label className="flex-shrink-0 cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Subir
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => { if (ev.target?.result) setPreviewSrc(ev.target.result as string); };
                    reader.readAsDataURL(file);
                    const name = file.name.replace(/\.[^/.]+$/, '');
                    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                    set('image', `/images/banners/${slug}`);
                  }}
                />
              </label>
            </div>
            <p className="text-xs text-slate-500 mt-1">Usa "Subir" para autogenerar la ruta. Guarda el archivo en <code className="text-teal-400">public/images/banners/</code>.</p>
          </div>
          {previewSrc && (
            <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-700">
              <img src={previewSrc} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => set('active', e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 text-teal-600 focus:ring-teal-500 bg-slate-700"
              />
              Activo
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
              Cancelar
            </button>
            <button type="submit" className="rounded-lg bg-teal-600 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-500 transition-colors">
              {banner ? 'Guardar cambios' : 'Agregar banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}