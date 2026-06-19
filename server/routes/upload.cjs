const express = require('express')
const multer = require('multer')
const db = require('../db.cjs')
const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files allowed'))
  },
})

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const base64 = req.file.buffer.toString('base64')
  const mime = req.file.mimetype
  const dataUri = `data:${mime};base64,${base64}`
  res.json({ image_data: dataUri, filename: req.file.originalname })
})

module.exports = router
