const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const db = require('../db.cjs')

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM banners ORDER BY created_at ASC').all()
  res.json(rows.map(deserializeBanner))
})

router.post('/', (req, res) => {
  const { title, subtitle, discount, color, image, active, category, specs } = req.body
  const id = crypto.randomUUID()
  db.prepare(`
    INSERT INTO banners (id, title, subtitle, discount, color, image, active, category, specs)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, title || '', subtitle || '', discount ?? null, color || 'from-teal-600 to-emerald-900', image ?? null, active ? 1 : 0, category ?? null, JSON.stringify(specs || []))
  res.status(201).json({ ok: true, id })
})

router.put('/:id', (req, res) => {
  const { title, subtitle, discount, color, image, active, category, specs } = req.body
  db.prepare(`
    UPDATE banners SET title=?, subtitle=?, discount=?, color=?, image=?, active=?, category=?, specs=?, updated_at=datetime('now')
    WHERE id=?
  `).run(title || '', subtitle || '', discount ?? null, color || 'from-teal-600 to-emerald-900', image ?? null, active ? 1 : 0, category ?? null, JSON.stringify(specs || []), req.params.id)
  res.json({ ok: true })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM banners WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

router.post('/seed', (req, res) => {
  db.prepare('DELETE FROM banners').run()
  delete require.cache[require.resolve('../seed.cjs')]
  require('../seed.cjs')
  res.json({ ok: true })
})

function deserializeBanner(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    discount: row.discount ?? undefined,
    color: row.color,
    image: row.image ?? undefined,
    active: !!row.active,
    category: row.category ?? undefined,
    specs: JSON.parse(row.specs || '[]'),
  }
}

module.exports = router
