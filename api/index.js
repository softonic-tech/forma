import dotenv from 'dotenv';
import path from 'node:path';
import { createApp } from '../server/app.js';
import { ROOT } from '../server/db.js';

dotenv.config({ path: path.join(ROOT, '.env') });

const app = createApp();

export default function handler(req, res) {
  const url = req.url || '/';
  if (url === '/api' || url.startsWith('/api?') || url.startsWith('/api/index')) {
    const original = req.headers['x-vercel-original-url'] || req.headers['x-invoke-path'] || req.headers['x-forwarded-uri'];
    if (original) req.url = original;
  } else if (!url.startsWith('/api') && !url.startsWith('/uploads')) {
    req.url = '/api' + (url.startsWith('/') ? url : '/' + url);
  }
  return app(req, res);
}
