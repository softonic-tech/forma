import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String },
  seq: { type: Number, default: 0 }
});

const adminSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: String, required: true }
});

const settingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'site' }
  },
  { strict: false }
);

const colorSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  hex: { type: String, required: true },
  sortOrder: { type: Number, default: 0 }
});

const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  slug: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  categoryLabel: { type: String, required: true },
  tag: { type: String, default: '' },
  summary: { type: String, default: '' },
  blurb: { type: String, default: '' },
  details: { type: String, default: '' },
  price: { type: Number, required: true },
  featured: { type: Boolean, default: false },
  image: { type: String, required: true },
  sizes: { type: [String], default: [] },
  colorIds: { type: [String], default: [] },
  sortOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  status: { type: String, default: 'new' },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerCity: { type: String, default: '' },
  notes: { type: String, default: '' },
  productSlug: { type: String, default: '' },
  productName: { type: String, default: '' },
  productImage: { type: String, default: '' },
  colorId: { type: String, default: '' },
  colorName: { type: String, default: '' },
  colorHex: { type: String, default: '' },
  fit: { type: String, default: 'standard' },
  size: { type: String, default: '' },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  measurements: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
});

const inquirySchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, default: 'new' },
  createdAt: { type: String, required: true }
});

const mediaSchema = new mongoose.Schema({
  filename: { type: String, unique: true, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true }
});

export const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);
export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
export const Color = mongoose.models.Color || mongoose.model('Color', colorSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
export const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);
