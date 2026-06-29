// API service for Events management
import { getToken } from "./gspApi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://forestial-afocal-rex.ngrok-free.dev";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface KCEvent {
  id: string; // UUID from Django
  title: string;
  date: string; // e.g. "Feb 9, 2026"
  date_iso: string; // ISO date string for sorting
  time: string; // e.g. "10:00 - 14:00"
  location: string;
  description: string;
  badge?: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateEventPayload = Omit<
  KCEvent,
  "id" | "created_at" | "updated_at"
>;

/* ---- Local Storage Fallback ---- */
const EVENTS_KEY = "kc_events_v1";

function readLocalEvents(): KCEvent[] {
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]") as KCEvent[];
  } catch {
    return [];
  }
}

function writeLocalEvents(events: KCEvent[]) {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch {}
}

/* ---- API Methods ---- */

/** Get all events */
export async function getEvents(): Promise<KCEvent[]> {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/events`);
    if (!resp.ok) throw new Error("Failed to load events");
    const data = await resp.json();
    return Array.isArray(data) ? data : data.events || [];
  } catch (error) {
    console.error("getEvents fallback to local:", error);
    return readLocalEvents();
  }
}

/** Admin: Create a new event */
export async function adminCreateEvent(
  payload: CreateEventPayload,
): Promise<KCEvent> {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/admin/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(
        errData.error || errData.message || "Create event failed",
      );
    }
    const data = await resp.json();
    const event = data.event || data;
    // Also persist locally as fallback
    const local = readLocalEvents();
    local.push(event);
    writeLocalEvents(local);
    return event;
  } catch (error) {
    console.error("adminCreateEvent fallback:", error);
    // Fallback: create locally
    const event: KCEvent = {
      _id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    const local = readLocalEvents();
    local.push(event);
    writeLocalEvents(local);
    return event;
  }
}

/** Admin: Update an event */
export async function adminUpdateEvent(
  eventId: string,
  payload: Partial<CreateEventPayload>,
): Promise<KCEvent> {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/admin/events/${eventId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(
        errData.error || errData.message || "Update event failed",
      );
    }
    const data = await resp.json();
    return data.event || data;
  } catch (error) {
    console.error("adminUpdateEvent fallback:", error);
    const local = readLocalEvents();
    const idx = local.findIndex((e) => e._id === eventId);
    if (idx !== -1) {
      local[idx] = {
        ...local[idx],
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      writeLocalEvents(local);
      return local[idx];
    }
    throw error;
  }
}

/** Admin: Delete an event */
export async function adminDeleteEvent(
  eventId: string,
): Promise<{ deleted: boolean }> {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/admin/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
    });
    if (!resp.ok) throw new Error("Delete event failed");
    // Remove locally too
    const local = readLocalEvents().filter((e) => e._id !== eventId);
    writeLocalEvents(local);
    return { deleted: true };
  } catch (error) {
    console.error("adminDeleteEvent fallback:", error);
    const local = readLocalEvents().filter((e) => e._id !== eventId);
    writeLocalEvents(local);
    return { deleted: true };
  }
}
