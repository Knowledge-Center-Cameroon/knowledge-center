// Lightweight frontend service layer to scaffold future backend integration.
// Now points to backend HTTP endpoints; falls back to localStorage seed only if backend is unreachable.

export type TimelineEvent = {
  id: string;               // uuid
  title: string;
  description?: string;
  dateISO: string;          // ISO string
  tag?: string;             // e.g., "competition", "announcement"
  imageUrl?: string;
  linkUrl?: string;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  "https://forestial-afocal-rex.ngrok-free.dev";

// Newsletter subscription stub
export async function subscribeEmail(email: string): Promise<void> {
  try {
    const resp = await fetch(`${BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
      body: JSON.stringify({ email }),
    });
    if (!resp.ok) throw new Error('subscribe failed');
  } catch {
    // Soft fallback (dev only)
    const key = "kc_subscriptions";
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as string[];
    if (!existing.includes(email)) existing.push(email);
    localStorage.setItem(key, JSON.stringify(existing));
  }
}

// Timeline stubs
const TL_KEY = "kc_timeline";

export async function getTimeline(): Promise<TimelineEvent[]> {
  try {
    const resp = await fetch(`${BASE_URL}/api/timeline`, {
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    });
    if (!resp.ok) throw new Error('timeline failed');
    return await resp.json();
  } catch {
    // Seed local for dev fallback
    const raw = localStorage.getItem(TL_KEY);
    if (!raw) {
      const seed: TimelineEvent[] = [
        {
          id: crypto.randomUUID(),
          title: "STEM Competition Registration Opens",
          description: "Kick-off for the National STEM Competition.",
          dateISO: new Date().toISOString(),
          tag: "competition",
          linkUrl: "/projects/stem",
        },
        {
          id: crypto.randomUUID(),
          title: "Summer Education Program Announced",
          description: "2-month intensive learning program with masterclasses.",
          dateISO: new Date(Date.now() + 86400000 * 10).toISOString(),
          tag: "program",
          linkUrl: "/projects/summer-education",
        },
      ];
      localStorage.setItem(TL_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as TimelineEvent[];
  }
}

export async function addTimelineEvent(event: Omit<TimelineEvent, "id">): Promise<TimelineEvent> {
  try {
    const resp = await fetch(`${BASE_URL}/api/timeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
      body: JSON.stringify(event),
    });
    if (!resp.ok) throw new Error('add event failed');
    return await resp.json();
  } catch {
    // Fallback (dev only)
    const list = (JSON.parse(localStorage.getItem(TL_KEY) || "[]") as TimelineEvent[]);
    const e: TimelineEvent = { id: crypto.randomUUID(), ...event };
    list.push(e);
    localStorage.setItem(TL_KEY, JSON.stringify(list));
    return e;
  }
}

// STEM registration & payment stubs
export type StemRegistrationPayload = {
  fullName: string;
  email: string;
  phone: string;
  payerPhone: string;
  guardianPhone: string;
  dobISO: string;
  gender: "male" | "female" | "other";
  school: string;
  region: string;
  examLocation: string;
  subjects: string[];
  expectations: string;
  schoolClass: string;
  level: "olevel" | "alevel";
  paymentMethod: "mtn" | "orange";
};

export type PaymentInitResponse = {
  reference: string;
  paymentMethod: "mtn" | "orange";
  amount: number;
  status: "pending";
  checkoutUrl?: string; // if using hosted checkout later
};

export async function initiateStemPayment(
  payload: StemRegistrationPayload,
  amount: number = 5000 // default registration fee (XAF)
): Promise<PaymentInitResponse> {
  try {
    const resp = await fetch(`${BASE_URL}/api/stem/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
      body: JSON.stringify({ payload, amount }),
    });
    if (!resp.ok) throw new Error('initiate failed');
    const data = await resp.json();
    const reference = data.reference as string;
    // Persist to localStorage as a UX convenience for success page fallback
    const key = "kc_stem_regs";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.push({ ...payload, amount, reference, createdAt: new Date().toISOString(), paymentMethod: payload.paymentMethod });
    localStorage.setItem(key, JSON.stringify(list));
    return { reference, paymentMethod: (payload.paymentMethod as any), amount, status: "pending" };
  } catch {
    // Fallback (dev only)
    await delay(400);
    const reference = `STEM-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const key = "kc_stem_regs";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.push({ ...payload, amount, reference, createdAt: new Date().toISOString(), paymentMethod: payload.paymentMethod });
    localStorage.setItem(key, JSON.stringify(list));
    return { reference, paymentMethod: (payload.paymentMethod as any), amount, status: "pending" };
  }
}
