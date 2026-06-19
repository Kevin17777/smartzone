import { useState, useEffect } from 'react';
import { useStore } from '../../data/store';
import { X, Plus, Trash2 } from 'lucide-react';
import type { PhoneProduct } from '../../types/phone';

interface ProductFormModalProps {
  phone: PhoneProduct | null;
  onClose: () => void;
}

const emptyForm = {
  name: '',
  brand: '',
  category: 'celulares' as 'celulares' | 'accesorios',
  price: 0,
  oldPrice: 0,
  stock: 1,
  description: '',
  condition: 'Nuevo' as 'Nuevo' | 'Seminuevo' | 'Usado',
  image: '',
  image_data: '' as string | undefined,
  featured: false,
  tier: 'Media' as 'Premium' | 'Media' | 'Económica',
  storage: '',
  ram: '',
  variants: [{ storage: '', ram: '', price: undefined }] as { storage: string; ram: string; price?: number }[],
  battery: '',
  camera: '',
  screen: '',
  accesoryType: '' as 'audifonos' | 'cargadores' | 'cases' | '',
};

export default function ProductFormModal({ phone, onClose }: ProductFormModalProps) {
  const { addPhone, updatePhone, phones } = useStore();
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewSrc, setPreviewSrc] = useState('');
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [compatHighlightedIdx, setCompatHighlightedIdx] = useState(-1);

  const COMPAT_SUGGESTIONS = ['iPhone', 'Android'];
  const compatSuggestions = form.camera.trim()
    ? COMPAT_SUGGESTIONS.filter(s => s.toLowerCase().includes(form.camera.toLowerCase()))
    : [];

  const selectCompat = (val: string) => {
    set('camera', val);
    setShowCompatSuggestions(false);
    setCompatHighlightedIdx(-1);
  };

  const handleCompatKeyDown = (e: React.KeyboardEvent) => {
    if (!showCompatSuggestions || compatSuggestions.length === 0) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setShowCompatSuggestions(true);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setCompatHighlightedIdx(prev => (prev + 1) % compatSuggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setCompatHighlightedIdx(prev => (prev - 1 + compatSuggestions.length) % compatSuggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (compatHighlightedIdx >= 0) selectCompat(compatSuggestions[compatHighlightedIdx]);
        break;
      case 'Escape':
        setShowCompatSuggestions(false);
        setCompatHighlightedIdx(-1);
        break;
      case 'Tab':
        setShowCompatSuggestions(false);
        setCompatHighlightedIdx(-1);
        break;
    }
  };

  const existingBrands = [...new Set(phones.map(p => p.brand))].sort();
  const brandSuggestions = form.brand.trim()
    ? existingBrands.filter(b => b.toLowerCase().includes(form.brand.toLowerCase()))
    : [];

  const selectBrand = (b: string) => {
    set('brand', b);
    setShowBrandSuggestions(false);
    setHighlightedIdx(-1);
  };

  const handleBrandKeyDown = (e: React.KeyboardEvent) => {
    if (!showBrandSuggestions || brandSuggestions.length === 0) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setShowBrandSuggestions(true);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIdx(prev => (prev + 1) % brandSuggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIdx(prev => (prev - 1 + brandSuggestions.length) % brandSuggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIdx >= 0) selectBrand(brandSuggestions[highlightedIdx]);
        break;
      case 'Escape':
        setShowBrandSuggestions(false);
        setHighlightedIdx(-1);
        break;
      case 'Tab':
        setShowBrandSuggestions(false);
        setHighlightedIdx(-1);
        break;
    }
  };

  useEffect(() => {
    if (phone) {
      setForm({
        name: phone.name,
        brand: phone.brand,
        category: phone.category,
        price: phone.price,
        oldPrice: phone.oldPrice || 0,
        stock: phone.stock,
        description: phone.description,
        condition: phone.condition,
        tier: phone.tier,
        image: phone.image,
        image_data: phone.image_data,
        featured: phone.featured,
        storage: phone.specs.storage,
        ram: phone.specs.ram,
        variants: phone.specs.variants?.length ? phone.specs.variants : [{ storage: '', ram: '', price: undefined }],
        battery: phone.specs.battery,
        camera: phone.specs.camera,
        screen: phone.specs.screen,
        accesoryType: phone.specs.accesoryType || '',
      });
      if (phone.image_data) setPreviewSrc(phone.image_data);
    } else {
      setForm({ ...emptyForm });
    }
    setPreviewSrc('');
    setErrors({});
  }, [phone]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio';
    if (!form.brand.trim()) errs.brand = 'La marca es obligatoria';
    if (form.price <= 0) errs.price = 'El precio debe ser mayor a 0';
    if (form.stock < 0) errs.stock = 'El stock no puede ser negativo';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const normalizeUnit = (val: string, unit: string): string => {
    const s = val.trim();
    if (!s) return s;
    const re = new RegExp(`^(\\d+(?:\\.\\d+)?)\\s*${unit}$`, 'i');
    const m = s.match(re);
    if (m) return `${m[1]}${unit}`;
    if (/^\d+(\.\d+)?$/.test(s)) return `${s}${unit}`;
    return s;
  };

  const normalizeScreen = (val: string): string => {
    const s = val.trim();
    if (!s) return s;
    if (/[""'']/.test(s)) return s;
    if (/\d/.test(s)) return `${s}"`;
    return s;
  };

  const normalizeStorage = (val: string): string => {
    const s = val.trim().toUpperCase();
    if (!s) return s;
    if (/^\d+\s*(GB|TB)$/.test(s)) return s.replace(/\s+/g, '');
    if (/^\d+$/.test(s)) return `${s}GB`;
    return s;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const nRam = normalizeUnit(form.ram, 'GB');
    const nBattery = normalizeUnit(form.battery, 'mAh');
    const nCamera = normalizeUnit(form.camera, 'MP');
    const nScreen = normalizeScreen(form.screen);
    const nStorage = normalizeStorage(form.storage);

    const productData: PhoneProduct = {
      id: phone ? phone.id : Date.now().toString(),
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      price: form.price,
      oldPrice: form.oldPrice > 0 ? form.oldPrice : undefined,
      stock: form.stock,
      description: form.description,
      condition: form.condition,
      tier: form.tier,
      image: form.image_data || form.image,
      image_data: form.image_data || undefined,
      featured: form.featured,
      specs: {
        storage: nStorage,
        ram: nRam,
        variants: form.variants.filter(v => v.storage && v.ram).length > 0
          ? form.variants.filter(v => v.storage && v.ram).map(v => ({
              storage: normalizeStorage(v.storage),
              ram: normalizeUnit(v.ram, 'GB'),
              ...(v.price && v.price > 0 ? { price: v.price } : {}),
            }))
          : undefined,
        battery: nBattery,
        camera: nCamera,
        screen: nScreen,
        accesoryType: (form.accesoryType || undefined) as 'audifonos' | 'cargadores' | 'cases' | undefined,
      },
    };

    if (phone) {
      updatePhone(productData);
    } else {
      addPhone(productData);
    }
    onClose();
  };

  const set = (field: string, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'category') {
        setPreviewSrc('');
        if (value === 'accesorios') {
          next.storage = ''; next.ram = ''; next.tier = 'Media';
          next.variants = [{ storage: '', ram: '', price: undefined }];
        } else {
          next.battery = ''; next.camera = ''; next.screen = '';
        }
      }
      return next;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateVariant = (idx: number, field: 'storage' | 'ram' | 'price', val: string | number | undefined) => {
    setForm(prev => {
      const copy = prev.variants.map((v, i) => i === idx ? { ...v, [field]: val } : v);
      return { ...prev, variants: copy };
    });
  };

  const addVariant = () => {
    setForm(prev => ({ ...prev, variants: [...prev.variants, { storage: '', ram: '', price: undefined }] }));
  };

  const removeVariant = (idx: number) => {
    setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">
            {phone ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Nombre *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className={`w-full bg-slate-800 text-white px-3 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-slate-700'} focus:outline-none focus:border-teal-500 text-sm`}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>
            <div className="relative">
              <label className="block text-sm text-slate-400 mb-1">Marca *</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => { set('brand', e.target.value); setShowBrandSuggestions(true); setHighlightedIdx(-1); }}
                onFocus={() => { if (form.brand.trim()) setShowBrandSuggestions(true); }}
                onBlur={() => setTimeout(() => { setShowBrandSuggestions(false); setHighlightedIdx(-1); }, 150)}
                onKeyDown={handleBrandKeyDown}
                className={`w-full bg-slate-800 text-white px-3 py-2 rounded-lg border ${errors.brand ? 'border-red-500' : 'border-slate-700'} focus:outline-none focus:border-teal-500 text-sm`}
              />
              {showBrandSuggestions && brandSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                  {brandSuggestions.map((b, i) => (
                    <button
                      key={b}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); selectBrand(b); }}
                      onMouseEnter={() => setHighlightedIdx(i)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        i === highlightedIdx ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
              {errors.brand && <p className="text-xs text-red-400 mt-1">{errors.brand}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm"
              >
                <option value="celulares">Celulares</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Condición</label>
              <select
                value={form.condition}
                onChange={(e) => set('condition', e.target.value)}
                className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm"
              >
                <option value="Nuevo">Nuevo</option>
                <option value="Seminuevo">Seminuevo</option>
                <option value="Usado">Usado</option>
              </select>
            </div>
            {form.category === 'celulares' && (
              <div>
                <label className="block text-sm text-slate-400 mb-1">Gama</label>
                <select
                  value={form.tier}
                  onChange={(e) => set('tier', e.target.value)}
                  className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm"
                >
                  <option value="Premium">Premium</option>
                  <option value="Media">Media</option>
                  <option value="Económica">Económica</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Precio *</label>
              <input
                type="number"
                step="0.01"
                value={form.price || ''}
                onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
                className={`w-full bg-slate-800 text-white px-3 py-2 rounded-lg border ${errors.price ? 'border-red-500' : 'border-slate-700'} focus:outline-none focus:border-teal-500 text-sm`}
              />
              {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Precio Anterior</label>
              <input
                type="number"
                step="0.01"
                value={form.oldPrice || ''}
                onChange={(e) => set('oldPrice', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Stock *</label>
              <input
                type="number"
                value={form.stock || ''}
                onChange={(e) => set('stock', parseInt(e.target.value) || 0)}
                className={`w-full bg-slate-800 text-white px-3 py-2 rounded-lg border ${errors.stock ? 'border-red-500' : 'border-slate-700'} focus:outline-none focus:border-teal-500 text-sm`}
              />
              {errors.stock && <p className="text-xs text-red-400 mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">URL de la Imagen</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => set('image', e.target.value)}
                  placeholder="/images/celulares/mi-imagen"
                  className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm"
                />
                <label className="flex-shrink-0 cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Subir
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (ev.target?.result) setPreviewSrc(ev.target.result as string); };
                      reader.readAsDataURL(file);
                      const fd = new FormData();
                      fd.append('image', file);
                      try {
                        const res = await fetch('/api/upload', { method: 'POST', body: fd });
                        const data = await res.json();
                        if (data.image_data) {
                          set('image_data', data.image_data);
                          set('image', '');
                        }
                      } catch {}
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-1">Sube una imagen para almacenarla en la base de datos.</p>
            </div>
            <div className="flex items-end gap-3 pb-2">
              {previewSrc && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                  <img src={previewSrc} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500"
                />
                <span className="text-sm text-slate-300">Destacado</span>
              </label>
            </div>
          </div>

          {form.category === 'celulares' ? (
            <>
              <div>
                <p className="text-sm text-slate-400 mb-3">Especificaciones</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Almacenamiento</label>
                    <input type="text" value={form.storage} onChange={(e) => set('storage', e.target.value)} placeholder="128GB" className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">RAM</label>
                    <input type="text" value={form.ram} onChange={(e) => set('ram', e.target.value)} placeholder="6GB" className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Batería</label>
                    <input type="text" value={form.battery} onChange={(e) => set('battery', e.target.value)} placeholder="4000mAh" className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Cámara</label>
                    <input type="text" value={form.camera} onChange={(e) => set('camera', e.target.value)} placeholder="48MP" className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Pantalla</label>
                    <input type="text" value={form.screen} onChange={(e) => set('screen', e.target.value)} placeholder='6.5"' className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-slate-500 font-medium">Variantes (combinaciones almacenamiento + RAM)</label>
                  <button type="button" onClick={addVariant} className="text-teal-400 hover:text-teal-300 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {form.variants.map((v, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="text" value={v.storage} onChange={(e) => updateVariant(i, 'storage', e.target.value)} placeholder="128GB" className="w-[30%] bg-slate-800 text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
                      <input type="text" value={v.ram} onChange={(e) => updateVariant(i, 'ram', e.target.value)} placeholder="6GB" className="w-[30%] bg-slate-800 text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
                      <input type="number" step="0.01" value={v.price ?? ''} onChange={(e) => updateVariant(i, 'price', e.target.value ? parseFloat(e.target.value) : (undefined as any))} placeholder="Precio" className="w-[30%] bg-slate-800 text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
                      {form.variants.length > 1 && (
                        <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-300 flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">Agrega combinaciones válidas. Deja el precio vacío para usar el precio base del producto.</p>
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm text-slate-400 mb-3">Especificaciones</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Tipo de Accesorio *</label>
                  <select
                    value={form.accesoryType}
                    onChange={(e) => set('accesoryType', e.target.value)}
                    className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="audifonos">Audífonos</option>
                    <option value="cargadores">Cargadores</option>
                    <option value="cases">Cases / Fundas</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Autonomía / Batería</label>
                    <input type="text" value={form.battery} onChange={(e) => set('battery', e.target.value)} placeholder="30 h" className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Tipo</label>
                    <input type="text" value={form.screen} onChange={(e) => set('screen', e.target.value)} placeholder="In-ear, USB-C, Silicona..." className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs text-slate-500 mb-1">Compatibilidad</label>
                    <input
                      type="text"
                      value={form.camera}
                      onChange={(e) => { set('camera', e.target.value); setShowCompatSuggestions(true); setCompatHighlightedIdx(-1); }}
                      onFocus={() => { if (form.camera.trim()) setShowCompatSuggestions(true); }}
                      onBlur={() => setTimeout(() => { setShowCompatSuggestions(false); setCompatHighlightedIdx(-1); }, 150)}
                      onKeyDown={handleCompatKeyDown}
                      placeholder="iPhone / Android"
                      className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 text-sm"
                    />
                    {showCompatSuggestions && compatSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                        {compatSuggestions.map((s, i) => (
                          <button
                            key={s}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); selectCompat(s); }}
                            onMouseEnter={() => setCompatHighlightedIdx(i)}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                              i === compatHighlightedIdx ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-700'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {phone ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}