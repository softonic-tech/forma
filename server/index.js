import dotenv from 'dotenv';
import path from 'node:path';
import { createApp } from './app.js';
import { jwtSecret } from './auth.js';
import { connectDb, ROOT } from './db.js';
import { seed } from './seed.js';

dotenv.config({ path: path.join(ROOT, '.env') });

const PORT = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  try {
    jwtSecret();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

const app = createApp();

app.listen(PORT, '0.0.0.0', () => {
  console.log('Glow Fit API on http://127.0.0.1:' + PORT);
});

connectDb()
  .then(() => seed())
  .then(() => console.log('MongoDB ready'))
  .catch((err) => {
    console.error(err.message || err);
  });
