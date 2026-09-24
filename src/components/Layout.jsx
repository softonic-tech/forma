import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useOrder } from '../context/OrderContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import Marquee from './Marquee.jsx';

export default function Layout({ children, isHome = false }) {
  const { qty } = useOrder();
  const { settings } = useStore();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('js');
    document.body.classList.toggle('page', !isHome);
    return () => {
      document.body.classList.remove('page');
    };
  }, [isHome]);

  useEffect(() => {
    setNavOpen(false);
    document.body.classList.remove('nav-open');
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.classList.toggle('nav-open', navOpen);
  }, [navOpen]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setNavOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function closeNav() {
    setNavOpen(false);
  }

  return (
    <>
      <div className="nav-backdrop" data-nav-backdrop hidden={!navOpen} onClick={closeNav} />
      <Marquee className="announcement">
        <span>COMFORT THAT MOVES WITH YOU.</span>
        <span>PREMIUM QUALITY · PERFECT FIT · EVERYDAY COMFORT.</span>
        <span>STYLISH LOOK. PROFESSIONAL FEEL.</span>
        <span>MADE IN PESHAWAR, PAKISTAN.</span>
        <span>COMFORT THAT MOVES WITH YOU.</span>
        <span>PREMIUM QUALITY · PERFECT FIT · EVERYDAY COMFORT.</span>
      </Marquee>
      <header className="header">
        <Link className="logo" to="/" aria-label="Glow Fit Scrubs home">
          <Logo />
        </Link>
        <nav className={navOpen ? 'nav-links is-open' : 'nav-links'} id="site-nav" aria-label="Main navigation">
          <NavLink to="/shop" onClick={closeNav}>
            <Icon name="grid" />
            The collection
          </NavLink>
          <NavLink to="/about" onClick={closeNav}>
            <Icon name="heart" />
            Made for you
          </NavLink>
          <NavLink to="/contact" onClick={closeNav}>
            <Icon name="phone" />
            Get in touch
          </NavLink>
        </nav>
        <div className="header-end">
          <Link className={qty ? 'checkout-link has-items' : 'checkout-link'} to="/checkout" aria-label="Checkout">
            <Icon name="bag" />
            {qty ? <i data-cart-count="">{qty}</i> : null}
          </Link>
          <Link className="nav-cta" to="/contact" aria-label="Bulk orders">
            <Icon name="users" />
            <span className="nav-cta-label">Bulk orders</span>
            <Icon name="arrowUpRight" />
          </Link>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={navOpen}
            aria-controls="site-nav"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setNavOpen((open) => !open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      {children}
      <footer>
        <Link className="logo" to="/" aria-label="Glow Fit Scrubs home">
          <Logo />
        </Link>
        <p>{settings.tagline}.</p>
        <span>PREMIUM SCRUBS · PESHAWAR, PAKISTAN</span>
        {isHome ? (
          <a
            href="#"
            aria-label="Back to top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo(0, 0);
            }}
          >
            <Icon name="arrowUp" />
          </a>
        ) : (
          <Link to="/" aria-label="Back home">
            <Icon name="arrowUp" />
          </Link>
        )}
      </footer>
      {location.pathname === '/shop' || location.pathname === '/checkout' ? null : (
        <Link className="button dark shop-now-btn" to="/shop">
          Shop now
          <Icon name="bag" />
        </Link>
      )}
    </>
  );
}
