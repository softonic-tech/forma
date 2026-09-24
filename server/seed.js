import { COLORS, CATALOG } from '../src/data/catalog.js';
import { config } from '../src/data/config.js';
import { hashPassword } from './auth.js';
import { nextId, now } from './db.js';
import { Admin, Color, Product, Settings } from './models.js';

const SETTING_KEYS = [
  'brandName',
  'brandScript',
  'tagline',
  'promise',
  'feel',
  'whatsappNumber',
  'whatsappDisplay',
  'whatsappName',
  'phoneNumber',
  'phoneDisplay',
  'phoneName',
  'city',
  'address'
];

let seeded = false;

export async function seed() {
  if (seeded) return;

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@glowfit.pk').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'GlowFit!Admin';
  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await Admin.create({
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
      createdAt: now()
    });
  }

  const settings = await Settings.findById('site').lean();
  const patch = {};
  for (const key of SETTING_KEYS) {
    if (!settings || settings[key] == null) patch[key] = config[key] ?? '';
  }
  if (Object.keys(patch).length) {
    await Settings.findByIdAndUpdate('site', { $set: patch }, { upsert: true });
  }

  if ((await Color.countDocuments()) === 0) {
    await Color.insertMany(
      COLORS.map((color, index) => ({
        id: color.id,
        name: color.name,
        hex: color.hex,
        sortOrder: index
      }))
    );
  }

  if ((await Product.countDocuments()) === 0) {
    for (const [index, product] of CATALOG.entries()) {
      await Product.create({
        id: await nextId('products'),
        slug: product.slug,
        name: product.name,
        category: product.category,
        categoryLabel: product.categoryLabel,
        tag: product.tag || '',
        summary: product.summary || '',
        blurb: product.blurb || '',
        details: product.details || '',
        price: product.price,
        featured: Boolean(product.featured),
        image: product.image,
        sizes: product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colorIds: (product.colors || COLORS).map((c) => c.id),
        sortOrder: index,
        active: true,
        createdAt: now(),
        updatedAt: now()
      });
    }
  }

  seeded = true;
}
