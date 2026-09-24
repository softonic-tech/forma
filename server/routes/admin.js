import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { clearAuthCookie, hashPassword, setAuthCookie, signAdmin, verifyPassword } from '../auth.js';
import {
  db,
  getProductById,
  getSettings,
  listColors,
  listProducts,
  now,
  setSettings,
  UPLOADS_DIR
} from '../db.js';
import { colorPayload, INQUIRY_STATUSES, ORDER_STATUSES, productPayload } from '../validate.js';

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase();
      const safe = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext) ? ext : '.png';
      cb(null, randomUUID() + safe);
    }
  }),
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (String(file.mimetype || '').startsWith('image/')) cb(null, true);
    else cb(new Error('Images only'));
  }
});

function setProductColors(productId, colorIds) {
  db.prepare('DELETE FROM product_colors WHERE product_id = ?').run(productId);
  const insert = db.prepare('INSERT INTO product_colors (product_id, color_id) VALUES (?, ?)');
  for (const id of colorIds) insert.run(productId, id);
}

export function adminRouter() {
  const router = Router();

  router.post('/login', (req, res) => {
    const email = String(req.body?.email || '')
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || '');
    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
    if (!admin || !verifyPassword(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Wrong email or password' });
    }
    setAuthCookie(res, signAdmin(admin));
    res.json({ email: admin.email });
  });

  router.post('/logout', (req, res) => {
    clearAuthCookie(res);
    res.json({ ok: true });
  });

  router.get('/me', (req, res) => {
    res.json({ email: req.admin.email });
  });

  router.get('/stats', (_req, res) => {
    const orders = db.prepare("SELECT COUNT(*) AS n FROM orders WHERE status = 'new'").get().n;
    const inquiries = db.prepare("SELECT COUNT(*) AS n FROM inquiries WHERE status = 'new'").get().n;
    const products = db.prepare('SELECT COUNT(*) AS n FROM products WHERE active = 1').get().n;
    const revenue = db.prepare("SELECT COALESCE(SUM(total), 0) AS n FROM orders WHERE status IN ('confirmed', 'completed')").get().n;
    const recent = db
      .prepare('SELECT id, status, customer_name, product_name, total, created_at FROM orders ORDER BY id DESC LIMIT 6')
      .all();
    res.json({ newOrders: orders, newInquiries: inquiries, products, revenue, recent });
  });

  router.get('/products', (_req, res) => {
    res.json(listProducts({ activeOnly: false }));
  });

  router.get('/products/:id', (req, res) => {
    const product = getProductById(Number(req.params.id));
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  router.post('/products', (req, res) => {
    const { errors, data } = productPayload(req.body || {});
    if (errors.length) return res.status(400).json({ error: errors[0], errors });
    if (db.prepare('SELECT id FROM products WHERE slug = ?').get(data.slug)) {
      return res.status(400).json({ error: 'That slug is already in use' });
    }
    const result = db
      .prepare(
        `INSERT INTO products (
          slug, name, category, category_label, tag, summary, blurb, details,
          price, featured, image, sizes, sort_order, active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        data.slug,
        data.name,
        data.category,
        data.category_label,
        data.tag,
        data.summary,
        data.blurb,
        data.details,
        data.price,
        data.featured,
        data.image,
        data.sizes,
        data.sort_order,
        data.active,
        now(),
        now()
      );
    setProductColors(result.lastInsertRowid, data.colorIds);
    res.status(201).json(getProductById(result.lastInsertRowid));
  });

  router.put('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!getProductById(id)) return res.status(404).json({ error: 'Product not found' });
    const { errors, data } = productPayload(req.body || {});
    if (errors.length) return res.status(400).json({ error: errors[0], errors });
    const clash = db.prepare('SELECT id FROM products WHERE slug = ? AND id != ?').get(data.slug, id);
    if (clash) return res.status(400).json({ error: 'That slug is already in use' });
    db.prepare(
      `UPDATE products SET
        slug=?, name=?, category=?, category_label=?, tag=?, summary=?, blurb=?, details=?,
        price=?, featured=?, image=?, sizes=?, sort_order=?, active=?, updated_at=?
       WHERE id=?`
    ).run(
      data.slug,
      data.name,
      data.category,
      data.category_label,
      data.tag,
      data.summary,
      data.blurb,
      data.details,
      data.price,
      data.featured,
      data.image,
      data.sizes,
      data.sort_order,
      data.active,
      now(),
      id
    );
    setProductColors(id, data.colorIds);
    res.json(getProductById(id));
  });

  router.delete('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!getProductById(id)) return res.status(404).json({ error: 'Product not found' });
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ ok: true });
  });

  router.get('/colors', (_req, res) => {
    res.json(listColors());
  });

  router.post('/colors', (req, res) => {
    const { errors, data } = colorPayload(req.body || {});
    if (errors.length) return res.status(400).json({ error: errors[0], errors });
    if (db.prepare('SELECT id FROM colors WHERE id = ?').get(data.id)) {
      return res.status(400).json({ error: 'That colour already exists' });
    }
    db.prepare('INSERT INTO colors (id, name, hex, sort_order) VALUES (?, ?, ?, ?)').run(
      data.id,
      data.name,
      data.hex,
      data.sort_order
    );
    res.status(201).json(data);
  });

  router.put('/colors/:id', (req, res) => {
    const current = db.prepare('SELECT * FROM colors WHERE id = ?').get(req.params.id);
    if (!current) return res.status(404).json({ error: 'Colour not found' });
    const { errors, data } = colorPayload({ ...req.body, id: req.params.id });
    if (errors.length) return res.status(400).json({ error: errors[0], errors });
    db.prepare('UPDATE colors SET name = ?, hex = ?, sort_order = ? WHERE id = ?').run(
      data.name,
      data.hex,
      data.sort_order,
      req.params.id
    );
    res.json({ ...data, id: req.params.id });
  });

  router.delete('/colors/:id', (req, res) => {
    const used = db.prepare('SELECT COUNT(*) AS n FROM product_colors WHERE color_id = ?').get(req.params.id).n;
    if (used) return res.status(400).json({ error: 'Remove this colour from products first' });
    db.prepare('DELETE FROM colors WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  });

  router.get('/orders', (req, res) => {
    const status = String(req.query.status || '');
    const rows = status
      ? db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY id DESC').all(status)
      : db.prepare('SELECT * FROM orders ORDER BY id DESC').all();
    res.json(rows.map(mapOrder));
  });

  router.get('/orders/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(Number(req.params.id));
    if (!row) return res.status(404).json({ error: 'Order not found' });
    res.json(mapOrder(row));
  });

  router.patch('/orders/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(Number(req.params.id));
    if (!row) return res.status(404).json({ error: 'Order not found' });
    const status = String(req.body?.status || '');
    if (!ORDER_STATUSES.has(status)) return res.status(400).json({ error: 'Invalid status' });
    db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').run(status, now(), row.id);
    res.json(mapOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(row.id)));
  });

  router.get('/inquiries', (_req, res) => {
    res.json(db.prepare('SELECT * FROM inquiries ORDER BY id DESC').all());
  });

  router.patch('/inquiries/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(Number(req.params.id));
    if (!row) return res.status(404).json({ error: 'Inquiry not found' });
    const status = String(req.body?.status || '');
    if (!INQUIRY_STATUSES.has(status)) return res.status(400).json({ error: 'Invalid status' });
    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, row.id);
    res.json(db.prepare('SELECT * FROM inquiries WHERE id = ?').get(row.id));
  });

  router.get('/settings', (_req, res) => {
    res.json(getSettings());
  });

  router.put('/settings', (req, res) => {
    const body = req.body || {};
    const allowed = [
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
    const patch = {};
    for (const key of allowed) {
      if (key in body) patch[key] = String(body[key] ?? '');
    }
    res.json(setSettings(patch));
  });

  router.put('/password', (req, res) => {
    const current = String(req.body?.currentPassword || '');
    const next = String(req.body?.newPassword || '');
    if (next.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' });
    const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.admin.id);
    if (!verifyPassword(current, admin.password_hash)) {
      return res.status(400).json({ error: 'Current password is wrong' });
    }
    db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(hashPassword(next), admin.id);
    res.json({ ok: true });
  });

  router.post('/upload', (req, res) => {
    upload.single('image')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
      if (!req.file) return res.status(400).json({ error: 'Choose an image' });
      res.status(201).json({ url: '/uploads/' + req.file.filename });
    });
  });

  return router;
}

function mapOrder(row) {
  let measurements = {};
  try {
    measurements = JSON.parse(row.measurements || '{}');
  } catch {
    measurements = {};
  }
  return {
    id: row.id,
    status: row.status,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerCity: row.customer_city,
    notes: row.notes,
    productSlug: row.product_slug,
    productName: row.product_name,
    productImage: row.product_image,
    colorId: row.color_id,
    colorName: row.color_name,
    colorHex: row.color_hex,
    fit: row.fit,
    size: row.size,
    qty: row.qty,
    price: row.price,
    total: row.total,
    measurements,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
