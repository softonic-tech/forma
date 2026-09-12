import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Layout from '../components/Layout.jsx';
import Marquee from '../components/Marquee.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { CATALOG } from '../data/catalog.js';

export default function Home() {
  const featured = CATALOG.filter((p) => p.featured).slice(0, 2);

  useEffect(() => {
    document.title = 'FORMA | Made for your every day.';
  }, []);

  return (
    <Layout isHome>
      <main>
        <section className="hero-scroll" aria-labelledby="hero-title">
          <div className="hero">
            <div className="opening-scene">
              <div className="hero-models">
                <img className="hero-model hero-model-man" src="/assets/men-transparent.png" alt="Male model wearing navy scrubs" />
                <img className="hero-model hero-model-woman" src="/assets/women-transparent.png" alt="Female model wearing modest steel-blue scrubs and navy hijab" />
              </div>
              <div className="hero-shade"></div>
              <div className="hero-copy">
                <p className="eyebrow">
                  <span className="line"></span> PURPOSE IN EVERY THREAD
                </p>
                <h1 id="hero-title">
                  Made for
                  <br />
                  your <em>every</em>
                  <br />
                  day.
                </h1>
                <p className="hero-description">Scrubs that move with you. Uniforms that bring you together. Made to fit your world.</p>
                <Link className="button dark" to="/shop">
                  Find your fit <Icon name="arrowUpRight" />
                </Link>
                <div className="hero-note">FOR HIM. FOR HER. FOR YOUR WHOLE TEAM.</div>
              </div>
            </div>
            <div className="film-scene scene-men">
              <span className="scene-word" aria-hidden="true">
                move.
              </span>
              <img src="/assets/men-transparent.png" alt="Navy scrub set moving into view" />
              <div className="scene-copy">
                <p className="eyebrow">01 / THE EVERYDAY ESSENTIAL</p>
                <h2>
                  Move with
                  <br />
                  <em>purpose.</em>
                </h2>
                <p>
                  Your day. Your pace.
                  <br />
                  A fit that feels like you.
                </p>
                <Link className="button dark" to="/product/everyday-essential">
                  Explore his fit <Icon name="arrowUpRight" />
                </Link>
              </div>
            </div>
            <div className="film-scene scene-women">
              <span className="scene-word" aria-hidden="true">
                feel.
              </span>
              <img src="/assets/women-transparent.png" alt="Modest blue scrub set moving into view" />
              <div className="scene-copy">
                <p className="eyebrow">02 / COMFORT, CONSIDERED</p>
                <h2>
                  Feel good.
                  <br />
                  <em>Do great.</em>
                </h2>
                <p>
                  Thoughtful coverage.
                  <br />
                  Made for your every day.
                </p>
                <Link className="button dark" to="/product/comfort-considered">
                  Explore her fit <Icon name="arrowUpRight" />
                </Link>
              </div>
            </div>
            <div className="film-chapters" aria-hidden="true">
              <span className="chapter chapter-one">
                01 <i></i> EVERYDAY
              </span>
              <span className="chapter chapter-two">
                02 <i></i> FOR HIM
              </span>
              <span className="chapter chapter-three">
                03 <i></i> FOR HER
              </span>
            </div>
            <div className="film-progress" aria-hidden="true">
              <span></span>
            </div>
            <div className="hero-bottom">
              <span>01 / THE EVERYDAY COLLECTION</span>
              <a href="#collection">
                SCROLL TO EXPLORE <Icon name="arrowDown" />
              </a>
              <span>PESHAWAR · PAKISTAN</span>
            </div>
          </div>
        </section>
        <Marquee className="benefits">
          <span>
            <Icon name="layers" /> Single pieces & bulk orders
          </span>
          <i>+</i>
          <span>
            <Icon name="ruler" /> Your size. Your measurements.
          </span>
          <i>+</i>
          <span>
            <Icon name="palette" /> Colours that feel like you
          </span>
          <i>+</i>
          <span>
            <Icon name="users" /> For men & women
          </span>
          <i>+</i>
        </Marquee>
        <section className="collection section" id="collection">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / THE EVERYDAY COLLECTION</p>
              <h2>
                Good fit.
                <br />
                <em>Great feeling.</em>
              </h2>
            </div>
            <p>
              For your first day on campus and every shift after.
              <br />
              Pick a colour and quantity, or enter measurements for one piece.
            </p>
          </div>
          <div className="collection-grid">{featured.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
          <p className="page-note">
            Tops, pants, and every colour.             <Link to="/shop">
              See the full collection <Icon name="arrowUpRight" />
            </Link>
            {' '}&nbsp;·&nbsp;{' '}
            <Link to="/size-guide">
              Size guide <Icon name="ruler" />
            </Link>
          </p>
        </section>
        <section className="custom section" id="custom">
          <div className="custom-title">
            <p className="eyebrow">02 / PERSONALLY YOURS</p>
            <h2>
              Not just a size.
              <br />
              <em>Your fit.</em>
            </h2>
            <p>We cut for the hours you actually live in uniform — lectures, rounds, the walk between buildings, and the wash that follows.</p>
            <Link className="button dark" to="/about">
              Our story <Icon name="arrowUpRight" />
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
        <section className="bulk" id="bulk">
          <div className="bulk-top">
            <span className="eyebrow">03 / BETTER TOGETHER</span>
            <span>PESHAWAR, PK</span>
          </div>
          <div className="bulk-content">
            <h2>
              One identity.
              <br />
              <em>Every individual.</em>
            </h2>
            <div>
              <p>Uniforms for schools, colleges and the people who make them. A coordinated look, with a personal fit for everyone.</p>
              <div className="bulk-tags">
                <span>Schools & colleges</span>
                <span>Group scrub orders</span>
                <span>Custom measurements</span>
              </div>
            </div>
          </div>
          <div className="bulk-bottom">
            <p>
              Bring your team together.
              <br />
              <small>Bulk orders, tailored to your requirements.</small>
            </p>
            <Link className="button light" to="/contact">
              Plan your uniform order <Icon name="arrowUpRight" />
            </Link>
          </div>
        </section>
        <section className="order-details section" id="order-details">
          <p className="eyebrow">LET’S GET THE DETAILS RIGHT</p>
          <h2>
            Your next uniform
            <br />
            starts with <em>you.</em>
          </h2>
          <p>
            Have your preferred style, colours, measurements and quantity ready.
            <br />
            Single-piece and institutional orders welcome.
          </p>
          <div className="order-list">
            <span>
              <Icon name="shirt" /> Choose your style
            </span>
            <span>
              <Icon name="ruler" /> Share your measurements
            </span>
            <span>
              <Icon name="check" /> Confirm your quantity
            </span>
          </div>
          <Link className="button dark" to="/contact">
            Send on WhatsApp <Icon name="whatsapp" />
          </Link>
        </section>
      </main>
    </Layout>
  );
}
