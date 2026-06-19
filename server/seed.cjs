const db = require('./db.cjs')
const fs = require('fs')
const path = require('path')

const IMG_DIR = path.join(__dirname, '..', 'public', 'images')
const EXTENSIONS = ['.webp', '.avif', '.jpg', '.jpeg', '.png']
const MIME_MAP = { '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' }

function slugify(name) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

const PLACEHOLDER_COLORS = {
  Samsung: '#1e40af',
  Apple: '#1e293b',
  Xiaomi: '#ea580c',
  OnePlus: '#be123c',
  Motorola: '#6d28d9',
  SmartZone: '#0d9488',
}

function generatePlaceholder(name, brand) {
  const bg = PLACEHOLDER_COLORS[brand] || '#334155'
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="533" viewBox="0 0 400 533">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${bg};stop-opacity:1"/><stop offset="100%" style="stop-color:${bg}cc;stop-opacity:1"/></linearGradient></defs>
    <rect width="400" height="533" fill="url(#g)" rx="16"/>
    <text x="200" y="220" text-anchor="middle" font-family="system-ui,sans-serif" font-size="72" font-weight="bold" fill="rgba(255,255,255,0.15)">${initials}</text>
    <rect x="140" y="150" width="120" height="180" rx="16" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="4"/>
    <circle cx="200" cy="210" r="8" fill="rgba(255,255,255,0.3)"/>
    <circle cx="200" cy="240" r="4" fill="rgba(255,255,255,0.2)"/>
    <text x="200" y="330" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" font-weight="600" fill="rgba(255,255,255,0.7)">${name}</text>
  </svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

function loadImage(name, category, brand) {
  const slug = slugify(name)
  const folder = category === 'accesorios' ? 'accesorios' : 'celulares'
  const basePath = path.join(IMG_DIR, folder, slug)
  for (const ext of EXTENSIONS) {
    const filePath = basePath + ext
    if (fs.existsSync(filePath)) {
      const mime = MIME_MAP[ext] || 'image/jpeg'
      const data = fs.readFileSync(filePath)
      return `data:${mime};base64,${data.toString('base64')}`
    }
  }
  return generatePlaceholder(name, brand)
}

const phones = [
  { id: 's1', name: 'Galaxy S25 Ultra', brand: 'Samsung', category: 'celulares', price: 1299.99, oldPrice: 1499.99, description: 'El smartphone más potente de Samsung con IA integrada y cámara de 200MP.', stock: 12, featured: true, condition: 'Nuevo', tier: 'Premium', specs: { storage: '512GB', ram: '12GB', variants: [{ storage: '256GB', ram: '12GB', price: 1199.99 }, { storage: '512GB', ram: '12GB', price: 1299.99 }, { storage: '512GB', ram: '16GB', price: 1399.99 }, { storage: '1TB', ram: '16GB', price: 1599.99 }], battery: '5000 mAh', camera: '200 MP Cuádruple', screen: '6.9" Dynamic AMOLED 2X' } },
  { id: 's2', name: 'Galaxy S24 FE', brand: 'Samsung', category: 'celulares', price: 649.99, oldPrice: 799.99, description: 'La experiencia Galaxy FE a un precio increíble. Ideal para el día a día.', stock: 25, featured: true, condition: 'Nuevo', tier: 'Media', specs: { storage: '128GB', ram: '8GB', battery: '4700 mAh', camera: '50 MP Triple', screen: '6.7" Dynamic AMOLED' } },
  { id: 's3', name: 'Galaxy A55 5G', brand: 'Samsung', category: 'celulares', price: 399.99, oldPrice: 499.99, description: 'Potente gama media con conectividad 5G y pantalla Super AMOLED.', stock: 30, featured: false, condition: 'Nuevo', tier: 'Media', specs: { storage: '256GB', ram: '8GB', battery: '5000 mAh', camera: '50 MP Triple', screen: '6.6" Super AMOLED' } },
  { id: 's4', name: 'Galaxy A15', brand: 'Samsung', category: 'celulares', price: 179.99, oldPrice: 229.99, description: 'El Galaxy A15 llega con pantalla Super AMOLED de 6.5" y batería de 5000 mAh.', stock: 40, featured: false, condition: 'Nuevo', tier: 'Económica', specs: { storage: '128GB', ram: '6GB', battery: '5000 mAh', camera: '50 MP Triple', screen: '6.5" Super AMOLED' } },
  { id: 'ap1', name: 'iPhone 16 Pro Max', brand: 'Apple', category: 'celulares', price: 1499.99, oldPrice: 1699.99, description: 'El iPhone más grande y potente con chip A18 Pro y grabación en 8K.', stock: 8, featured: true, condition: 'Nuevo', tier: 'Premium', specs: { storage: '512GB', ram: '8GB', battery: '4685 mAh', camera: '48 MP Triple', screen: '6.9" Super Retina XDR' } },
  { id: 'ap2', name: 'iPhone 16 Pro', brand: 'Apple', category: 'celulares', price: 1299.99, oldPrice: 1499.99, description: 'El iPhone 16 Pro con chip A18 Pro y cámara de 48MP con zoom óptico 5x.', stock: 15, featured: true, condition: 'Nuevo', tier: 'Premium', specs: { storage: '256GB', ram: '8GB', battery: '3582 mAh', camera: '48 MP Triple', screen: '6.3" Super Retina XDR' } },
  { id: 'ap3', name: 'iPhone 16', brand: 'Apple', category: 'celulares', price: 999.99, oldPrice: 1099.99, description: 'El iPhone 16 con chip A18, cámara de 48MP y Action Button.', stock: 20, featured: false, condition: 'Nuevo', tier: 'Premium', specs: { storage: '128GB', ram: '8GB', battery: '3561 mAh', camera: '48 MP Dual', screen: '6.1" Super Retina XDR' } },
  { id: 'ap4', name: 'iPhone 15', brand: 'Apple', category: 'celulares', price: 749.99, oldPrice: 899.99, description: 'El iPhone 15 con Dynamic Island y cámara de 48MP.', stock: 18, featured: false, condition: 'Nuevo', tier: 'Media', specs: { storage: '128GB', ram: '6GB', battery: '3349 mAh', camera: '48 MP Dual', screen: '6.1" Super Retina XDR' } },
  { id: 'ap5', name: 'iPhone 14 Pro Max', brand: 'Apple', category: 'celulares', price: 1099.99, oldPrice: 1299.99, description: 'El iPhone 14 Pro Max con Dynamic Island y pantalla Always-On.', stock: 10, featured: false, condition: 'Nuevo', tier: 'Premium', specs: { storage: '256GB', ram: '6GB', battery: '4323 mAh', camera: '48 MP Triple', screen: '6.7" Super Retina XDR' } },
  { id: 'x1', name: 'Xiaomi 14 Ultra', brand: 'Xiaomi', category: 'celulares', price: 999.99, oldPrice: 1199.99, description: 'El Xiaomi 14 Ultra con cámara Leica de 50MP cuádruple y Snapdragon 8 Gen 3.', stock: 10, featured: true, condition: 'Nuevo', tier: 'Premium', specs: { storage: '512GB', ram: '16GB', battery: '5000 mAh', camera: '50 MP Cuádruple Leica', screen: '6.73" AMOLED 120Hz' } },
  { id: 'x2', name: 'Xiaomi 14T Pro', brand: 'Xiaomi', category: 'celulares', price: 699.99, oldPrice: 849.99, description: 'Rendimiento flagship con cámara Leica y carga ultrarrápida de 120W.', stock: 15, featured: false, condition: 'Nuevo', tier: 'Media', specs: { storage: '512GB', ram: '12GB', battery: '5000 mAh', camera: '50 MP Triple Leica', screen: '6.67" AMOLED 144Hz' } },
  { id: 'x3', name: 'Redmi Note 14 Pro', brand: 'Xiaomi', category: 'celulares', price: 299.99, oldPrice: 379.99, description: 'El Redmi Note 14 Pro con cámara de 200MP y batería de 5500mAh.', stock: 35, featured: false, condition: 'Nuevo', tier: 'Media', specs: { storage: '256GB', ram: '8GB', battery: '5500 mAh', camera: '200 MP Triple', screen: '6.67" AMOLED 120Hz' } },
  { id: 'x4', name: 'Redmi Note 14', brand: 'Xiaomi', category: 'celulares', price: 199.99, oldPrice: 249.99, description: 'El Redmi Note 14 con pantalla AMOLED de 6.67" y batería de 5500mAh.', stock: 40, featured: false, condition: 'Nuevo', tier: 'Económica', specs: { storage: '128GB', ram: '6GB', battery: '5500 mAh', camera: '108 MP Triple', screen: '6.67" AMOLED 120Hz' } },
  { id: 'x5', name: 'Redmi 13C', brand: 'Xiaomi', category: 'celulares', price: 119.99, oldPrice: 149.99, description: 'El Redmi 13C con pantalla de 6.74" y batería de 5000mAh.', stock: 50, featured: false, condition: 'Nuevo', tier: 'Económica', specs: { storage: '128GB', ram: '4GB', battery: '5000 mAh', camera: '50 MP Dual', screen: '6.74" LCD 90Hz' } },
  { id: 'x6', name: 'Poco X7 Pro', brand: 'Xiaomi', category: 'celulares', price: 349.99, oldPrice: 429.99, description: 'El Poco X7 Pro con Dimensity 8400 Ultra y carga de 90W.', stock: 20, featured: false, condition: 'Nuevo', tier: 'Media', specs: { storage: '256GB', ram: '8GB', battery: '5000 mAh', camera: '50 MP Dual', screen: '6.67" AMOLED 120Hz' } },
  { id: 'o1', name: 'OnePlus 13', brand: 'OnePlus', category: 'celulares', price: 899.99, oldPrice: 999.99, description: 'El OnePlus 13 con Snapdragon 8 Elite y cámara Hasselblad de 50MP.', stock: 12, featured: true, condition: 'Nuevo', tier: 'Premium', specs: { storage: '512GB', ram: '16GB', battery: '6000 mAh', camera: '50 MP Triple Hasselblad', screen: '6.82" AMOLED 120Hz' } },
  { id: 'o2', name: 'OnePlus Nord 4', brand: 'OnePlus', category: 'celulares', price: 399.99, oldPrice: 499.99, description: 'El OnePlus Nord 4 con Snapdragon 7+ Gen 3 y carga de 100W.', stock: 25, featured: false, condition: 'Nuevo', tier: 'Media', specs: { storage: '256GB', ram: '12GB', battery: '5500 mAh', camera: '50 MP Dual', screen: '6.74" AMOLED 120Hz' } },
  { id: 'm1', name: 'Motorola Edge 50 Pro', brand: 'Motorola', category: 'celulares', price: 549.99, oldPrice: 699.99, description: 'El Motorola Edge 50 Pro con cámara de 50MP y carga TurboPower de 125W.', stock: 15, featured: false, condition: 'Nuevo', tier: 'Media', specs: { storage: '256GB', ram: '12GB', battery: '4500 mAh', camera: '50 MP Triple', screen: '6.7" pOLED 144Hz' } },
  { id: 'm2', name: 'Motorola G85 5G', brand: 'Motorola', category: 'celulares', price: 249.99, oldPrice: 299.99, description: 'El Motorola G85 5G con pantalla pOLED de 6.55" y carga rápida de 68W.', stock: 30, featured: false, condition: 'Nuevo', tier: 'Económica', specs: { storage: '256GB', ram: '8GB', battery: '5000 mAh', camera: '50 MP Dual', screen: '6.55" pOLED 120Hz' } },
  { id: 'z1', name: 'Galaxy Z Fold 6', brand: 'Samsung', category: 'celulares', price: 1899.99, oldPrice: 2099.99, description: 'El Galaxy Z Fold 6 con pantalla plegable de 7.6" y S Pen integrado.', stock: 5, featured: false, condition: 'Nuevo', tier: 'Premium', specs: { storage: '512GB', ram: '12GB', battery: '4400 mAh', camera: '50 MP Triple', screen: '7.6" Dynamic AMOLED 2X' } },
  { id: 'n1', name: 'Nova 15 Max', brand: 'SmartZone', category: 'celulares', price: 449.99, oldPrice: 549.99, description: 'El SmartZone Nova 15 Max con cámara de 108MP y batería de 5000mAh.', stock: 20, featured: false, condition: 'Nuevo', tier: 'Media', specs: { storage: '256GB', ram: '8GB', battery: '5000 mAh', camera: '108 MP Triple', screen: '6.7" AMOLED 120Hz' } },
  { id: 'o3', name: 'OPPO A5', brand: 'SmartZone', category: 'celulares', price: 149.99, oldPrice: 199.99, description: 'El SmartZone OPPO A5 con batería de 5000mAh y pantalla de 6.72".', stock: 35, featured: false, condition: 'Nuevo', tier: 'Económica', specs: { storage: '128GB', ram: '6GB', battery: '5000 mAh', camera: '50 MP Dual', screen: '6.72" LCD 90Hz' } },
  { id: 'v1', name: 'Galaxy Buds3 Pro', brand: 'Samsung', category: 'accesorios', price: 149.99, oldPrice: 199.99, description: 'Audífonos inalámbricos con cancelación de ruido activa y sonido adaptativo.', stock: 20, featured: false, condition: 'Nuevo', tier: 'Premium', specs: { storage: '', ram: '', battery: '', camera: '', screen: '', accesoryType: 'audifonos' } },
  { id: 'v2', name: 'AirPods Pro 2', brand: 'Apple', category: 'accesorios', price: 179.99, oldPrice: 249.99, description: 'Los AirPods Pro 2 con cancelación de ruido 2x y audio adaptativo.', stock: 15, featured: false, condition: 'Nuevo', tier: 'Premium', specs: { storage: '', ram: '', battery: '', camera: '', screen: '', accesoryType: 'audifonos' } },
  { id: 'ac1', name: 'Cargador Rápido 120W', brand: 'SmartZone', category: 'accesorios', price: 29.99, oldPrice: 39.99, description: 'Cargador USB-C con carga rápida de 120W para smartphones compatibles.', stock: 30, featured: false, condition: 'Nuevo', tier: 'Media', specs: { storage: '', ram: '', battery: '', camera: '', screen: '', accesoryType: 'cargadores' } },
  { id: 'ac2', name: 'Cargador Inalámbrico 15W', brand: 'SmartZone', category: 'accesorios', price: 24.99, oldPrice: 34.99, description: 'Base de carga inalámbrica rápida de 15W compatible con todos los dispositivos Qi.', stock: 25, featured: false, condition: 'Nuevo', tier: 'Media', specs: { storage: '', ram: '', battery: '', camera: '', screen: '', accesoryType: 'cargadores' } },
  { id: 'ac3', name: 'Cable USB-C Trenzado 2m', brand: 'SmartZone', category: 'accesorios', price: 9.99, oldPrice: 14.99, description: 'Cable USB-C a USB-C trenzado de 2 metros con carga rápida de 100W.', stock: 50, featured: false, condition: 'Nuevo', tier: 'Económica', specs: { storage: '', ram: '', battery: '', camera: '', screen: '', accesoryType: 'cargadores' } },
]

const phoneCount = db.prepare('SELECT COUNT(*) as c FROM phones').get().c
if (phoneCount === 0) {
  const insert = db.prepare(`
    INSERT INTO phones (id, name, brand, category, price, oldPrice, description, stock, image, image_data, featured, specs, condition, tier)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const tx = db.transaction(() => {
    for (const p of phones) {
      const imgData = loadImage(p.name, p.category)
      insert.run(p.id, p.name, p.brand, p.category, p.price, p.oldPrice ?? null, p.description, p.stock, '', imgData, p.featured ? 1 : 0, JSON.stringify(p.specs), p.condition, p.tier)
    }
  })
  tx()
  console.log(`Seeded ${phones.length} phones with images.`)
}

const bannerCount = db.prepare('SELECT COUNT(*) as c FROM banners').get().c
if (bannerCount === 0) {
  const banners = [
    { id: 'b1', title: 'Lanzamiento: Galaxy S25 Ultra', subtitle: '200MP de cámara, IA integrada y 512GB de almacenamiento', discount: 'Hasta -$200 OFF', color: 'from-violet-700 to-indigo-900', image: '/images/banners/banner-s25.jpg', active: 1, category: 'celulares', specs: JSON.stringify([{ label: '200MP Cámara', icon: 'Star' }, { label: '120W Carga', icon: 'Zap' }, { label: '512GB', icon: 'Battery' }]) },
    { id: 'b2', title: 'iPhone 16 Pro Max', subtitle: 'El poder del chip A18 Pro en tus manos. Titanio y 48MP.', discount: '12 meses sin intereses', color: 'from-slate-800 to-zinc-950', active: 1, category: 'celulares', specs: '[]' },
    { id: 'b3', title: 'Ofertas en Accesorios', subtitle: 'Audífonos, cargadores y cases con hasta 40% de descuento', discount: '40% OFF', color: 'from-teal-600 to-emerald-900', image: '/images/banners/banner-accesorios.jpg', active: 1, category: 'accesorios', specs: '[]' },
  ]
  const insertBanner = db.prepare(`INSERT INTO banners (id, title, subtitle, discount, color, image, active, category, specs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  for (const b of banners) {
    insertBanner.run(b.id, b.title, b.subtitle, b.discount, b.color, b.image, b.active, b.category, b.specs)
  }
  console.log(`Seeded ${banners.length} banners.`)
}
