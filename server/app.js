import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'node:path';
import { requireAdmin } from './auth.js';
import { connectDb, ROOT } from './db.js';
import { Media } from './models.js';
import { adminRouter } from './routes/admin.js';
import { publicRouter } from './routes/public.js';
import { seed } from './seed.js';

const isProd = process.env.NODE_ENV === 'production';

function asyncRoute(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function createApp() {
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
        try {
          const host = new URL(origin).hostname;
          if (host === '127.0.0.1' || host === 'localhost' || host.endsWith('.vercel.app')) return cb(null, true);
        } catch {
          return cb(null, false);
        }
        if (process.env.APP_URL && origin === process.env.APP_URL) return cb(null, true);
        cb(null, false);
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(
    asyncRoute(async (_req, _res, next) => {
      await connectDb();
      await seed();
      next();
    })
  );

  async function serveUpload(req, res) {
    const file = await Media.findOne({ filename: req.params.filename }).lean();
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Cache-Control', isProd ? 'public, max-age=604800' : 'no-store');
    res.send(file.data.buffer || file.data);
  }
  app.get('/uploads/:filename', asyncRoute(serveUpload));
  app.get('/api/uploads/:filename', asyncRoute(serveUpload));

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
    return requireAdmin()(req, res, next);
  });
  app.use('/api/admin', adminRouter());

  if (isProd && process.env.VERCEL !== '1') {
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

  return app;
}
