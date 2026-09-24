import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const empty = {
  name: '',
  slug: '',
  category: 'set',
  categoryLabel: '',
  tag: '',
  summary: '',
  blurb: '',
  details: '',
  price: 4900,
  featured: false,
  active: true,
  image: '/assets/men-transparent.png',
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colorIds: [],
  sortOrder: 0
};

export default function AdminProductEdit() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [colors, setColors] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api('/api/admin/colors').then((list) => {
      setColors(list);
      if (isNew) setForm((prev) => ({ ...prev, colorIds: list.map((c) => c.id) }));
    });
    if (!isNew) {
      api('/api/admin/products/' + id)
        .then((p) =>
          setForm({
            ...empty,
            ...p,
            colorIds: (p.colors || []).map((c) => c.id)
          })
        )
        .catch((err) => setError(err.message));
    }
  }, [id, isNew]);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggle(listName, value) {
    setForm((prev) => {
      const list = prev[listName];
      return {
        ...prev,
        [listName]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
      };
    });
  }

  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await api('/api/admin/upload', { method: 'POST', body: data });
      setField('image', res.url);
    } catch (err) {
      setError(err.message);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (isNew) await api('/api/admin/products', { method: 'POST', body: payload });
      else await api('/api/admin/products/' + id, { method: 'PUT', body: payload });
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>{isNew ? 'New product' : 'Edit product'}</h1>
          <p>This updates the live shop as soon as you save.</p>
        </div>
        <Link className="admin-btn light" to="/admin/products">
          Back
        </Link>
      </div>
      <form className="admin-form" onSubmit={onSubmit}>
        <div className="admin-row">
          <label>
            Name
            <input value={form.name} onChange={(e) => setField('name', e.target.value)} required />
          </label>
          <label>
            Slug
            <input value={form.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="everyday-essential" />
          </label>
        </div>
        <div className="admin-row">
          <label>
            Category
            <select value={form.category} onChange={(e) => setField('category', e.target.value)}>
              <option value="set">Set</option>
              <option value="top">Top</option>
              <option value="pants">Pants</option>
            </select>
          </label>
          <label>
            Category label
            <input value={form.categoryLabel} onChange={(e) => setField('categoryLabel', e.target.value)} placeholder="For him" />
          </label>
        </div>
        <div className="admin-row">
          <label>
            Tag
            <input value={form.tag} onChange={(e) => setField('tag', e.target.value)} />
          </label>
          <label>
            Price (PKR)
            <input type="number" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} required />
          </label>
        </div>
        <label>
          Summary
          <input value={form.summary} onChange={(e) => setField('summary', e.target.value)} />
        </label>
        <label>
          Blurb
          <textarea value={form.blurb} onChange={(e) => setField('blurb', e.target.value)} />
        </label>
        <label>
          Details
          <textarea value={form.details} onChange={(e) => setField('details', e.target.value)} />
        </label>
        <label>
          Image URL
          <input value={form.image} onChange={(e) => setField('image', e.target.value)} />
        </label>
        <label>
          Or upload an image
          <input type="file" accept="image/*" onChange={upload} />
        </label>
        {form.image ? <img className="admin-preview" src={form.image} alt="" /> : null}
        <div>
          <strong>Sizes</strong>
          <div className="admin-checks">
            {SIZE_OPTIONS.map((size) => (
              <label key={size}>
                <input type="checkbox" checked={form.sizes.includes(size)} onChange={() => toggle('sizes', size)} />
                {size}
              </label>
            ))}
          </div>
        </div>
        <div>
          <strong>Colours</strong>
          <div className="admin-checks">
            {colors.map((c) => (
              <label key={c.id}>
                <input type="checkbox" checked={form.colorIds.includes(c.id)} onChange={() => toggle('colorIds', c.id)} />
                <i style={{ width: 14, height: 14, borderRadius: '50%', background: c.hex, display: 'inline-block' }} />
                {c.name}
              </label>
            ))}
          </div>
        </div>
        <div className="admin-checks">
          <label>
            <input type="checkbox" checked={form.featured} onChange={(e) => setField('featured', e.target.checked)} />
            Featured on homepage
          </label>
          <label>
            <input type="checkbox" checked={form.active} onChange={(e) => setField('active', e.target.checked)} />
            Visible in shop
          </label>
        </div>
        {error ? <p className="admin-error">{error}</p> : null}
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save product'}
        </button>
      </form>
    </>
  );
}
