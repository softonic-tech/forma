import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Layout from '../components/Layout.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { CATALOG, COLORS } from '../data/catalog.js';

export default function Shop() {
  const [category, setCategory] = useState('all');
  const [color, setColor] = useState('all');

  useEffect(() => {
    document.title = 'The collection | FORMA';
  }, []);

  const matches = useMemo(
    () =>
      CATALOG.filter((p) => {
        const catOk = category === 'all' || p.category === category;
        const colorOk = color === 'all' || p.colors.some((c) => c.id === color);
        return catOk && colorOk;
      }),
    [category, color]
  );

  return (
    <Layout>
      <main>
        <section className="page-hero section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span className="line"></span> 01 / THE EVERYDAY COLLECTION
              </p>
              <h1>
                Good fit.
                <br />
                <em>Great feeling.</em>
              </h1>
            </div>
            <p>
              For your first day on campus and every shift after.
              <br />
              Pick a colour and quantity, or enter measurements for one piece.
            </p>
          </div>
          <div className="filters">
            <div className="filter-row">
              <span className="filter-label" aria-label="Type">
                <Icon name="shirt" />
              </span>
              {[
                ['all', 'grid', 'All'],
                ['set', 'layers', 'Sets'],
                ['top', 'shirt', 'Tops'],
                ['pants', 'pants', 'Pants']
              ].map(([id, icon, label]) => (
                <button
                  key={id}
                  type="button"
                  className={category === id ? 'filter-btn is-active' : 'filter-btn'}
                  aria-label={label}
                  title={label}
                  onClick={() => setCategory(id)}
                >
                  <Icon name={icon} />
                  <span className="filter-btn-label">{label}</span>
                </button>
              ))}
            </div>
            <div className="filter-row">
              <span className="filter-label" aria-label="Colour">
                <Icon name="palette" />
              </span>
              <button
                type="button"
                className={color === 'all' ? 'filter-btn is-active' : 'filter-btn'}
                aria-label="All colours"
                title="All"
                onClick={() => setColor('all')}
              >
                All
              </button>
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={color === c.id ? 'filter-swatch is-active' : 'filter-swatch'}
                  style={{ '--swatch': c.hex }}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => setColor(c.id)}
                />
              ))}
            </div>
          </div>
          <div className="collection-grid">
            {matches.length ? (
              matches.map((product) => <ProductCard key={product.slug} product={product} />)
            ) : (
              <p className="empty-state">
                No uniforms match those filters.{' '}
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    setCategory('all');
                    setColor('all');
                  }}
                >
                  Clear filters
                </button>
              </p>
            )}
          </div>
          <p className="page-note">
            Need a closer measurement? Enter it on the product page for a single piece, or{' '}
            <Link to="/size-guide">
              see the size guide <Icon name="ruler" />
            </Link>
          </p>
        </section>
      </main>
    </Layout>
  );
}
