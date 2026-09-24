import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { api } from '../../lib/api.js';
import '../../admin.css';

const LINKS = [
  { to: '/admin', label: 'Overview', icon: 'grid', end: true },
  { to: '/admin/products', label: 'Products', icon: 'shirt' },
  { to: '/admin/orders', label: 'Orders', icon: 'bag' },
  { to: '/admin/inquiries', label: 'Inquiries', icon: 'mail' },
  { to: '/admin/colors', label: 'Colours', icon: 'palette' },
  { to: '/admin/settings', label: 'Settings', icon: 'user' }
];

function Brand({ onClick }) {
  return (
    <NavLink className="admin-brand" to="/admin" onClick={onClick}>
      <img src="/logo.png" alt="Glow Fit Scrubs" />
      <small>Admin panel</small>
    </NavLink>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Admin | Glow Fit';
    document.body.classList.add('admin-body');
    api('/api/admin/me')
      .then((me) => {
        setEmail(me.email);
        setReady(true);
      })
      .catch(() => navigate('/admin/login', { replace: true }));
    return () => document.body.classList.remove('admin-body');
  }, [navigate]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('admin-menu-open', menuOpen);
    return () => document.body.classList.remove('admin-menu-open');
  }, [menuOpen]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function logout() {
    await api('/api/admin/logout', { method: 'POST' }).catch(() => {});
    navigate('/admin/login');
  }

  if (!ready) {
    return (
      <div className="admin-login">
        <p>Checking admin session…</p>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin-bar">
        <button
          className="admin-menu-btn"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="admin-sidebar"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
        <NavLink className="admin-bar-brand" to="/admin">
          <img src="/logo.png" alt="Glow Fit Scrubs" />
        </NavLink>
      </header>

      {menuOpen ? (
        <button
          className="admin-overlay"
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside id="admin-sidebar" className={'admin-side' + (menuOpen ? ' open' : '')}>
        <div className="admin-side-head">
          <Brand onClick={() => setMenuOpen(false)} />
        </div>
        <nav className="admin-nav" aria-label="Admin">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              <Icon name={link.icon} />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-side-foot">
          <span>{email}</span>
          <button className="admin-btn light" type="button" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
