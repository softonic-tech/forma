import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Layout from '../components/Layout.jsx';
import { useStore } from '../context/StoreContext.jsx';

export default function About() {
  const { colors, settings } = useStore();

  useEffect(() => {
    document.title = 'Made for you | ' + settings.brandName;
  }, [settings]);

  return (
    <Layout>
      <main>
        <section className="page-hero section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span className="line"></span> 02 / MADE TO LAST, MADE FOR YOU
              </p>
              <h1>
                Not just a size.
                <br />
                <em>Your fit.</em>
              </h1>
            </div>
            <p>
              {settings.tagline}. {settings.promise}.
              <br />
              Made in Peshawar, for your every day.
            </p>
          </div>
        </section>

        <section className="custom section">
          <div className="custom-title">
            <p className="eyebrow">WHY GLOW FIT</p>
            <h2>
              Comfort that
              <br />
              <em>moves with you.</em>
            </h2>
            <p>We cut for the hours you actually live in uniform — lectures, rounds, the walk between buildings, and the wash that follows.</p>
            <Link className="button dark" to="/shop">
              Find your fit <Icon name="arrowUpRight" />
            </Link>
          </div>
          <div className="custom-details">
            <article>
              <span>01</span>
              <div>
                <h3>Breathable, stretchable cloth</h3>
                <p>Soft, lightweight fabric that flexes with you and stays comfortable through a long shift.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Your colour, your identity</h3>
                <p>Navy, teal, black, grey, burgundy, and olive — plus custom colourways on request for schools and colleges.</p>
                <div className="colour-palette" aria-label="Available colours: navy, teal, black, grey, burgundy and olive">
                  {colors.map((c) => (
                    <i key={c.id} style={{ background: c.hex }} title={c.name} />
                  ))}
                </div>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>Modern design. Multiple pockets.</h3>
                <p>Unisex and tailored fits, with the pockets you actually use. We confirm every order on WhatsApp before you pay.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="bulk">
          <div className="bulk-top">
            <span className="eyebrow">MADE IN PESHAWAR</span>
            <span>PESHAWAR, PK</span>
          </div>
          <div className="bulk-content">
            <h2>
              Stylish look.
              <br />
              Professional feel.
              <br />
              <em>Made for you.</em>
            </h2>
            <div>
              <p>Glow Fit is a small line on purpose — premium scrubs that survive a full rotation, not just a photograph.</p>
              <div className="bulk-tags">
                <span>Breathable fabric</span>
                <span>Easy to wash</span>
                <span>Unisex fit</span>
              </div>
            </div>
          </div>
          <div className="bulk-bottom">
            <p>
              Find the piece that feels like you.
              <br />
              <small>Single-piece and institutional orders welcome.</small>
            </p>
            <Link className="button light" to="/shop">
              Shop the collection <Icon name="arrowUpRight" />
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
