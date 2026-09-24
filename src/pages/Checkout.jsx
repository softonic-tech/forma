import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Layout from '../components/Layout.jsx';
import { useOrder } from '../context/OrderContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { api } from '../lib/api.js';
import { formatPrice, whatsappUrl } from '../lib/format.js';

export default function Checkout() {
  const { order, clearOrder } = useOrder();
  const { settings } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', city: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    document.title = 'Checkout | ' + settings.brandName;
  }, [settings]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  if (!order) {
    return (
      <Layout>
        <main>
          <div className="section">
            <div className="empty-state">
              <p className="eyebrow">
                <span className="line"></span> LET’S GET THE DETAILS RIGHT
              </p>
              <h2>
                Your order is
                <br />
                <em>empty.</em>
              </h2>
              <p>Choose a scrub, pick a colour, then continue to checkout.</p>
              <Link className="button dark" to="/shop">
                Browse the collection <Icon name="arrowUpRight" />
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  const total = Number(order.price) * Number(order.qty);
  const fitLine = order.fit === 'custom' ? 'Custom measurements · 1 piece' : 'Size ' + order.size + ' · Qty ' + order.qty;
  const m = order.measurements || {};

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    setSaving(true);
    const lines = [
      'New order from the ' + settings.brandName + ' website',
      '',
      'Name: ' + form.name.trim(),
      'Phone: ' + form.phone.trim()
    ];
    if (form.city.trim()) lines.push('City: ' + form.city.trim());
    lines.push(
      '',
      'Item: ' + order.name,
      'Colour: ' + order.colorName,
      order.fit === 'custom' ? 'Fit: Custom measurements (1 piece)' : 'Size: ' + order.size,
      'Quantity: ' + (order.fit === 'custom' ? 1 : order.qty),
      'Price: ' + formatPrice(order.price) + ' each',
      'Total: ' + formatPrice(total)
    );
    if (order.fit === 'custom') {
      lines.push('', 'Measurements (inches)');
      if (m.chest) lines.push('Chest: ' + m.chest);
      if (m.waist) lines.push('Waist: ' + m.waist);
      if (m.hip) lines.push('Hip: ' + m.hip);
      if (m.topLength) lines.push('Top length: ' + m.topLength);
      if (m.inseam) lines.push('Inseam: ' + m.inseam);
      if (m.notes) lines.push('Notes: ' + m.notes);
    }
    if (form.notes.trim()) lines.push('', form.notes.trim());
    try {
      await api('/api/orders', {
        method: 'POST',
        body: {
          name: form.name,
          phone: form.phone,
          city: form.city,
          notes: form.notes,
          productSlug: order.slug,
          productName: order.name,
          productImage: order.image,
          colorId: order.colorId,
          colorName: order.colorName,
          colorHex: order.colorHex,
          fit: order.fit,
          size: order.size,
          qty: order.qty,
          price: order.price,
          measurements: order.measurements
        }
      });
      clearOrder();
      window.location.href = whatsappUrl(lines.join('\n'), settings);
    } catch (err) {
      setSubmitError(err.message || 'Could not save this order. Try again.');
      setSaving(false);
    }
  }

  return (
    <Layout>
      <main>
        <div className="section">
          <div className="section-heading checkout-heading">
            <div>
              <p className="eyebrow">
                <span className="line"></span> LET’S GET THE DETAILS RIGHT
              </p>
              <h1>
                Your next uniform
                <br />
                starts with <em>you.</em>
              </h1>
            </div>
            <p>
              Review the piece, then add your name and phone.
              <br />
              We confirm everything on WhatsApp before you pay.
            </p>
          </div>
          <div className="checkout-grid">
            <article className="order-summary">
              <p className="eyebrow">YOUR ORDER</p>
              <div className="summary-item">
                <div className="summary-visual">
                  <img src={order.image} alt="" />
                </div>
                <div>
                  <h3>{order.name}</h3>
                  <p>
                    {order.colorName} · {fitLine}
                  </p>
                  {order.fit === 'custom' ? (
                    <ul className="summary-measures">
                      {m.chest ? <li>Chest {m.chest} in</li> : null}
                      {m.waist ? <li>Waist {m.waist} in</li> : null}
                      {m.hip ? <li>Hip {m.hip} in</li> : null}
                      {m.topLength ? <li>Top length {m.topLength} in</li> : null}
                      {m.inseam ? <li>Inseam {m.inseam} in</li> : null}
                      {m.notes ? <li>{m.notes}</li> : null}
                    </ul>
                  ) : null}
                  <p className="summary-price">
                    {formatPrice(order.price)}
                    {order.qty > 1 ? ' × ' + order.qty : ''}
                  </p>
                  <Link className="text-link" to={'/product/' + order.slug}>
                    Edit this piece
                  </Link>
                </div>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  clearOrder();
                  navigate('/shop');
                }}
              >
                Remove and start again
              </button>
            </article>
            <form className="form-card" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="checkout-name">Name</label>
                <input id="checkout-name" name="name" type="text" autoComplete="name" required value={form.name} onChange={onChange} />
              </div>
              <div className="field">
                <label htmlFor="checkout-phone">Phone</label>
                <input id="checkout-phone" name="phone" type="tel" autoComplete="tel" required value={form.phone} onChange={onChange} />
              </div>
              <div className="field">
                <label htmlFor="checkout-city">
                  City <em>(optional)</em>
                </label>
                <input id="checkout-city" name="city" type="text" autoComplete="address-level2" value={form.city} onChange={onChange} />
              </div>
              <div className="field">
                <label htmlFor="checkout-notes">
                  Delivery note <em>(optional)</em>
                </label>
                <textarea
                  id="checkout-notes"
                  name="notes"
                  placeholder="Address, college, or a preferred time to confirm."
                  value={form.notes}
                  onChange={onChange}
                />
              </div>
              {submitError ? <p className="form-error">{submitError}</p> : null}
              <button type="submit" className="button dark" disabled={saving}>
                {saving ? 'Saving order…' : 'Place order on WhatsApp'} <Icon name="whatsapp" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
}
