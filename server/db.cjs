const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const DB_DIR = process.env.SMARTZONE_DB_DIR || path.join(__dirname, '..', 'data')
const DB_PATH = path.join(DB_DIR, 'smartzone.db')

const dbDir = path.dirname(DB_PATH)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(DB_PATH)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS phones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('celulares', 'accesorios')),
    price REAL NOT NULL,
    oldPrice REAL,
    description TEXT NOT NULL DEFAULT '',
    stock INTEGER NOT NULL DEFAULT 1,
    image TEXT NOT NULL DEFAULT '',
    image_data TEXT DEFAULT NULL,
    featured INTEGER NOT NULL DEFAULT 0,
    specs TEXT NOT NULL DEFAULT '{}',
    condition TEXT NOT NULL DEFAULT 'Nuevo' CHECK(condition IN ('Nuevo', 'Seminuevo', 'Usado')),
    tier TEXT NOT NULL DEFAULT 'Media' CHECK(tier IN ('Premium', 'Media', 'Económica')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    subtitle TEXT NOT NULL DEFAULT '',
    discount TEXT DEFAULT NULL,
    color TEXT NOT NULL DEFAULT 'from-teal-600 to-emerald-900',
    image TEXT DEFAULT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    category TEXT DEFAULT NULL,
    specs TEXT DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

try { db.exec(`ALTER TABLE phones ADD COLUMN image_data TEXT DEFAULT NULL`) } catch (e) {}

module.exports = db
