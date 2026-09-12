import { config } from '../data/config.js';

export function formatPrice(n) {
  return 'PKR ' + Number(n).toLocaleString('en-PK');
}

export function whatsappUrl(text) {
  return (
    'https://wa.me/' +
    config.whatsappNumber +
    '?text=' +
    encodeURIComponent(text)
  );
}

export function telHref() {
  var n = String(config.whatsappNumber || '');
  return n.charAt(0) === '+' ? 'tel:' + n : 'tel:+' + n;
}
