import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { formatPrice } from '../../lib/format.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/admin/stats')
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="admin-error">{error}</p>;
  if (!stats) return <p>Loading overview…</p>;

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Overview</h1>
          <p>Orders, inquiries, and the live catalog.</p>
        </div>
        <Link className="admin-btn" to="/admin/products/new">
          Add product
        </Link>
      </div>
      <div className="admin-grid">
        <div className="admin-card">
          <span>NEW ORDERS</span>
          <strong>{stats.newOrders}</strong>
        </div>
        <div className="admin-card">
          <span>NEW INQUIRIES</span>
          <strong>{stats.newInquiries}</strong>
        </div>
        <div className="admin-card">
          <span>LIVE PRODUCTS</span>
          <strong>{stats.products}</strong>
        </div>
        <div className="admin-card">
          <span>CONFIRMED TOTAL</span>
          <strong>{formatPrice(stats.revenue)}</strong>
        </div>
      </div>
      <h2>Recent orders</h2>
      {stats.recent.length ? (
        <div className="admin-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent.map((row) => (
              <tr key={row.id}>
                <td data-label="ID">#{row.id}</td>
                <td data-label="Customer">{row.customer_name}</td>
                <td data-label="Item">{row.product_name}</td>
                <td data-label="Total">{formatPrice(row.total)}</td>
                <td data-label="Status">
                  <span className={'admin-badge ' + row.status}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <p className="admin-empty">No orders yet. They appear here after checkout.</p>
      )}
    </>
  );
}
