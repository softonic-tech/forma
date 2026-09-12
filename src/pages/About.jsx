import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Layout from '../components/Layout.jsx';

export default function About() {
  useEffect(() => {
    document.title = 'Made for you | FORMA';
  }, []);

  return (
    <Layout>
      <main>
        <section className="page-hero section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span className="line"></span> 02 / PERSONALLY YOURS
              </p>
              <h1>
                Not just a size.
                <br />
                <em>Your fit.</em>
              </h1>
            </div>
            <p>
              Scrubs that move with you. Uniforms that bring you together.
              <br />
              Made in Peshawar, for your every day.
            </p>
          </div>
        </section>

        <section className="custom section">
          <div className="custom-title">
            <p className="eyebrow">WHY FORMA</p>
            <h2>
              Purpose in
              <br />
              <em>every thread.</em>
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
                <h3>A fit that’s yours</h3>
                <p>Custom sizing and measurements for men and women, so a single piece or a whole team can feel considered.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Your colour, your identity</h3>
                <p>Coordinate with your school, college or personal style. Navy, steel, teal and custom colourways on request.</p>
                <div className="colour-palette" aria-label="Colour inspiration: navy, steel blue, teal, burgundy and charcoal">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>One piece. A whole team.</h3>
                <p>The same approach whether you are ordering for yourself or outfitting a campus. We confirm every detail on WhatsApp before you pay.</p>
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
              For him.
              <br />
              For her.
              <br />
              <em>For your team.</em>
            </h2>
            <div>
              <p>FORMA is a small line on purpose — everyday scrubs and uniforms that survive a full rotation, not just a photograph.</p>
              <div className="bulk-tags">
                <span>Schools & colleges</span>
                <span>Group scrub orders</span>
                <span>Custom measurements</span>
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
