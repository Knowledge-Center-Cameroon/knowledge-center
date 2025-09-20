// Lightweight frontend service layer to scaffold future backend integration.
// Replace localStorage implementations with real HTTP calls when backend is ready.

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

// Newsletter subscription stub
export async function subscribeEmail(email: string): Promise<void> {
  await delay(450);
  const key = "kc_subscriptions";
  const existing = JSON.parse(localStorage.getItem(key) || "[]") as string[];
  if (!existing.includes(email)) existing.push(email);
  localStorage.setItem(key, JSON.stringify(existing));
}

// Timeline stubs
const TL_KEY = "kc_timeline";

export async function getTimeline(): Promise<TimelineEvent[]> {
  await delay(250);
  const raw = localStorage.getItem(TL_KEY);
  if (!raw) {
    // Seed with a couple of demo items for development preview
    const seed: TimelineEvent[] = [
      {
        id: crypto.randomUUID(),
        title: "STEM Competition Registration Opens",
        description: "Kick-off for the National STEM Competition.",
        dateISO: new Date().toISOString(),
        tag: "competition",
        linkUrl: "/projects/stem-education",
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

export async function addTimelineEvent(event: Omit<TimelineEvent, "id">): Promise<TimelineEvent> {
  await delay(200);
  const list = (JSON.parse(localStorage.getItem(TL_KEY) || "[]") as TimelineEvent[]);
  const e: TimelineEvent = { id: crypto.randomUUID(), ...event };
  list.push(e);
  localStorage.setItem(TL_KEY, JSON.stringify(list));
  return e;
}

// STEM registration & payment stubs
export type StemRegistrationPayload = {
  fullName: string;
  phone: string;
  guardianPhone: string;
  dobISO: string;
  gender: "male" | "female" | "other";
  school: string;
  schoolClass: string;
  motivation: string;
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
  // Simulate a backend call to initialize payment
  await delay(600);
  const ref = `STEM-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  // Persist to localStorage for demo
  const key = "kc_stem_regs";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  list.push({ ...payload, amount, reference: ref, createdAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(list));
  return { reference: ref, paymentMethod: payload.paymentMethod, amount, status: "pending" };
}
