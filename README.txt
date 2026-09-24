Glow Fit Scrubs — React storefront + Node admin API

cp .env.example .env
npm install
npm run dev

Shop: http://127.0.0.1:5173
Admin: http://127.0.0.1:5173/admin
Default login: admin@glowfit.pk / GlowFit!Admin

Production: set JWT_SECRET and ADMIN_PASSWORD, then
npm run build && npm start
