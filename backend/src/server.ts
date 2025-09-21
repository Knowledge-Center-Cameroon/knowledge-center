import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import mongoose, { Schema, model } from 'mongoose';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8080);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const NKWA_BASE_URL = process.env.NKWA_BASE_URL || 'https://api.mynkwa.com';
const NKWA_API_KEY = process.env.NKWA_API_KEY || '';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// --- MongoDB Models ---
const SubscriberSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  created_at: { type: Date, default: Date.now },
});
const Subscriber = model('Subscriber', SubscriberSchema);

const RegistrationSchema = new Schema({
  reference: { type: String, required: true, unique: true, index: true },
  amount: { type: Number, required: true },
  payload: { type: Object, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
});
const Registration = model('Registration', RegistrationSchema);

const TimelineSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date_iso: { type: Date, required: true, index: true },
  tag: { type: String },
  imageUrl: { type: String },
  linkUrl: { type: String },
});
const TimelineItem = model('TimelineItem', TimelineSchema);

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));

// Newsletter
app.post('/api/newsletter', async (req: Request, res: Response) => {
  try {
    const { email } = req.body || {};
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    await Subscriber.updateOne(
      { email: String(email).toLowerCase() },
      { $setOnInsert: { email: String(email).toLowerCase(), created_at: new Date() } },
      { upsert: true }
    );
    return res.json({ ok: true });
  } catch (e) {
    console.error('newsletter error', e);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// STEM registration: initiate payment via Nkwa
app.post('/api/stem/register', async (req: Request, res: Response) => {
  try {
    const { payload, amount } = req.body || {};
    if (!payload || !amount) return res.status(400).json({ error: 'Missing payload or amount' });
    if (!NKWA_API_KEY) return res.status(500).json({ error: 'Missing Nkwa API key on server' });

    const reference = `STEM-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    await Registration.create({ reference, amount, payload, status: 'pending', created_at: new Date() });

    // NOTE: Confirm exact Nkwa endpoint and params in the API reference.
    // This is a placeholder request body matching typical C2B collection semantics.
    await axios.post(
      `${NKWA_BASE_URL}/nkwapay/collect`,
      {
        amount,
        payer: payload.payerPhone || payload.phone,
        operator: payload.paymentMethod, // 'mtn' | 'orange'
        reference,
        currency: 'XAF',
        description: 'KC STEM Registration',
      },
      { headers: { Authorization: `Bearer ${NKWA_API_KEY}` } }
    ).catch((err) => {
      // Log and continue returning our reference; actual debit will be confirmed via webhook
      console.error('Nkwa collect error:', err?.response?.data || err.message);
    });

    return res.json({ reference, status: 'pending' });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// Nkwa webhook (adjust middleware to use raw body if signature verification requires it)
app.post('/api/nkwa/webhook', express.json({ type: '*/*' }), async (req: Request, res: Response) => {
  try {
    const event = req.body as any; // { reference, status, ... }
    const { reference, status } = event || {};
    if (!reference) return res.status(400).end();
    await Registration.updateOne(
      { reference },
      { $set: { status, updated_at: new Date() } }
    );
    return res.json({ received: true });
  } catch (e) {
    console.error('Webhook error', e);
    return res.status(400).end();
  }
});

// Timeline feed
app.get('/api/timeline', async (_req: Request, res: Response) => {
  const items = await TimelineItem.find().sort({ date_iso: 1 }).lean();
  res.json(items);
});

app.post('/api/timeline', async (req: Request, res: Response) => {
  const { title, description, dateISO, tag, imageUrl, linkUrl } = req.body || {};
  if (!title || !dateISO) return res.status(400).json({ error: 'title and dateISO are required' });
  const item = await TimelineItem.create({
    title,
    description,
    date_iso: new Date(dateISO),
    tag,
    imageUrl,
    linkUrl,
  });
  return res.json(item);
});

async function start() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn('Warning: MONGODB_URI not set. Connect before production use.');
    } else {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB');
    }
    app.listen(PORT, () => {
      console.log(`KC backend listening on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error('Failed to start server', e);
    process.exit(1);
  }
}

start();
