import { Router } from 'express';
import { getProductBySlug, getSettings, listColors, listProducts, nextId, now } from '../db.js';
import { Inquiry, Order } from '../models.js';
import { inquiryPayload, orderPayload } from '../validate.js';

const publicLimiterSkip = (_req, _res, next) => next();

function asyncRoute(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function publicRouter(limit) {
  const router = Router();
  const writeLimit = limit || publicLimiterSkip;

  router.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'glow-fit' });
  });

  router.get(
    '/settings',
    asyncRoute(async (_req, res) => {
      res.json(await getSettings());
    })
  );

  router.get(
    '/colors',
    asyncRoute(async (_req, res) => {
      res.json(await listColors());
    })
  );

  router.get(
    '/products',
    asyncRoute(async (_req, res) => {
      res.json(await listProducts({ activeOnly: true }));
    })
  );

  router.get(
    '/products/:slug',
    asyncRoute(async (req, res) => {
      const product = await getProductBySlug(req.params.slug);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    })
  );

  router.post(
    '/orders',
    writeLimit,
    asyncRoute(async (req, res) => {
      const { errors, data } = orderPayload(req.body || {});
      if (!data.product_name) {
        const product = await getProductBySlug(data.product_slug, { includeInactive: true });
        if (product) {
          data.product_name = product.name;
          data.product_image = data.product_image || product.image;
          data.price = data.price >= 0 ? data.price : product.price;
          data.total = data.qty * data.price;
        }
      }
      if (!data.product_name) errors.push('Product is required');
      if (errors.length) return res.status(400).json({ error: errors[0], errors });

      let measurements = {};
      try {
        measurements = JSON.parse(data.measurements || '{}');
      } catch {
        measurements = {};
      }

      const id = await nextId('orders');
      await Order.create({
        id,
        status: 'new',
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        customerCity: data.customer_city,
        notes: data.notes,
        productSlug: data.product_slug,
        productName: data.product_name,
        productImage: data.product_image,
        colorId: data.color_id,
        colorName: data.color_name,
        colorHex: data.color_hex,
        fit: data.fit,
        size: data.size,
        qty: data.qty,
        price: data.price,
        total: data.total,
        measurements,
        createdAt: now(),
        updatedAt: now()
      });

      res.status(201).json({ id, status: 'new', total: data.total });
    })
  );

  router.post(
    '/inquiries',
    writeLimit,
    asyncRoute(async (req, res) => {
      const { errors, data } = inquiryPayload(req.body || {});
      if (errors.length) return res.status(400).json({ error: errors[0], errors });
      const id = await nextId('inquiries');
      await Inquiry.create({
        id,
        name: data.name,
        phone: data.phone,
        college: data.college,
        message: data.message,
        status: 'new',
        createdAt: now()
      });
      res.status(201).json({ id, status: 'new' });
    })
  );

  return router;
}
