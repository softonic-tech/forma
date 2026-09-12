import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useOrder } from '../context/OrderContext.jsx';
import Icon from './Icon.jsx';
import Marquee from './Marquee.jsx';

export default function Layout({ children, isHome = false }) {
  const { qty } = useOrder();
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
        <span>FROM ONE PERSON TO AN ENTIRE CAMPUS.</span>
        <span>MADE IN PESHAWAR, PAKISTAN.</span>
        <span>SCRUBS & UNIFORMS.</span>
        <span>FROM ONE PERSON TO AN ENTIRE CAMPUS.</span>
        <span>MADE IN PESHAWAR, PAKISTAN.</span>
        <span>SCRUBS & UNIFORMS.</span>
      </Marquee>
      <header className="header">
        <Link className="logo" to="/" aria-label="Forma home">
          forma<span>®</span>
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
            <Icon name="building" />
            For institutions
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
        <Link className="logo" to="/">
          forma<span>®</span>
        </Link>
        <p>Made for your every day.</p>
        <span>SCRUBS & UNIFORMS · PESHAWAR, PAKISTAN</span>
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
    </>
  );
}
