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

Set `MONGODB_URI` to a MongoDB Atlas database. The first start creates the admin user, colours, and catalog.

Change `JWT_SECRET` and `ADMIN_PASSWORD` before anyone else uses the site.

## Vercel

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Allow access from anywhere (`0.0.0.0/0`) or from Vercel IPs.
3. Add these environment variables in the Vercel project:

- `MONGODB_URI`
- `JWT_SECRET` (16+ characters)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `APP_URL` (your Vercel URL, e.g. `https://your-app.vercel.app`)
- `NODE_ENV=production`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET_NAME`

Product images uploaded in admin are stored in that S3 bucket under `glowfit/`. The bucket needs public read so the shop can show them.

4. Redeploy. `/admin`, `/shop`, and the API then share that MongoDB database.

## VPS / Railway / Render

```bash
npm run build
npm start
```

The API serves the built shop and admin from `dist/` on `PORT` (3000 by default). Put nginx or Caddy in front for HTTPS.
