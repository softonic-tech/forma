import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data');
const uploadsDir = path.join(dataDir, 'uploads');

export const ROOT = root;
export const DATA_DIR = dataDir;
export const UPLOADS_DIR = uploadsDir;

fs.mkdirSync(uploadsDir, { recursive: true });

export const db = new Database(path.join(dataDir, 'glowfit.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function now() {
  return new Date().toISOString();
}

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS colors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      hex TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      category_label TEXT NOT NULL,
      tag TEXT,
      summary TEXT,
      blurb TEXT,
      details TEXT,
      price INTEGER NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      image TEXT NOT NULL,
      sizes TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_colors (
      product_id INTEGER NOT NULL,
      color_id TEXT NOT NULL,
      PRIMARY KEY (product_id, color_id),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'new',
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_city TEXT,
      notes TEXT,
      product_slug TEXT,
      product_name TEXT,
      product_image TEXT,
      color_id TEXT,
      color_name TEXT,
      color_hex TEXT,
      fit TEXT,
      size TEXT,
      qty INTEGER NOT NULL,
      price INTEGER NOT NULL,
      total INTEGER NOT NULL,
      measurements TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      college TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL
    );
  `);
}

export function getSettings() {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const out = {};
  for (const row of rows) out[row.key] = row.value;
  return out;
}

export function setSettings(patch) {
  const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  const tx = db.transaction((entries) => {
    for (const [key, value] of entries) upsert.run(key, String(value ?? ''));
  });
  tx(Object.entries(patch));
  return getSettings();
}

export function colorsForProduct(productId) {
  return db
    .prepare(
      `SELECT c.id, c.name, c.hex
       FROM product_colors pc
       JOIN colors c ON c.id = pc.color_id
       WHERE pc.product_id = ?
       ORDER BY c.sort_order, c.name`
    )
    .all(productId);
}

export function toProduct(row, { includeInactive = false } = {}) {
  if (!row) return null;
  if (!includeInactive && !row.active) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    categoryLabel: row.category_label,
    tag: row.tag || '',
    summary: row.summary || '',
    blurb: row.blurb || '',
    details: row.details || '',
    price: row.price,
    featured: Boolean(row.featured),
    image: row.image,
    sizes: JSON.parse(row.sizes || '[]'),
    colors: colorsForProduct(row.id),
    sortOrder: row.sort_order,
    active: Boolean(row.active)
  };
}

export function listProducts({ activeOnly = true } = {}) {
  const sql = activeOnly
    ? 'SELECT * FROM products WHERE active = 1 ORDER BY featured DESC, sort_order, name'
    : 'SELECT * FROM products ORDER BY sort_order, name';
  return db.prepare(sql).all().map((row) => toProduct(row, { includeInactive: !activeOnly }));
}

export function getProductBySlug(slug, { includeInactive = false } = {}) {
  return toProduct(db.prepare('SELECT * FROM products WHERE slug = ?').get(slug), { includeInactive });
}

export function getProductById(id, { includeInactive = true } = {}) {
  return toProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(id), { includeInactive });
}

export function listColors() {
  return db.prepare('SELECT id, name, hex, sort_order AS sortOrder FROM colors ORDER BY sort_order, name').all();
}
