import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';
import '../../admin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = 'Admin | Glow Fit';
    document.body.classList.add('admin-body');
    api('/api/admin/me')
      .then(() => navigate('/admin', { replace: true }))
      .catch(() => {});
    return () => document.body.classList.remove('admin-body');
  }, [navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api('/api/admin/login', { method: 'POST', body: form });
      navigate('/admin');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="admin-login">
      <form onSubmit={onSubmit}>
        <img src="/logo.png" alt="Glow Fit Scrubs" />
        <h1>Admin</h1>
        <div className="admin-field">
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            placeholder="admin@glowfit.pk"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error ? <p className="admin-error">{error}</p> : null}
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
