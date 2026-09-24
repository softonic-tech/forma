# Glow Fit Scrubs

Storefront, Node API, and admin panel for Glow Fit in Peshawar.

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

- Shop: http://127.0.0.1:5173
- Admin: http://127.0.0.1:5173/admin
- Default admin: `admin@glowfit.pk` / `GlowFit!Admin`

Change those values in `.env` before anyone else uses the site.

## Production

1. Set a long `JWT_SECRET`, a strong `ADMIN_PASSWORD`, and `APP_URL` to the public site URL.
2. `NODE_ENV=production`
3. Build and start:

```bash
npm run build
npm start
```

The API serves the built shop and admin from `dist/` on `PORT` (3000 by default). Put nginx or Caddy in front for HTTPS.

SQLite lives in `data/glowfit.db`. Uploaded product images live in `data/uploads`.
