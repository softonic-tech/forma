import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

export default function ProductCard({ product }) {
  return (
    <Link className="product-card" to={'/product/' + product.slug}>
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="image-tag">{product.tag || product.categoryLabel}</span>
        <span className="round-arrow">
          <Icon name="arrowUpRight" />
        </span>
      </div>
      <div className="product-info">
        <div>
          <h3>{product.name}</h3>
          <p>{product.summary || product.blurb}</p>
        </div>
        <div className="swatches" aria-label="Available colours">
          {product.colors.map((c) => (
            <i key={c.id} style={{ background: c.hex }} title={c.name}></i>
          ))}
        </div>
      </div>
    </Link>
  );
}
