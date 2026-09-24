import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { formatPrice } from '../../lib/format.js';

const STATUSES = ['new', 'confirmed', 'completed', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  function load(status) {
    const q = status ? '?status=' + status : '';
    api('/api/admin/orders' + q)
      .then(setOrders)
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    load(filter);
  }, [filter]);

  async function setStatus(id, status) {
    try {
      await api('/api/admin/orders/' + id, { method: 'PATCH', body: { status } });
      load(filter);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Orders</h1>
          <p>Saved from checkout before the customer opens WhatsApp.</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
      {orders.length ? (
        <div className="admin-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Fit</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>
                  {order.customerName}
                  <br />
                  {order.customerPhone}
                  {order.customerCity ? <><br />{order.customerCity}</> : null}
                </td>
                <td>
                  {order.productName}
                  <br />
                  {order.colorName} · qty {order.qty}
                </td>
                <td>
                  {order.fit === 'custom' ? 'Custom' : order.size}
                  {order.notes ? <><br />{order.notes}</> : null}
                </td>
                <td>{formatPrice(order.total)}</td>
                <td>
                  <select value={order.status} onChange={(e) => setStatus(order.id, e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <p className="admin-empty">No orders in this view.</p>
      )}
    </>
  );
}
