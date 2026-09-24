import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const COOKIE = 'gf_admin';
const WEEK = 7 * 24 * 60 * 60;

export function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set to at least 16 characters in production');
  }
  return 'glow-fit-dev-secret-change-me';
}

export function hashPassword(password) {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export function signAdmin(admin) {
  return jwt.sign({ sub: admin.id, email: admin.email }, jwtSecret(), { expiresIn: WEEK });
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: WEEK * 1000,
    path: '/'
  };
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE, token, cookieOptions());
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE, { ...cookieOptions(), maxAge: 0 });
}

export function requireAdmin(db) {
  return function adminGuard(req, res, next) {
    const token = req.cookies?.[COOKIE];
    if (!token) return res.status(401).json({ error: 'Sign in required' });
    try {
      const payload = jwt.verify(token, jwtSecret());
      const admin = db.prepare('SELECT id, email FROM admins WHERE id = ?').get(payload.sub);
      if (!admin) return res.status(401).json({ error: 'Sign in required' });
      req.admin = admin;
      next();
    } catch {
      return res.status(401).json({ error: 'Sign in required' });
    }
  };
}
