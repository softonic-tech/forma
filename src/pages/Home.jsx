import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Layout from '../components/Layout.jsx';
import Marquee from '../components/Marquee.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useStore } from '../context/StoreContext.jsx';

export default function Home() {
  const { products, colors, settings } = useStore();
  const featured = products.filter((p) => p.featured).slice(0, 2);

  useEffect(() => {
    document.title = settings.brandName + ' | ' + settings.tagline;
  }, [settings]);

  return (
    <Layout isHome>
      <main>
        <section className="hero-scroll" aria-labelledby="hero-title">
          <div className="hero">
            <div className="opening-scene">
              <div className="hero-models">
                <img className="hero-model hero-model-man" src="/assets/men-transparent.png" alt="Male model wearing navy Glow Fit scrubs" />
                <img className="hero-model hero-model-woman" src="/assets/women-transparent.png" alt="Female model wearing teal Glow Fit scrubs" />
              </div>
              <div className="hero-shade"></div>
              <div className="hero-copy">
                <p className="eyebrow">
                  <span className="line"></span> COMFORT THAT MOVES WITH YOU
                </p>
                <h1 id="hero-title">
                  Premium
                  <br />
                  quality. <em>Perfect</em>
                  <br />
                  fit.
                </h1>
                <p className="hero-description">Breathable, stretchable scrubs with a stylish look and a professional feel. Made for your every shift.</p>
                <Link className="button dark" to="/shop">
                  Find your fit <Icon name="arrowUpRight" />
                </Link>
                <div className="hero-note">STYLISH LOOK. PROFESSIONAL FEEL.</div>
              </div>
            </div>
            <div className="film-scene scene-men">
              <span className="scene-word" aria-hidden="true">
                move.
              </span>
              <img src="/assets/men-transparent.png" alt="Navy Glow Fit scrub set moving into view" />
              <div className="scene-copy">
                <p className="eyebrow">01 / STRETCHABLE & FLEXIBLE</p>
                <h2>
                  Move with
                  <br />
                  <em>comfort.</em>
                </h2>
                <p>
                  Soft, lightweight cloth
                  <br />
                  that keeps up with you.
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
              <img src="/assets/women-transparent.png" alt="Teal Glow Fit scrub set moving into view" />
              <div className="scene-copy">
                <p className="eyebrow">02 / STYLISH LOOK</p>
                <h2>
                  Professional
                  <br />
                  <em>feel.</em>
                </h2>
                <p>
                  Modern design.
                  <br />
                  Made to last, made for you.
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
              <span>01 / PREMIUM QUALITY SCRUBS</span>
              <a href="#collection">
                SCROLL TO EXPLORE <Icon name="arrowDown" />
              </a>
              <span>PESHAWAR · PAKISTAN</span>
            </div>
          </div>
        </section>
        <Marquee className="benefits">
          <span>
            <Icon name="breath" /> Breathable fabric
          </span>
          <i>+</i>
          <span>
            <Icon name="stretch" /> Stretchable & flexible
          </span>
          <i>+</i>
          <span>
            <Icon name="feather" /> Soft & lightweight
          </span>
          <i>+</i>
          <span>
            <Icon name="wash" /> Easy to wash & durable
          </span>
          <i>+</i>
          <span>
            <Icon name="users" /> Unisex fit
          </span>
          <i>+</i>
          <span>
            <Icon name="pocket" /> Multiple pockets
          </span>
          <i>+</i>
        </Marquee>
        <section className="collection section" id="collection">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / THE EVERYDAY COLLECTION</p>
              <h2>
                Perfect fit.
                <br />
                <em>Everyday comfort.</em>
              </h2>
            </div>
            <p>
              Premium quality scrubs for your first day on campus and every shift after.
              <br />
              Pick a colour and quantity, or enter measurements for one piece.
            </p>
          </div>
          <div className="collection-grid">{featured.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
          <p className="page-note">
            Tops, pants, and every colour.{' '}
            <Link to="/shop">
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
            <p className="eyebrow">02 / MADE TO LAST, MADE FOR YOU</p>
            <h2>
              Not just a size.
              <br />
              <em>Your fit.</em>
            </h2>
            <p>Glow Fit scrubs are cut for the hours you actually live in uniform — lectures, rounds, the walk between buildings, and the wash that follows.</p>
            <Link className="button dark" to="/about">
              Our story <Icon name="arrowUpRight" />
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
        <section className="bulk" id="bulk">
          <div className="bulk-top">
            <span className="eyebrow">03 / PREMIUM QUALITY SCRUBS</span>
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
            Message {settings.whatsappName} on WhatsApp, or visit us in {settings.city}.
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
