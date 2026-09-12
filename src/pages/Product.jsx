import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Layout from '../components/Layout.jsx';
import { useOrder } from '../context/OrderContext.jsx';
import { CATALOG } from '../data/catalog.js';
import { config } from '../data/config.js';
import { formatPrice } from '../lib/format.js';

export default function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setOrder } = useOrder();
  const product = CATALOG.find((p) => p.slug === slug);

  const [color, setColor] = useState(product ? product.colors[0] : null);
  const [size, setSize] = useState(product ? product.sizes[2] || product.sizes[0] : 'M');
  const [qty, setQty] = useState(1);
  const [fit, setFit] = useState('standard');
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hip: '',
    topLength: '',
    inseam: '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      document.title = product.name + ' | ' + (config.brandName || 'FORMA');
      setColor(product.colors[0]);
      setSize(product.sizes[2] || product.sizes[0]);
      setQty(1);
      setFit('standard');
      setError('');
    } else {
      document.title = 'Product | FORMA';
    }
  }, [product]);

  function updateMeasure(e) {
    const { name, value } = e.target;
    setMeasurements((prev) => ({ ...prev, [name]: value }));
  }

  function goCheckout() {
    if (fit === 'custom' && (!measurements.chest.trim() || !measurements.waist.trim())) {
      setError('Please add chest and waist measurements for a single custom piece.');
      return;
    }
    setOrder({
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: fit === 'custom' ? 1 : qty,
      colorId: color.id,
      colorName: color.name,
      colorHex: color.hex,
      fit,
      size,
      measurements: { ...measurements }
    });
    navigate('/checkout');
  }

  if (!product) {
    return (
      <Layout>
        <main>
          <div className="section">
            <div className="empty-state">
              <p className="eyebrow">
                <span className="line"></span> 01 / THE EVERYDAY COLLECTION
              </p>
              <h2>
                This piece is
                <br />
                <em>not in the collection.</em>
              </h2>
              <p>Browse the everyday uniforms to pick a set, top, or pant.</p>
              <Link className="button dark" to="/shop">
                Back to the collection <Icon name="arrowUpRight" />
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main>
        <div className="section">
          <nav className="breadcrumb">
            <Link to="/shop">The collection</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>
          <div className="pdp">
            <div className="pdp-visual">
              <div className="product-image">
                <img src={product.image} alt={product.name + ' in ' + color.name} />
                <span className="image-tag">{product.tag || product.categoryLabel}</span>
              </div>
            </div>
            <div className="pdp-buy">
              <p className="eyebrow">
                <span className="line"></span> {product.categoryLabel}
              </p>
              <h1 className="pdp-title">{product.name}</h1>
              <p className="pdp-price">{formatPrice(product.price)}</p>
              <p className="pdp-blurb">{product.blurb}</p>
              <p className="pdp-details">{product.details}</p>
              <div className="option-block">
                <div className="option-label">
                  Colour · <span>{color.name}</span>
                </div>
                <div className="swatch-row">
                  {product.colors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={c.id === color.id ? 'swatch is-active' : 'swatch'}
                      style={{ '--swatch': c.hex }}
                      aria-label={c.name}
                      aria-pressed={c.id === color.id}
                      onClick={() => {
                        setColor(c);
                        setError('');
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="option-block">
                <div className="option-label">
                  Fit ·{' '}
                  <Link to="/size-guide">
                    <Icon name="ruler" /> Size guide
                  </Link>
                </div>
                <div className="fit-toggle">
                  <button
                    type="button"
                    className={fit === 'standard' ? 'size-btn is-active' : 'size-btn'}
                    onClick={() => {
                      setFit('standard');
                      setError('');
                    }}
                  >
                    Standard size
                  </button>
                  <button
                    type="button"
                    className={fit === 'custom' ? 'size-btn is-active' : 'size-btn'}
                    onClick={() => {
                      setFit('custom');
                      setQty(1);
                      setError('');
                    }}
                  >
                    Custom measurements
                  </button>
                </div>
                {fit === 'custom' ? (
                  <div className="measure-panel">
                    <p className="measure-hint">
                      Custom measurements are for a single piece. Enter inches from the <Link to="/size-guide">size guide</Link>.
                    </p>
                    <div className="measure-grid">
                      <label className="field">
                        Chest *
                        <input name="chest" type="text" inputMode="decimal" placeholder="e.g. 38" value={measurements.chest} onChange={updateMeasure} />
                      </label>
                      <label className="field">
                        Waist *
                        <input name="waist" type="text" inputMode="decimal" placeholder="e.g. 32" value={measurements.waist} onChange={updateMeasure} />
                      </label>
                      <label className="field">
                        Hip
                        <input name="hip" type="text" inputMode="decimal" value={measurements.hip} onChange={updateMeasure} />
                      </label>
                      <label className="field">
                        Top length
                        <input name="topLength" type="text" inputMode="decimal" value={measurements.topLength} onChange={updateMeasure} />
                      </label>
                      <label className="field">
                        Inseam
                        <input name="inseam" type="text" inputMode="decimal" value={measurements.inseam} onChange={updateMeasure} />
                      </label>
                    </div>
                    <label className="field">
                      Notes
                      <input
                        name="notes"
                        type="text"
                        placeholder="Preferred ease, sleeve length, or other detail."
                        value={measurements.notes}
                        onChange={updateMeasure}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="size-row">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={s === size ? 'size-btn is-active' : 'size-btn'}
                        aria-pressed={s === size}
                        onClick={() => {
                          setSize(s);
                          setError('');
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="option-block">
                <div className="option-label">Quantity</div>
                {fit === 'custom' ? (
                  <p className="measure-hint">Quantity is set to one for a custom-measured piece.</p>
                ) : (
                  <div className="qty-stepper">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQty((n) => Math.max(1, n - 1))}>
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1)))}
                    />
                    <button type="button" aria-label="Increase quantity" onClick={() => setQty((n) => Math.min(20, n + 1))}>
                      +
                    </button>
                  </div>
                )}
              </div>
              {error ? <p className="form-error">{error}</p> : null}
              <div className="pdp-actions">
                <button type="button" className="button dark" onClick={goCheckout}>
                  Continue to checkout <Icon name="bag" />
                </button>
                <Link className="button light" to="/contact">
                  Plan a bulk order <Icon name="users" />
                </Link>
              </div>
              <p className="fine-print">
                Choose a colour and a standard size, or enter measurements for one piece, then check out. We confirm the order on WhatsApp before you pay.
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
