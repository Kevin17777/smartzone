const db = require('./db.cjs')
const fs = require('fs')
const path = require('path')

const IMG_DIR = path.join(__dirname, '..', 'public', 'images')
const EXTENSIONS = ['.webp', '.avif', '.jpg', '.jpeg', '.png']

function slugify(name) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function findImage(phoneName, phoneCategory) {
  const slug = slugify(phoneName)
  const folder = phoneCategory === 'accesorios' ? 'accesorios' : 'celulares'
  const basePath = path.join(IMG_DIR, folder, slug)
  for (const ext of EXTENSIONS) {
    const filePath = basePath + ext
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }
  return null
}

function readAsDataUri(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const mimeMap = { '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' }
  const mime = mimeMap[ext] || 'image/jpeg'
  const data = fs.readFileSync(filePath)
  return `data:${mime};base64,${data.toString('base64')}`
}

const phones = db.prepare('SELECT id, name, category, image_data FROM phones').all()
const update = db.prepare('UPDATE phones SET image_data = ? WHERE id = ?')
let migrated = 0

for (const phone of phones) {
  if (phone.image_data) continue
  const filePath = findImage(phone.name, phone.category)
  if (filePath) {
    const dataUri = readAsDataUri(filePath)
    update.run(dataUri, phone.id)
    migrated++
    console.log(`  ✓ ${phone.name}`)
  } else {
    console.log(`  ✗ ${phone.name} — no image found`)
  }
}

console.log(`\nMigrated ${migrated}/${phones.length} images.`)
