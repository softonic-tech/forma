import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { formatPrice } from '../../lib/format.js';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  function load() {
    api('/api/admin/products')
      .then(setProducts)
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function remove(id) {
    if (!confirm('Delete this product?')) return;
    try {
      await api('/api/admin/products/' + id, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Products</h1>
          <p>What customers see in the shop and on the homepage.</p>
        </div>
        <Link className="admin-btn" to="/admin/products/new">
          Add product
        </Link>
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-scroll">
      <table className="admin-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Price</th>
            <th>Type</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img className="admin-thumb" src={p.image} alt="" />
              </td>
              <td data-label="Name">
                {p.name}
                {p.featured ? ' · Featured' : ''}
              </td>
              <td data-label="Price">{formatPrice(p.price)}</td>
              <td data-label="Type">{p.categoryLabel}</td>
              <td data-label="Status">
                <span className={'admin-badge ' + (p.active ? 'confirmed' : 'cancelled')}>{p.active ? 'Live' : 'Hidden'}</span>
              </td>
              <td className="admin-actions">
                <Link className="admin-btn light" to={'/admin/products/' + p.id}>
                  Edit
                </Link>
                <button className="admin-btn danger" type="button" onClick={() => remove(p.id)}>
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
