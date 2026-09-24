import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

export default function AdminColors() {
  const [colors, setColors] = useState([]);
  const [form, setForm] = useState({ name: '', hex: '#0a2348' });
  const [error, setError] = useState('');

  function load() {
    api('/api/admin/colors')
      .then(setColors)
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function add(e) {
    e.preventDefault();
    setError('');
    try {
      await api('/api/admin/colors', { method: 'POST', body: form });
      setForm({ name: '', hex: '#0a2348' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function save(color) {
    try {
      await api('/api/admin/colors/' + color.id, { method: 'PUT', body: color });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!confirm('Delete this colour?')) return;
    try {
      await api('/api/admin/colors/' + id, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Colours</h1>
          <p>Shared swatches for the shop and product pages.</p>
        </div>
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
      <form className="admin-form" onSubmit={add}>
        <div className="admin-row">
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label>
            Hex
            <input value={form.hex} onChange={(e) => setForm({ ...form, hex: e.target.value })} required />
          </label>
        </div>
        <button className="admin-btn" type="submit">
          Add colour
        </button>
      </form>
      <div className="admin-scroll" style={{ marginTop: 24 }}>
      <table className="admin-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Hex</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {colors.map((c) => (
            <tr key={c.id}>
              <td>
                <i style={{ width: 22, height: 22, borderRadius: '50%', background: c.hex, display: 'block' }} />
              </td>
              <td>
                <input value={c.name} onChange={(e) => setColors((all) => all.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)))} />
              </td>
              <td>
                <input value={c.hex} onChange={(e) => setColors((all) => all.map((x) => (x.id === c.id ? { ...x, hex: e.target.value } : x)))} />
              </td>
              <td className="admin-actions">
                <button className="admin-btn light" type="button" onClick={() => save(c)}>
                  Save
                </button>
                <button className="admin-btn danger" type="button" onClick={() => remove(c.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
