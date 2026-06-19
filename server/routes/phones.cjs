const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const db = require('../db.cjs')

router.get('/', (req, res) => {
  const { category } = req.query
  let rows
  if (category) {
    rows = db.prepare('SELECT * FROM phones WHERE category = ? ORDER BY created_at DESC').all(category)
  } else {
    rows = db.prepare('SELECT * FROM phones ORDER BY created_at DESC').all()
  }
  res.json(rows.map(deserializePhone))
})

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM phones WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(deserializePhone(row))
})

router.post('/', (req, res) => {
  const { id, name, brand, category, price, oldPrice, description, stock, image, featured, specs, condition, tier } = req.body
  db.prepare(`
    INSERT INTO phones (id, name, brand, category, price, oldPrice, description, stock, image, featured, specs, condition, tier)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id || crypto.randomUUID(), name, brand, category, price, oldPrice ?? null, description, stock, image, featured ? 1 : 0, JSON.stringify(specs || {}), condition, tier)
  res.status(201).json({ ok: true })
})

router.put('/:id', (req, res) => {
  const { name, brand, category, price, oldPrice, description, stock, image, featured, specs, condition, tier } = req.body
  db.prepare(`
    UPDATE phones SET name=?, brand=?, category=?, price=?, oldPrice=?, description=?, stock=?, image=?, featured=?, specs=?, condition=?, tier=?, updated_at=datetime('now')
    WHERE id=?
  `).run(name, brand, category, price, oldPrice ?? null, description, stock, image, featured ? 1 : 0, JSON.stringify(specs || {}), condition, tier, req.params.id)
  res.json({ ok: true })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM phones WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

router.post('/seed', (req, res) => {
  db.prepare('DELETE FROM phones').run()
  delete require.cache[require.resolve('../seed.cjs')]
  require('../seed.cjs')
  res.json({ ok: true })
})

function deserializePhone(row) {
  return {
    id: row.id, name: row.name, brand: row.brand, category: row.category,
    price: row.price, oldPrice: row.oldPrice ?? undefined,
    description: row.description, stock: row.stock,
    image: row.image, image_data: row.image_data ?? undefined,
    featured: !!row.featured,
    specs: JSON.parse(row.specs || '{}'),
    condition: row.condition, tier: row.tier,
  }
}

module.exports = router
