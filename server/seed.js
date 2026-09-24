import { COLORS, CATALOG } from '../src/data/catalog.js';
import { config } from '../src/data/config.js';
import { hashPassword } from './auth.js';
import { db, now } from './db.js';

const SETTING_KEYS = [
  'brandName',
  'brandScript',
  'tagline',
  'promise',
  'feel',
  'whatsappNumber',
  'whatsappDisplay',
  'whatsappName',
  'phoneNumber',
  'phoneDisplay',
  'phoneName',
  'city',
  'address'
];

export function seed() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@glowfit.pk').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'GlowFit!Admin';
  const existingAdmin = db.prepare('SELECT id FROM admins WHERE email = ?').get(adminEmail);
  if (!existingAdmin) {
    db.prepare('INSERT INTO admins (email, password_hash, created_at) VALUES (?, ?, ?)').run(
      adminEmail,
      hashPassword(adminPassword),
      now()
    );
  }

  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  for (const key of SETTING_KEYS) insertSetting.run(key, config[key] ?? '');

  const colorCount = db.prepare('SELECT COUNT(*) AS n FROM colors').get().n;
  if (colorCount === 0) {
    const insertColor = db.prepare('INSERT INTO colors (id, name, hex, sort_order) VALUES (?, ?, ?, ?)');
    COLORS.forEach((color, index) => insertColor.run(color.id, color.name, color.hex, index));
  }

  const productCount = db.prepare('SELECT COUNT(*) AS n FROM products').get().n;
  if (productCount === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (
        slug, name, category, category_label, tag, summary, blurb, details,
        price, featured, image, sizes, sort_order, active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);
    const insertLink = db.prepare('INSERT INTO product_colors (product_id, color_id) VALUES (?, ?)');
    const tx = db.transaction(() => {
      CATALOG.forEach((product, index) => {
        const result = insertProduct.run(
          product.slug,
          product.name,
          product.category,
          product.categoryLabel,
          product.tag || '',
          product.summary || '',
          product.blurb || '',
          product.details || '',
          product.price,
          product.featured ? 1 : 0,
          product.image,
          JSON.stringify(product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL']),
          index,
          now(),
          now()
        );
        for (const color of product.colors || COLORS) {
          insertLink.run(result.lastInsertRowid, color.id);
        }
      });
    });
    tx();
  }
}
