import { config } from '../data/config.js';

export function formatPrice(n) {
  return 'PKR ' + Number(n).toLocaleString('en-PK');
}

export function whatsappUrl(text, settings = config) {
  return (
    'https://wa.me/' +
    (settings.whatsappNumber || config.whatsappNumber) +
    '?text=' +
    encodeURIComponent(text)
  );
}

export function telHref(number, settings = config) {
  var n = String(number || settings.phoneNumber || settings.whatsappNumber || '');
  return n.charAt(0) === '+' ? 'tel:' + n : 'tel:+' + n;
}
