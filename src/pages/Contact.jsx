import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import Layout from '../components/Layout.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { api } from '../lib/api.js';
import { telHref, whatsappUrl } from '../lib/format.js';

export default function Contact() {
  const { settings } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', college: '', message: '' });
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    document.title = 'Get in touch | ' + settings.brandName;
  }, [settings]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    setSaving(true);
    const lines = [
      'Hello, inquiry from the ' + settings.brandName + ' website:',
      'Name: ' + form.name.trim(),
      'Phone: ' + form.phone.trim()
    ];
    if (form.college.trim()) lines.push('College: ' + form.college.trim());
    if (form.message.trim()) lines.push('', form.message.trim());
    try {
      await api('/api/inquiries', { method: 'POST', body: form });
      window.location.href = whatsappUrl(lines.join('\n'), settings);
    } catch (err) {
      setSubmitError(err.message || 'Could not send this inquiry. Try again.');
      setSaving(false);
    }
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
            WhatsApp {settings.whatsappName}, call {settings.phoneName}, or visit us in {settings.city}.
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
                <span className="line"></span> 03 / GET IN TOUCH
              </p>
              <h2>
                One identity.
                <br />
                <em>Every individual.</em>
              </h2>
              <p className="contact-lede">WhatsApp is the fastest way to reach us. Use the form and we will open a pre-filled message for {settings.whatsappName}.</p>
              <ul className="contact-list">
                <li>
                  <span aria-label="WhatsApp">
                    <Icon name="whatsapp" size={22} />
                  </span>
                  <a href={whatsappUrl('Hello, I would like to order scrubs from ' + settings.brandName + '.', settings)}>
                    {settings.whatsappName} · {settings.whatsappDisplay} <Icon name="arrowUpRight" />
                  </a>
                </li>
                <li>
                  <span aria-label="Phone">
                    <Icon name="phone" size={22} />
                  </span>
                  <a href={telHref(settings.phoneNumber, settings)}>
                    {settings.phoneName} · {settings.phoneDisplay}
                  </a>
                </li>
                <li>
                  <span aria-label="Visit us">
                    <Icon name="pin" size={22} />
                  </span>
                  <strong>{settings.address}</strong>
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
              {submitError ? <p className="form-error">{submitError}</p> : null}
              <button type="submit" className="button dark" disabled={saving}>
                {saving ? 'Sending…' : 'Send on WhatsApp'} <Icon name="whatsapp" />
              </button>
            </form>
          </div>
        </section>
      </main>
    </Layout>
  );
}
