const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '50mb' }))

app.use('/api/phones', require('./routes/phones.cjs'))
app.use('/api/banners', require('./routes/banners.cjs'))
app.use('/api/upload', require('./routes/upload.cjs'))

const distPath = path.join(__dirname, '..', 'dist')
const fs = require('fs')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('/{*path}', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'))
    }
  })
  console.log(`Serving static files from ${distPath}`)
}

require('./seed.cjs')

app.listen(PORT, () => {
  console.log(`SmartZone running on http://localhost:${PORT}`)
})
