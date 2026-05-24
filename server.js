import 'dotenv/config';

import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import Razorpay from 'razorpay';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-development-secret';

const clientOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const localOrigins = ['http://localhost:5173', 'http://localhost:3000'];
const productionOrigins = ['https://*.vercel.app', ...clientOrigins];
const configuredOrigins = isProduction ? productionOrigins : [...clientOrigins, ...localOrigins];
const allowedOrigins = new Set(configuredOrigins.filter((origin) => !origin.includes('*')));
const escapeRegex = (value) => value.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
const wildcardOrigins = configuredOrigins
  .filter((origin) => origin.includes('*'))
  .map((origin) => new RegExp(`^${origin.split('*').map(escapeRegex).join('.*')}$`));

const isAllowedOrigin = (origin) =>
  allowedOrigins.has(origin) || wildcardOrigins.some((pattern) => pattern.test(origin));

const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    material: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    price: { type: Number, required: true, min: 1 },
    currency: { type: String, default: 'INR' },
    dimensions: { type: String, default: '' },
    image: { type: String, required: true, trim: true },
    badge: { type: String, default: '' },
    badgeColor: { type: String, enum: ['gold', 'stone', 'red'], default: 'gold' },
    description: { type: String, default: '' },
    stock: { type: Number, default: 1, min: 0 },
    isFeatured: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    enquiry: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true },
);

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: 'Admin' },
  },
  { timestamps: true },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: '' },
    address: {
      line1: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
  },
  { timestamps: true },
);

const orderSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['created', 'pending_verification', 'paid', 'processing', 'dispatched', 'delivered', 'cancelled', 'failed'],
      default: 'created',
    },
    upiTransactionId: { type: String, default: '' },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', productSchema);
const Enquiry = mongoose.model('Enquiry', enquirySchema);
const AdminUser = mongoose.model('AdminUser', adminUserSchema);
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

const seedProducts = [
  {
    name: 'Ganesha in Black Basalt',
    slug: 'ganesha-in-black-basalt',
    material: 'Black Basalt Stone',
    price: 48000,
    badge: 'Rare',
    badgeColor: 'red',
    category: 'stone',
    image: 'https://images.unsplash.com/photo-1608099269227-82de5da1e4a8?w=600&q=80&fit=crop',
    dimensions: '18" x 12" x 8"',
    stock: 1,
  },
  {
    name: 'Dancing Shiva Nataraja',
    slug: 'dancing-shiva-nataraja',
    material: 'Panchaloha Brass',
    price: 72000,
    badge: 'Bestseller',
    badgeColor: 'gold',
    category: 'brass',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80&fit=crop',
    dimensions: '24" x 14" x 6"',
    stock: 1,
  },
  {
    name: 'Vitthal of Pandharpur',
    slug: 'vitthal-of-pandharpur',
    material: 'Nashik Terracotta',
    price: 28500,
    badge: 'New',
    badgeColor: 'gold',
    category: 'terracotta',
    image: 'https://images.unsplash.com/photo-1583425423885-d9c2cd0b1077?w=600&q=80&fit=crop',
    dimensions: '16" x 9" x 7"',
    stock: 2,
  },
];

const getDbStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const requireAdmin = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Admin login required.' });
    return;
  }

  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired admin session.' });
  }
});

const requireUser = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Login required.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'user') {
      res.status(403).json({ error: 'Access denied.' });
      return;
    }
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session.' });
  }
});

const optionalUser = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role === 'user') req.user = decoded;
    } catch {
      // ignore
    }
  }
  next();
};

const requireFields = (body, fields) => {
  const missing = fields.filter((field) => !String(body[field] ?? '').trim());
  if (missing.length > 0) {
    const error = new Error(`Missing required fields: ${missing.join(', ')}`);
    error.status = 400;
    throw error;
  }
};

const bootstrapData = async () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD is not set. Admin login is disabled.');
  } else {
    const email = process.env.ADMIN_EMAIL.toLowerCase();
    const existingAdmin = await AdminUser.findOne({ email });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await AdminUser.create({
        email,
        passwordHash,
        name: process.env.ADMIN_NAME || 'VinayakArt Admin',
      });
      console.log('Admin user created.');
    }
  }

  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany(seedProducts);
    console.log('Seed products created.');
  }
};

const connectToMongo = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not set. Skipping MongoDB connection.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Atlas connected.');
    await bootstrapData();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    if (isProduction) {
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected.');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: NODE_ENV,
    uptime: process.uptime(),
    database: getDbStatus(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/config', (req, res) => {
  res.json({
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  });
});

app.get(
  '/api/products',
  asyncHandler(async (req, res) => {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ products });
  }),
);

app.get('/api', (req, res) => {
  res.json({ message: 'Vinayakart API is running.' });
});

app.post(
  '/api/enquiries',
  asyncHandler(async (req, res) => {
    requireFields(req.body, ['name', 'email', 'message']);

    const enquiry = await Enquiry.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      enquiry: req.body.enquiry,
      message: req.body.message,
    });

    res.status(201).json({
      message: 'Enquiry received.',
      enquiryId: enquiry._id,
    });
  }),
);

app.post(
  '/api/payments/create-order',
  optionalUser,
  asyncHandler(async (req, res) => {
    if (!razorpay) {
      res.status(503).json({ error: 'Payment gateway is not configured.' });
      return;
    }

    requireFields(req.body, ['productId', 'name', 'email']);

    const product = await Product.findOne({ _id: req.body.productId, isActive: true });
    if (!product || product.stock <= 0) {
      res.status(404).json({ error: 'Product is unavailable.' });
      return;
    }

    const amountPaise = product.price * 100;
    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: product.currency,
      receipt: `order_${Date.now()}`,
      notes: {
        productId: String(product._id),
        productName: product.name,
      },
    });

    const order = await Order.create({
      product: product._id,
      user: req.user?.id || null,
      customer: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone || '',
      },
      amount: product.price,
      currency: product.currency,
      razorpayOrderId: razorpayOrder.id,
    });

    res.status(201).json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountPaise,
      currency: product.currency,
      product: {
        name: product.name,
        description: product.material,
      },
    });
  }),
);

app.post(
  '/api/payments/verify',
  asyncHandler(async (req, res) => {
    requireFields(req.body, [
      'orderId',
      'razorpay_order_id',
      'razorpay_payment_id',
      'razorpay_signature',
    ]);

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${req.body.razorpay_order_id}|${req.body.razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== req.body.razorpay_signature) {
      res.status(400).json({ error: 'Payment verification failed.' });
      return;
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.body.orderId, razorpayOrderId: req.body.razorpay_order_id },
      {
        status: 'paid',
        razorpayPaymentId: req.body.razorpay_payment_id,
        razorpaySignature: req.body.razorpay_signature,
      },
      { new: true },
    );

    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    await Product.findByIdAndUpdate(order.product, { $inc: { stock: -1 } });
    res.json({ message: 'Payment verified.', orderId: order._id });
  }),
);

app.post(
  '/api/orders',
  optionalUser,
  asyncHandler(async (req, res) => {
    requireFields(req.body, ['productId', 'name', 'email', 'upiTransactionId']);

    const utrRaw = String(req.body.upiTransactionId).trim();
    if (utrRaw.length < 6) {
      res.status(400).json({ error: 'Please enter a valid UPI transaction ID.' });
      return;
    }

    const duplicate = await Order.findOne({ upiTransactionId: utrRaw });
    if (duplicate) {
      res.status(409).json({ error: 'This transaction ID has already been submitted.' });
      return;
    }

    const product = await Product.findOne({ _id: req.body.productId, isActive: true });
    if (!product || product.stock <= 0) {
      res.status(404).json({ error: 'Product is unavailable.' });
      return;
    }

    const order = await Order.create({
      product: product._id,
      user: req.user?.id || null,
      customer: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone || '',
      },
      amount: product.price,
      currency: product.currency || 'INR',
      status: 'pending_verification',
      upiTransactionId: utrRaw,
    });

    res.status(201).json({
      orderId: order._id,
      status: order.status,
      amount: order.amount,
    });
  }),
);

app.post(
  '/api/auth/register',
  asyncHandler(async (req, res) => {
    requireFields(req.body, ['name', 'email', 'password']);

    const email = req.body.email.toLowerCase().trim();

    if (String(req.body.password).length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters.' });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({
      name: req.body.name.trim(),
      email,
      passwordHash,
      phone: req.body.phone || '',
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: 'user' },
      JWT_SECRET,
      { expiresIn: '30d' },
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  }),
);

app.post(
  '/api/auth/login',
  asyncHandler(async (req, res) => {
    requireFields(req.body, ['email', 'password']);

    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    const isValid = user && (await bcrypt.compare(req.body.password, user.passwordHash));

    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: 'user' },
      JWT_SECRET,
      { expiresIn: '30d' },
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  }),
);

app.get(
  '/api/auth/me',
  requireUser,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    res.json({ user });
  }),
);

app.put(
  '/api/auth/me',
  requireUser,
  asyncHandler(async (req, res) => {
    const updates = {};
    if (req.body.name) updates.name = String(req.body.name).trim();
    if (req.body.phone !== undefined) updates.phone = String(req.body.phone);
    if (req.body.address && typeof req.body.address === 'object') {
      updates.address = {
        line1: String(req.body.address.line1 || ''),
        city: String(req.body.address.city || ''),
        state: String(req.body.address.state || ''),
        pincode: String(req.body.address.pincode || ''),
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-passwordHash');

    res.json({ user });
  }),
);

app.put(
  '/api/auth/me/password',
  requireUser,
  asyncHandler(async (req, res) => {
    requireFields(req.body, ['currentPassword', 'newPassword']);

    const user = await User.findById(req.user.id);
    const isValid = user && (await bcrypt.compare(req.body.currentPassword, user.passwordHash));

    if (!isValid) {
      res.status(401).json({ error: 'Current password is incorrect.' });
      return;
    }

    if (String(req.body.newPassword).length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters.' });
      return;
    }

    const passwordHash = await bcrypt.hash(req.body.newPassword, 12);
    await User.findByIdAndUpdate(req.user.id, { passwordHash });

    res.json({ message: 'Password updated.' });
  }),
);

app.get(
  '/api/orders/my',
  requireUser,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user.id })
      .populate('product', 'name image material price')
      .sort({ createdAt: -1 });
    res.json({ orders });
  }),
);

app.post(
  '/api/admin/login',
  asyncHandler(async (req, res) => {
    requireFields(req.body, ['email', 'password']);

    const admin = await AdminUser.findOne({ email: req.body.email.toLowerCase() });
    const isValid = admin && (await bcrypt.compare(req.body.password, admin.passwordHash));

    if (!isValid) {
      res.status(401).json({ error: 'Invalid admin credentials.' });
      return;
    }

    const token = jwt.sign({ id: admin._id, email: admin.email, name: admin.name }, JWT_SECRET, {
      expiresIn: '12h',
    });

    res.json({
      token,
      admin: {
        email: admin.email,
        name: admin.name,
      },
    });
  }),
);

app.get(
  '/api/admin/summary',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const [products, enquiries, newEnquiries, paidOrders] = await Promise.all([
      Product.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      Order.countDocuments({ status: 'paid' }),
    ]);

    res.json({ products, enquiries, newEnquiries, paidOrders });
  }),
);

app.get(
  '/api/admin/products',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  }),
);

app.post(
  '/api/admin/products',
  requireAdmin,
  asyncHandler(async (req, res) => {
    requireFields(req.body, ['name', 'material', 'category', 'price', 'image']);

    const product = await Product.create({
      ...req.body,
      slug: req.body.slug ? slugify(req.body.slug) : slugify(req.body.name),
      price: Number(req.body.price),
      stock: Number(req.body.stock ?? 1),
    });

    res.status(201).json({ product });
  }),
);

app.put(
  '/api/admin/products/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const update = {
      ...req.body,
      slug: req.body.slug ? slugify(req.body.slug) : undefined,
      price: req.body.price === undefined ? undefined : Number(req.body.price),
      stock: req.body.stock === undefined ? undefined : Number(req.body.stock),
    };

    Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    res.json({ product });
  }),
);

app.delete(
  '/api/admin/products/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    res.json({ product });
  }),
);

app.get(
  '/api/admin/enquiries',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ enquiries });
  }),
);

app.put(
  '/api/admin/enquiries/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    );

    if (!enquiry) {
      res.status(404).json({ error: 'Enquiry not found.' });
      return;
    }

    res.json({ enquiry });
  }),
);

app.get(
  '/api/admin/orders',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find().populate('product').populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ orders });
  }),
);

app.put(
  '/api/admin/orders/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const allowed = ['created', 'pending_verification', 'paid', 'processing', 'dispatched', 'delivered', 'cancelled', 'failed'];
    const { status } = req.body;

    if (!status || !allowed.includes(status)) {
      res.status(400).json({ error: 'Invalid status value.' });
      return;
    }

    const previous = await Order.findById(req.params.id);
    if (!previous) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    ).populate('product').populate('user', 'name email');

    // Decrement stock only when transitioning into 'paid' for the first time
    if (status === 'paid' && previous.status !== 'paid' && order.product) {
      await Product.findByIdAndUpdate(order.product._id, { $inc: { stock: -1 } });
    }

    res.json({ order });
  }),
);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.status || err.statusCode || 500;
  const message = isProduction && statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({
    error: message,
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

connectToMongo();

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing server.`);
  server.close(async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
