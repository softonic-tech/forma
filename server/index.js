import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'node:path';
import { requireAdmin } from './auth.js';
import { db, migrate, ROOT, UPLOADS_DIR } from './db.js';
import { adminRouter } from './routes/admin.js';
import { publicRouter } from './routes/public.js';
import { seed } from './seed.js';

dotenv.config({ path: path.join(ROOT, '.env') });

const PORT = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === 'production';

migrate();
seed();

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(compression());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)) return cb(null, true);
      if (process.env.APP_URL && origin === process.env.APP_URL) return cb(null, true);
      cb(null, false);
    },
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: isProd ? '7d' : 0 }));

const writeLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false
});
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', publicRouter(writeLimit));
app.use('/api/admin/login', loginLimit);
app.use('/api/admin', (req, res, next) => {
  if (req.path === '/login') return next();
  return requireAdmin(db)(req, res, next);
});
app.use('/api/admin', adminRouter());

if (isProd) {
  const dist = path.join(ROOT, 'dist');
  app.use(express.static(dist, { maxAge: '1h' }));
  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  const message = isProd ? 'Something went wrong' : err.message || 'Error';
  res.status(err.status || 500).json({ error: message });
});

if (isProd && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16)) {
  console.error('Set JWT_SECRET (16+ characters) before running in production');
  process.exit(1);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log('Glow Fit API on http://127.0.0.1:' + PORT);
});
