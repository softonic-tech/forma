import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import Layout from '../components/Layout.jsx';
import { config } from '../data/config.js';
import { telHref, whatsappUrl } from '../lib/format.js';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', college: '', message: '' });

  useEffect(() => {
    document.title = 'For institutions | FORMA';
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    const lines = [
      'Hello, inquiry from the ' + config.brandName + ' website:',
      'Name: ' + form.name.trim(),
      'Phone: ' + form.phone.trim()
    ];
    if (form.college.trim()) lines.push('College: ' + form.college.trim());
    if (form.message.trim()) lines.push('', form.message.trim());
    window.location.href = whatsappUrl(lines.join('\n'));
  }

  return (
    <Layout>
      <main>
        <section className="order-details section page-hero">
          <p className="eyebrow">LET’S GET THE DETAILS RIGHT</p>
          <h1>
            Your next uniform
            <br />
            starts with <em>you.</em>
          </h1>
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
        </section>

        <section className="section contact-section">
          <div className="contact-grid">
            <div>
              <p className="eyebrow">
                <span className="line"></span> 03 / BETTER TOGETHER
              </p>
              <h2>
                One identity.
                <br />
                <em>Every individual.</em>
              </h2>
              <p className="contact-lede">WhatsApp is the fastest way to reach us. Use the form and we will open a pre-filled message for you.</p>
              <ul className="contact-list">
                <li>
                  <span aria-label="WhatsApp">
                    <Icon name="whatsapp" size={22} />
                  </span>
                  <a href={whatsappUrl('Hello, I would like to order uniforms from ' + config.brandName + '.')}>
                    Message us <Icon name="arrowUpRight" />
                  </a>
                </li>
                <li>
                  <span aria-label="Phone">
                    <Icon name="phone" size={22} />
                  </span>
                  <a href={telHref()}>{config.phoneDisplay}</a>
                </li>
                <li>
                  <span aria-label="Email">
                    <Icon name="mail" size={22} />
                  </span>
                  <a href={'mailto:' + config.email}>{config.email}</a>
                </li>
                <li>
                  <span aria-label="Based in">
                    <Icon name="pin" size={22} />
                  </span>
                  <strong>{config.city}</strong>
                </li>
              </ul>
            </div>

            <form className="form-card" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" autoComplete="name" required value={form.name} onChange={onChange} />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" required value={form.phone} onChange={onChange} />
              </div>
              <div className="field">
                <label htmlFor="college">
                  School or college <em>(optional)</em>
                </label>
                <input id="college" name="college" type="text" value={form.college} onChange={onChange} />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Style, colours, measurements, and quantity."
                  value={form.message}
                  onChange={onChange}
                />
              </div>
              <button type="submit" className="button dark">
                Send on WhatsApp <Icon name="whatsapp" />
              </button>
            </form>
          </div>
        </section>
      </main>
    </Layout>
  );
}
