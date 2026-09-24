import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

const FIELDS = [
  ['brandName', 'Brand name'],
  ['tagline', 'Tagline'],
  ['promise', 'Promise'],
  ['feel', 'Feel line'],
  ['whatsappName', 'WhatsApp name'],
  ['whatsappDisplay', 'WhatsApp display'],
  ['whatsappNumber', 'WhatsApp number (92…)'],
  ['phoneName', 'Call name'],
  ['phoneDisplay', 'Call display'],
  ['phoneNumber', 'Call number (92…)'],
  ['city', 'City'],
  ['address', 'Address']
];

export default function AdminSettings() {
  const [form, setForm] = useState({});
  const [pass, setPass] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api('/api/admin/settings')
      .then(setForm)
      .catch((err) => setError(err.message));
  }, []);

  async function save(e) {
    e.preventDefault();
    setError('');
    setNote('');
    setSaving(true);
    try {
      const next = await api('/api/admin/settings', { method: 'PUT', body: form });
      setForm(next);
      setNote('Settings saved. Refresh the shop to see them.');
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  async function changePassword(e) {
    e.preventDefault();
    setError('');
    setNote('');
    try {
      await api('/api/admin/password', { method: 'PUT', body: pass });
      setPass({ currentPassword: '', newPassword: '' });
      setNote('Password updated.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Settings</h1>
          <p>Contact details and brand copy used across the site.</p>
        </div>
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
      {note ? <p>{note}</p> : null}
      <form className="admin-form" onSubmit={save}>
        {FIELDS.map(([key, label]) => (
          <label key={key}>
            {label}
            <input value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </label>
        ))}
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
      <form className="admin-form" style={{ marginTop: 24 }} onSubmit={changePassword}>
        <h2>Change password</h2>
        <label>
          Current password
          <input type="password" value={pass.currentPassword} onChange={(e) => setPass({ ...pass, currentPassword: e.target.value })} required />
        </label>
        <label>
          New password
          <input type="password" value={pass.newPassword} onChange={(e) => setPass({ ...pass, newPassword: e.target.value })} required minLength={8} />
        </label>
        <button className="admin-btn" type="submit">
          Update password
        </button>
      </form>
    </>
  );
}
