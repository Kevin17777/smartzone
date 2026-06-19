import { useState } from 'react';
import { useStore } from '../../data/store';
import { LayoutDashboard, Smartphone, Percent, Palette, RotateCcw, X } from 'lucide-react';

export type Tab = 'dashboard' | 'inventario' | 'promociones' | 'tema';

interface AdminLayoutProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  children: React.ReactNode;
}

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventario', label: 'Inventario', icon: Smartphone },
  { id: 'promociones', label: 'Promociones', icon: Percent },
  { id: 'tema', label: 'Tema', icon: Palette },
];

const themeColors: { name: string; value: string; tailwind: string }[] = [
  { name: 'Teal', value: 'teal', tailwind: 'bg-teal-500' },
  { name: 'Purple', value: 'purple', tailwind: 'bg-purple-500' },
  { name: 'Orange', value: 'orange', tailwind: 'bg-orange-500' },
  { name: 'Emerald', value: 'emerald', tailwind: 'bg-emerald-500' },
];

export default function AdminLayout({ activeTab, onTabChange, children }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, resetDemo } = useStore();

  const tabContent = (
    <>
      {tabs.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => { onTabChange(t.id); setMobileMenuOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left ${
              activeTab === t.id
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Icon size={18} />
            <span>{t.label}</span>
          </button>
        );
      })}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <button
          onClick={resetDemo}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors w-full text-left"
        >
          <RotateCcw size={18} />
          <span>Restablecer Inventario Demo</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950">
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-white p-4">
        <div className="flex items-center gap-3 px-4 py-3 mb-6">
          <Smartphone size={24} className="text-teal-400" />
          <span className="text-lg font-bold">SmartZone Admin</span>
        </div>
        <nav className="flex-1">{tabContent}</nav>
      </aside>

      <div className="lg:hidden bg-slate-900 text-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Smartphone size={20} className="text-teal-400" />
            <span className="text-lg font-bold">SmartZone Admin</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <span className="text-xl">&#9776;</span>}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="px-4 pb-4 border-t border-slate-700 pt-4">{tabContent}</div>
        )}
        <div className="flex border-t border-slate-700">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                  activeTab === t.id
                    ? 'text-teal-400 border-t-2 border-teal-400 -mt-px'
                    : 'text-slate-400'
                }`}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        {activeTab === 'tema' && (
          <div className="mb-6 bg-slate-900 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Seleccionar Tema</h2>
            <div className="flex gap-4">
              {themeColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setTheme(c.value as any)}
                  className={`w-12 h-12 rounded-full ${c.tailwind} flex items-center justify-center transition-transform hover:scale-110 ${
                    theme === c.value ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-900' : ''
                  }`}
                >
                  {theme === c.value && <span className="text-white font-bold">&#10003;</span>}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              {themeColors.map((c) => (
                <span key={c.value} className="text-sm text-slate-400">{c.name}</span>
              ))}
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
