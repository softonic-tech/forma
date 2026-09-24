import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { Router } from 'express';
import multer from 'multer';
import { clearAuthCookie, hashPassword, setAuthCookie, signAdmin, verifyPassword } from '../auth.js';
import { getProductById, getSettings, listColors, listProducts, nextId, now, setSettings } from '../db.js';
import { Admin, Color, Inquiry, Order, Product } from '../models.js';
import { uploadImage } from '../s3.js';
import { colorPayload, INQUIRY_STATUSES, ORDER_STATUSES, productPayload } from '../validate.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (String(file.mimetype || '').startsWith('image/')) cb(null, true);
    else cb(new Error('Images only'));
  }
});

function asyncRoute(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function parseSizes(value) {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function adminRouter() {
  const router = Router();

  router.post(
    '/login',
    asyncRoute(async (req, res) => {
      const email = String(req.body?.email || '')
        .trim()
        .toLowerCase();
      const password = String(req.body?.password || '');
      const admin = await Admin.findOne({ email });
      if (!admin || !verifyPassword(password, admin.passwordHash)) {
        return res.status(401).json({ error: 'Wrong email or password' });
      }
      setAuthCookie(res, signAdmin(admin));
      res.json({ email: admin.email });
    })
  );

  router.post('/logout', (_req, res) => {
    clearAuthCookie(res);
    res.json({ ok: true });
  });

  router.get('/me', (req, res) => {
    res.json({ email: req.admin.email });
  });

  router.get(
    '/stats',
    asyncRoute(async (_req, res) => {
      const [newOrders, newInquiries, products, revenueRows, recentRows] = await Promise.all([
        Order.countDocuments({ status: 'new' }),
        Inquiry.countDocuments({ status: 'new' }),
        Product.countDocuments({ active: true }),
        Order.aggregate([
          { $match: { status: { $in: ['confirmed', 'completed'] } } },
          { $group: { _id: null, n: { $sum: '$total' } } }
        ]),
        Order.find().sort({ id: -1 }).limit(6).lean()
      ]);
      res.json({
        newOrders,
        newInquiries,
        products,
        revenue: revenueRows[0]?.n || 0,
        recent: recentRows.map((row) => ({
          id: row.id,
          status: row.status,
          customer_name: row.customerName,
          product_name: row.productName,
          total: row.total,
          created_at: row.createdAt
        }))
      });
    })
  );

  router.get(
    '/products',
    asyncRoute(async (_req, res) => {
      res.json(await listProducts({ activeOnly: false }));
    })
  );

  router.get(
    '/products/:id',
    asyncRoute(async (req, res) => {
      const product = await getProductById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    })
  );

  router.post(
    '/products',
    asyncRoute(async (req, res) => {
      const { errors, data } = productPayload(req.body || {});
      if (errors.length) return res.status(400).json({ error: errors[0], errors });
      if (await Product.findOne({ slug: data.slug })) {
        return res.status(400).json({ error: 'That slug is already in use' });
      }
      const id = await nextId('products');
      await Product.create({
        id,
        slug: data.slug,
        name: data.name,
        category: data.category,
        categoryLabel: data.category_label,
        tag: data.tag,
        summary: data.summary,
        blurb: data.blurb,
        details: data.details,
        price: data.price,
        featured: Boolean(data.featured),
        image: data.image,
        sizes: parseSizes(data.sizes),
        colorIds: data.colorIds,
        sortOrder: data.sort_order,
        active: Boolean(data.active),
        createdAt: now(),
        updatedAt: now()
      });
      res.status(201).json(await getProductById(id));
    })
  );

  router.put(
    '/products/:id',
    asyncRoute(async (req, res) => {
      const id = Number(req.params.id);
      if (!(await getProductById(id))) return res.status(404).json({ error: 'Product not found' });
      const { errors, data } = productPayload(req.body || {});
      if (errors.length) return res.status(400).json({ error: errors[0], errors });
      const clash = await Product.findOne({ slug: data.slug, id: { $ne: id } });
      if (clash) return res.status(400).json({ error: 'That slug is already in use' });
      await Product.updateOne(
        { id },
        {
          $set: {
            slug: data.slug,
            name: data.name,
            category: data.category,
            categoryLabel: data.category_label,
            tag: data.tag,
            summary: data.summary,
            blurb: data.blurb,
            details: data.details,
            price: data.price,
            featured: Boolean(data.featured),
            image: data.image,
            sizes: parseSizes(data.sizes),
            colorIds: data.colorIds,
            sortOrder: data.sort_order,
            active: Boolean(data.active),
            updatedAt: now()
          }
        }
      );
      res.json(await getProductById(id));
    })
  );

  router.delete(
    '/products/:id',
    asyncRoute(async (req, res) => {
      const id = Number(req.params.id);
      if (!(await getProductById(id))) return res.status(404).json({ error: 'Product not found' });
      await Product.deleteOne({ id });
      res.json({ ok: true });
    })
  );

  router.get(
    '/colors',
    asyncRoute(async (_req, res) => {
      res.json(await listColors());
    })
  );

  router.post(
    '/colors',
    asyncRoute(async (req, res) => {
      const { errors, data } = colorPayload(req.body || {});
      if (errors.length) return res.status(400).json({ error: errors[0], errors });
      if (await Color.findOne({ id: data.id })) {
        return res.status(400).json({ error: 'That colour already exists' });
      }
      await Color.create({
        id: data.id,
        name: data.name,
        hex: data.hex,
        sortOrder: data.sort_order
      });
      res.status(201).json({ id: data.id, name: data.name, hex: data.hex, sortOrder: data.sort_order });
    })
  );

  router.put(
    '/colors/:id',
    asyncRoute(async (req, res) => {
      const current = await Color.findOne({ id: req.params.id });
      if (!current) return res.status(404).json({ error: 'Colour not found' });
      const { errors, data } = colorPayload({ ...req.body, id: req.params.id });
      if (errors.length) return res.status(400).json({ error: errors[0], errors });
      await Color.updateOne(
        { id: req.params.id },
        { $set: { name: data.name, hex: data.hex, sortOrder: data.sort_order } }
      );
      res.json({ id: req.params.id, name: data.name, hex: data.hex, sortOrder: data.sort_order });
    })
  );

  router.delete(
    '/colors/:id',
    asyncRoute(async (req, res) => {
      const used = await Product.countDocuments({ colorIds: req.params.id });
      if (used) return res.status(400).json({ error: 'Remove this colour from products first' });
      await Color.deleteOne({ id: req.params.id });
      res.json({ ok: true });
    })
  );

  router.get(
    '/orders',
    asyncRoute(async (req, res) => {
      const status = String(req.query.status || '');
      const rows = status
        ? await Order.find({ status }).sort({ id: -1 }).lean()
        : await Order.find().sort({ id: -1 }).lean();
      res.json(rows.map(mapOrder));
    })
  );

  router.get(
    '/orders/:id',
    asyncRoute(async (req, res) => {
      const row = await Order.findOne({ id: Number(req.params.id) }).lean();
      if (!row) return res.status(404).json({ error: 'Order not found' });
      res.json(mapOrder(row));
    })
  );

  router.patch(
    '/orders/:id',
    asyncRoute(async (req, res) => {
      const row = await Order.findOne({ id: Number(req.params.id) });
      if (!row) return res.status(404).json({ error: 'Order not found' });
      const status = String(req.body?.status || '');
      if (!ORDER_STATUSES.has(status)) return res.status(400).json({ error: 'Invalid status' });
      row.status = status;
      row.updatedAt = now();
      await row.save();
      res.json(mapOrder(row.toObject()));
    })
  );

  router.get(
    '/inquiries',
    asyncRoute(async (_req, res) => {
      const rows = await Inquiry.find().sort({ id: -1 }).lean();
      res.json(
        rows.map((row) => ({
          id: row.id,
          name: row.name,
          phone: row.phone,
          college: row.college,
          message: row.message,
          status: row.status,
          created_at: row.createdAt
        }))
      );
    })
  );

  router.patch(
    '/inquiries/:id',
    asyncRoute(async (req, res) => {
      const row = await Inquiry.findOne({ id: Number(req.params.id) });
      if (!row) return res.status(404).json({ error: 'Inquiry not found' });
      const status = String(req.body?.status || '');
      if (!INQUIRY_STATUSES.has(status)) return res.status(400).json({ error: 'Invalid status' });
      row.status = status;
      await row.save();
      res.json({
        id: row.id,
        name: row.name,
        phone: row.phone,
        college: row.college,
        message: row.message,
        status: row.status,
        created_at: row.createdAt
      });
    })
  );

  router.get(
    '/settings',
    asyncRoute(async (_req, res) => {
      res.json(await getSettings());
    })
  );

  router.put(
    '/settings',
    asyncRoute(async (req, res) => {
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
      res.json(await setSettings(patch));
    })
  );

  router.put(
    '/password',
    asyncRoute(async (req, res) => {
      const current = String(req.body?.currentPassword || '');
      const next = String(req.body?.newPassword || '');
      if (next.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' });
      const admin = await Admin.findById(req.admin.id);
      if (!admin || !verifyPassword(current, admin.passwordHash)) {
        return res.status(400).json({ error: 'Current password is wrong' });
      }
      admin.passwordHash = hashPassword(next);
      await admin.save();
      res.json({ ok: true });
    })
  );

  router.post('/upload', (req, res) => {
    upload.single('image')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
      if (!req.file) return res.status(400).json({ error: 'Choose an image' });
      const ext = path.extname(req.file.originalname || '').toLowerCase();
      const safe = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext) ? ext : '.png';
      const key = 'glowfit/' + randomUUID() + safe;
      uploadImage({
        key,
        body: req.file.buffer,
        contentType: req.file.mimetype || 'image/png'
      })
        .then((url) => res.status(201).json({ url }))
        .catch((saveErr) => res.status(400).json({ error: saveErr.message || 'Upload failed' }));
    });
  });

  return router;
}

function mapOrder(row) {
  return {
    id: row.id,
    status: row.status,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerCity: row.customerCity,
    notes: row.notes,
    productSlug: row.productSlug,
    productName: row.productName,
    productImage: row.productImage,
    colorId: row.colorId,
    colorName: row.colorName,
    colorHex: row.colorHex,
    fit: row.fit,
    size: row.size,
    qty: row.qty,
    price: row.price,
    total: row.total,
    measurements: row.measurements || {},
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}
