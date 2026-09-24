import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Layout from '../components/Layout.jsx';
import { useStore } from '../context/StoreContext.jsx';

const rows = [
  ['XS', '32–34', '24–26', '34–36', '25', '29'],
  ['S', '34–36', '26–28', '36–38', '26', '29'],
  ['M', '38–40', '30–32', '40–42', '27', '30'],
  ['L', '42–44', '34–36', '44–46', '28', '30'],
  ['XL', '46–48', '38–40', '48–50', '29', '31'],
  ['XXL', '50–52', '42–44', '52–54', '30', '31']
];

export default function SizeGuide() {
  const { settings } = useStore();

  useEffect(() => {
    document.title = 'Size guide | ' + settings.brandName;
  }, [settings]);

  return (
    <Layout>
      <main>
        <section className="page-hero section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span className="line"></span> 04 / A FIT THAT’S YOURS
              </p>
              <h1>
                Your size.
                <br />
                <em>Your measurements.</em>
              </h1>
            </div>
            <p>
              Measurements are body measurements in inches.
              <br />
              If you sit between sizes, size up — uniforms should move, not bind.
            </p>
          </div>

          <div className="size-table-wrap">
            <table className="size-table">
              <caption className="visually-hidden">Scrub size chart in inches</caption>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest</th>
                  <th>Waist</th>
                  <th>Hip</th>
                  <th>Top length</th>
                  <th>Inseam</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={row[0] + i}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="measure-list">
            <li>
              <span>01</span>
              <div>
                <h3>Chest</h3>
                <p>Measure around the fullest part of the chest, tape level under the arms.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Waist</h3>
                <p>Measure at the natural waist, where the pant drawstring will sit.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Hip</h3>
                <p>Measure around the fullest part of the hip and seat.</p>
              </div>
            </li>
            <li>
              <span>04</span>
              <div>
                <h3>Unsure?</h3>
                <p>Choose Custom measurements on any product, add chest and waist for one piece, then continue to checkout.</p>
              </div>
            </li>
          </ul>

          <div className="page-actions">
            <Link className="button dark" to="/shop">
              Back to the collection <Icon name="arrowUpRight" />
            </Link>
            <Link className="button light" to="/shop">
              Order a custom-measured piece <Icon name="ruler" />
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
