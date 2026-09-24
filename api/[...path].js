import dotenv from 'dotenv';
import path from 'node:path';
import { createApp } from '../server/app.js';
import { ROOT } from '../server/db.js';

dotenv.config({ path: path.join(ROOT, '.env') });

const app = createApp();

export default function handler(req, res) {
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}
