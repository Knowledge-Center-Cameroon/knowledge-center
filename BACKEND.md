# Knowledge Center Backend Integration Guide

This guide explains how to stand up a minimal backend for:

- Newsletter subscriptions
- STEM Registration collection initiation via Nkwa Pay
- Payment status webhooks (to confirm/fail payments)
- Retrieving timeline items for Events/Blog sidebars

It uses Node.js + Express for concreteness, but you can port the same ideas to NestJS, Django, Laravel, etc.

## Overview

- The frontend (this repo) will call your backend’s REST endpoints.
- The backend will talk to Nkwa Pay to initiate a collection (C2B) and receive webhook updates for status changes.
- You’ll save records to a database (Postgres, MySQL, MongoDB, or even a simple JSON DB initially) so you can reconcile registrations and payments later.

## Prerequisites

- Node.js 18+
- An HTTPS-capable environment for receiving webhooks (use a tunnel like `ngrok` during development)
- Nkwa Pay account and API keys
  - Dashboard: https://mynkwa.com
  - Docs: https://docs.mynkwa.com/nkwapay/introduction
  - API Reference: https://docs.mynkwa.com/api-reference/introduction

## Environment Variables

Create a `.env` file in your backend project:

```
PORT=8080
# Nkwa Pay API
NKWA_BASE_URL=https://api.mynkwa.com
NKWA_API_KEY=sk_test_xxx_or_live
NKWA_WEBHOOK_SECRET=whsec_xxx

# CORS for local dev
CORS_ORIGIN=http://localhost:5173
```

> In production, set `CORS_ORIGIN` to your domain.

## Data Model (minimal)

- `newsletter_subscribers` (email, created_at)
- `stem_registrations` (id, payload_json, amount, payment_method, reference, status [pending|success|failed], created_at)
- `timeline_items` (id, title, date_iso, tag, description, link_url)

Use any DB (SQLite for quick start). For initial testing you can keep data in memory or JSON files.

## API Endpoints

1) POST `/api/newsletter`
- Body: `{ email: string }`
- Action: validate email, save to DB
- Response: `{ ok: true }`

2) POST `/api/stem/register`
- Body: `StemRegistrationPayload` from the frontend plus `amount: number`
- Action: create a registration row with `status=pending` and call Nkwa Collect API to initiate payment
- Response: `{ reference: string, status: 'pending' }`

3) POST `/api/nkwa/webhook`
- Raw body required for signature verification
- Validate signature using `NKWA_WEBHOOK_SECRET`
- Update registration status by reference to `success` or `failed`
- Respond `200` quickly

4) GET `/api/timeline`
- Returns timeline items sorted by `date_iso`

## Express Server (example)

Install packages:

```
npm i express cors axios dotenv
npm i -D @types/express @types/node
```

Create `server.js` (or `server.ts` if using TypeScript):

```js
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// In-memory stores for demo; replace with DB
const subscribers = new Set();
const registrations = new Map(); // key: reference -> record
const timeline = [];

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  subscribers.add(email.toLowerCase());
  return res.json({ ok: true });
});

app.post('/api/stem/register', async (req, res) => {
  try {
    const { payload, amount } = req.body || {};
    if (!payload || !amount) return res.status(400).json({ error: 'Missing payload or amount' });

    // Create local reference before calling Nkwa
    const reference = `STEM-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    // Persist locally as pending
    registrations.set(reference, { reference, amount, payload, status: 'pending', created_at: new Date().toISOString() });

    // Call Nkwa Collect API (pseudo; confirm exact fields in API Reference)
    const resp = await axios.post(
      `${process.env.NKWA_BASE_URL}/nkwapay/collect`,
      {
        amount,
        payer: payload.payerPhone || payload.phone,
        operator: payload.paymentMethod, // 'mtn' | 'orange'
        reference,
        currency: 'XAF',
        description: 'KC STEM Registration',
        // callback or return url may be configured on dashboard/webhook
      },
      {
        headers: { Authorization: `Bearer ${process.env.NKWA_API_KEY}` }
      }
    );

    // Return our reference immediately
    return res.json({ reference, status: 'pending' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// Webhook: use raw body for signature if required by Nkwa
app.post('/api/nkwa/webhook', express.json({ type: '*/*' }), (req, res) => {
  try {
    // Verify signature if Nkwa provides one (consult API docs)
    // const sig = req.headers['x-nkwa-signature'];
    // const expected = crypto.createHmac('sha256', process.env.NKWA_WEBHOOK_SECRET).update(rawBody).digest('hex');

    const event = req.body; // { reference, status: 'success' | 'failed', ... }
    const { reference, status } = event || {};
    if (!reference) return res.status(400).end();
    const rec = registrations.get(reference);
    if (rec) {
      rec.status = status;
      registrations.set(reference, rec);
    }
    return res.json({ received: true });
  } catch (e) {
    console.error(e);
    return res.status(400).end();
  }
});

app.get('/api/timeline', (req, res) => {
  const sorted = [...timeline].sort((a, b) => new Date(a.date_iso) - new Date(b.date_iso));
  res.json(sorted);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API running on :${port}`));
```

> Important: For webhooks, you often need the raw body to verify signatures. If Nkwa requires that, adapt the middleware accordingly (e.g., `app.use('/api/nkwa/webhook', raw({ type: '*/*' }))`). Check the latest Nkwa webhook docs and sample code in their SDKs.

## Frontend Integration Points

- Newsletter: `subscribeEmail()` in `src/services/api.ts` should POST to `/api/newsletter`.
- STEM Registration: replace `initiateStemPayment()` in `src/services/api.ts` to call your `/api/stem/register` endpoint and return `{ reference }`.
- Webhooks: no direct frontend call; the backend will receive webhook updates.
- Timeline: `getTimeline()` can be replaced to `fetch('/api/timeline')`.

## Testing with Nkwa

- MTN test numbers: https://momodeveloper.mtn.com/api-documentation/testing
- Orange test flow: requires a real number but uses a special test PIN (e.g., `4444`).
- Use the Nkwa dashboard to monitor incoming collections and webhook deliveries.

## Going to Production

- Deploy backend (Render, Railway, Fly.io, AWS, etc.)
- Use HTTPS and set proper CORS
- Store secrets securely
- Rotate API keys periodically
- Monitor webhook retries and maintain idempotency (update registration by reference only once per terminal state)

## Checklist

- [ ] ENV set up with Nkwa credentials
- [ ] Endpoint `/api/stem/register` working and returns reference
- [ ] Webhook endpoint receiving and updating status
- [ ] Frontend points to your backend endpoints
- [ ] Timeline feed served from backend
- [ ] TLS + CORS configured
