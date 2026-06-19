import { useState, useEffect } from 'react';

interface Props {
  name: string;
  brand: string;
  color?: string;
  className?: string;
}

const COLORS: Record<string, string> = {
  Samsung: '#1e40af',
  Apple: '#1e293b',
  Xiaomi: '#ea580c',
  OnePlus: '#be123c',
  Motorola: '#6d28d9',
  SmartZone: '#0d9488',
};

const IMG_EXTS = ['.webp', '.avif', '.jpg', '.jpeg', '.png'];

function hasExtension(path: string) {
  return IMG_EXTS.some(e => path.endsWith(e));
}

export default function ProductImage({ name, brand, color, className = '' }: Props) {
  const [failed, setFailed] = useState(false);
  const [extIdx, setExtIdx] = useState(0);
  const bg = COLORS[brand] || '#334155';

  useEffect(() => {
    setFailed(false);
    setExtIdx(0);
  }, [color]);

  const isDataUri = color?.startsWith('data:');
  const hasExt = color ? hasExtension(color) : false;
  const src = color ? (isDataUri || hasExt ? color : `${color}${IMG_EXTS[extIdx]}`) : undefined;

  if (color && !failed) {
    return (
      <div className={`${className}`}>
        <img
          key={src}
          src={src}
          alt={name}
          className="h-full w-full object-contain"
          onError={() => {
            if (isDataUri || hasExt) { setFailed(true); return; }
            if (extIdx < IMG_EXTS.length - 1) {
              setExtIdx(i => i + 1);
            } else {
              setFailed(true);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ background: `linear-gradient(135deg, ${bg}, ${bg}dd)` }}
    >
      <div className="flex flex-col items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <circle cx="12" cy="18" r="1" fill="currentColor" />
        </svg>
        <span className="text-xs font-semibold text-white/90 text-center leading-tight px-2 max-w-[120px] truncate">
          {name}
        </span>
      </div>
    </div>
  );
}