import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

export default function AdminInquiries() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  function load() {
    api('/api/admin/inquiries')
      .then(setRows)
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function setStatus(id, status) {
    try {
      await api('/api/admin/inquiries/' + id, { method: 'PATCH', body: { status } });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Inquiries</h1>
          <p>Messages from the contact form.</p>
        </div>
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
      {rows.length ? (
        <div className="admin-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>From</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{new Date(row.created_at).toLocaleString()}</td>
                <td>
                  {row.name}
                  <br />
                  {row.phone}
                  {row.college ? <><br />{row.college}</> : null}
                </td>
                <td>{row.message}</td>
                <td>
                  <select value={row.status} onChange={(e) => setStatus(row.id, e.target.value)}>
                    <option value="new">new</option>
                    <option value="read">read</option>
                    <option value="replied">replied</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <p className="admin-empty">No inquiries yet.</p>
      )}
    </>
  );
}
