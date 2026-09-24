import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import { Color, Counter, Product, Settings } from './models.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const ROOT = root;

export function now() {
  return new Date().toISOString();
}

export async function nextId(name) {
  const doc = await Counter.findByIdAndUpdate(name, { $inc: { seq: 1 } }, { new: true, upsert: true });
  return doc.seq;
}

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Set MONGODB_URI to your MongoDB Atlas connection string');
  }
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  return mongoose.connection;
}

export async function getSettings() {
  const row = await Settings.findById('site').lean();
  if (!row) return {};
  const { _id, __v, ...rest } = row;
  return rest;
}

export async function setSettings(patch) {
  await Settings.findByIdAndUpdate('site', { $set: patch }, { upsert: true, new: true });
  return getSettings();
}

export function toProduct(row, { includeInactive = false } = {}) {
  if (!row) return null;
  if (!includeInactive && !row.active) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    categoryLabel: row.categoryLabel,
    tag: row.tag || '',
    summary: row.summary || '',
    blurb: row.blurb || '',
    details: row.details || '',
    price: row.price,
    featured: Boolean(row.featured),
    image: row.image,
    sizes: row.sizes || [],
    colors: row.colors || [],
    sortOrder: row.sortOrder,
    active: Boolean(row.active)
  };
}

async function withColors(product) {
  if (!product) return null;
  const colors = await Color.find({ id: { $in: product.colorIds || [] } })
    .sort({ sortOrder: 1, name: 1 })
    .lean();
  const byId = new Map(colors.map((c) => [c.id, { id: c.id, name: c.name, hex: c.hex }]));
  return toProduct(
    {
      ...product,
      colors: (product.colorIds || []).map((id) => byId.get(id)).filter(Boolean)
    },
    { includeInactive: true }
  );
}

export async function listProducts({ activeOnly = true } = {}) {
  const query = activeOnly ? { active: true } : {};
  const rows = await Product.find(query).sort({ featured: -1, sortOrder: 1, name: 1 }).lean();
  return Promise.all(rows.map((row) => withColors(row)));
}

export async function getProductBySlug(slug, { includeInactive = false } = {}) {
  const row = await Product.findOne(includeInactive ? { slug } : { slug, active: true }).lean();
  const product = await withColors(row);
  return includeInactive ? product : toProduct(product, { includeInactive: false });
}

export async function getProductById(id) {
  return withColors(await Product.findOne({ id: Number(id) }).lean());
}

export async function listColors() {
  const rows = await Color.find().sort({ sortOrder: 1, name: 1 }).lean();
  return rows.map((c) => ({ id: c.id, name: c.name, hex: c.hex, sortOrder: c.sortOrder }));
}
