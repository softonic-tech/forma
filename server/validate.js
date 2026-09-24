const CATEGORIES = new Set(['set', 'top', 'pants']);
const ORDER_STATUSES = new Set(['new', 'confirmed', 'completed', 'cancelled']);
const INQUIRY_STATUSES = new Set(['new', 'read', 'replied']);
const HEX = /^#([0-9a-f]{6})$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function cleanText(value, max = 400) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function cleanMultiline(value, max = 4000) {
  return String(value || '').trim().slice(0, max);
}

export function asInt(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : fallback;
}

export function parseSizes(value) {
  if (Array.isArray(value)) return value.map((s) => cleanText(s, 12)).filter(Boolean);
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function productPayload(body) {
  const name = cleanText(body.name, 80);
  const slug = slugify(body.slug || name);
  const category = String(body.category || '');
  const price = asInt(body.price, -1);
  const sizes = parseSizes(body.sizes);
  const colorIds = Array.isArray(body.colorIds) ? body.colorIds.map(String) : [];
  const errors = [];
  if (!name) errors.push('Name is required');
  if (!SLUG.test(slug)) errors.push('Add a valid slug');
  if (!CATEGORIES.has(category)) errors.push('Category must be set, top, or pants');
  if (price < 0) errors.push('Price must be a number');
  if (!sizes.length) errors.push('Add at least one size');
  if (!colorIds.length) errors.push('Pick at least one colour');
  if (!cleanText(body.image, 300)) errors.push('Image is required');
  return {
    errors,
    data: {
      slug,
      name,
      category,
      category_label: cleanText(body.categoryLabel, 40) || category,
      tag: cleanText(body.tag, 40),
      summary: cleanText(body.summary, 160),
      blurb: cleanMultiline(body.blurb, 800),
      details: cleanMultiline(body.details, 2000),
      price,
      featured: body.featured ? 1 : 0,
      active: body.active === false || body.active === 0 ? 0 : 1,
      image: cleanText(body.image, 300),
      sizes: JSON.stringify(sizes),
      colorIds,
      sort_order: asInt(body.sortOrder, 0)
    }
  };
}

export function colorPayload(body) {
  const id = slugify(body.id || body.name);
  const name = cleanText(body.name, 40);
  const hex = String(body.hex || '').trim();
  const errors = [];
  if (!SLUG.test(id)) errors.push('Colour id is required');
  if (!name) errors.push('Colour name is required');
  if (!HEX.test(hex)) errors.push('Colour hex must look like #0a2348');
  return { errors, data: { id, name, hex, sort_order: asInt(body.sortOrder, 0) } };
}

export function orderPayload(body) {
  const customer_name = cleanText(body.customerName || body.name, 80);
  const customer_phone = cleanText(body.customerPhone || body.phone, 30);
  const qty = Math.max(1, asInt(body.qty, 1));
  const price = asInt(body.price, -1);
  const errors = [];
  if (!customer_name) errors.push('Name is required');
  if (customer_phone.length < 7) errors.push('Phone is required');
  if (!cleanText(body.productName || body.name, 80) && !cleanText(body.product_name, 80)) {
    if (!cleanText(body.itemName, 80) && !body.productName) errors.push('Product is required');
  }
  if (price < 0) errors.push('Price is required');
  return {
    errors,
    data: {
      customer_name,
      customer_phone,
      customer_city: cleanText(body.customerCity || body.city, 80),
      notes: cleanMultiline(body.notes, 1000),
      product_slug: slugify(body.productSlug || body.slug),
      product_name: cleanText(body.productName, 80),
      product_image: cleanText(body.productImage || body.image, 300),
      color_id: cleanText(body.colorId, 40),
      color_name: cleanText(body.colorName, 40),
      color_hex: cleanText(body.colorHex, 12),
      fit: cleanText(body.fit, 20) || 'standard',
      size: cleanText(body.size, 12),
      qty,
      price,
      total: qty * price,
      measurements: JSON.stringify(body.measurements || {})
    }
  };
}

export function inquiryPayload(body) {
  const name = cleanText(body.name, 80);
  const phone = cleanText(body.phone, 30);
  const message = cleanMultiline(body.message, 2000);
  const errors = [];
  if (!name) errors.push('Name is required');
  if (phone.length < 7) errors.push('Phone is required');
  if (!message) errors.push('Message is required');
  return {
    errors,
    data: {
      name,
      phone,
      college: cleanText(body.college, 120),
      message
    }
  };
}

export { ORDER_STATUSES, INQUIRY_STATUSES };
