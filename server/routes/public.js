import { Router } from 'express';
import { db, getProductBySlug, getSettings, listColors, listProducts, now } from '../db.js';
import { inquiryPayload, orderPayload } from '../validate.js';

const publicLimiterSkip = (req, res, next) => next();

export function publicRouter(limit) {
  const router = Router();
  const writeLimit = limit || publicLimiterSkip;

  router.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'glow-fit' });
  });

  router.get('/settings', (_req, res) => {
    res.json(getSettings());
  });

  router.get('/colors', (_req, res) => {
    res.json(listColors());
  });

  router.get('/products', (_req, res) => {
    res.json(listProducts({ activeOnly: true }));
  });

  router.get('/products/:slug', (req, res) => {
    const product = getProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  router.post('/orders', writeLimit, (req, res) => {
    const { errors, data } = orderPayload(req.body || {});
    if (!data.product_name) {
      const product = getProductBySlug(data.product_slug, { includeInactive: true });
      if (product) {
        data.product_name = product.name;
        data.product_image = data.product_image || product.image;
        data.price = data.price >= 0 ? data.price : product.price;
        data.total = data.qty * data.price;
      }
    }
    if (!data.product_name) errors.push('Product is required');
    if (errors.length) return res.status(400).json({ error: errors[0], errors });

    const result = db
      .prepare(
        `INSERT INTO orders (
          status, customer_name, customer_phone, customer_city, notes,
          product_slug, product_name, product_image, color_id, color_name, color_hex,
          fit, size, qty, price, total, measurements, created_at, updated_at
        ) VALUES ('new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        data.customer_name,
        data.customer_phone,
        data.customer_city,
        data.notes,
        data.product_slug,
        data.product_name,
        data.product_image,
        data.color_id,
        data.color_name,
        data.color_hex,
        data.fit,
        data.size,
        data.qty,
        data.price,
        data.total,
        data.measurements,
        now(),
        now()
      );

    res.status(201).json({
      id: result.lastInsertRowid,
      status: 'new',
      total: data.total
    });
  });

  router.post('/inquiries', writeLimit, (req, res) => {
    const { errors, data } = inquiryPayload(req.body || {});
    if (errors.length) return res.status(400).json({ error: errors[0], errors });
    const result = db
      .prepare(
        'INSERT INTO inquiries (name, phone, college, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(data.name, data.phone, data.college, data.message, 'new', now());
    res.status(201).json({ id: result.lastInsertRowid, status: 'new' });
  });

  return router;
}
