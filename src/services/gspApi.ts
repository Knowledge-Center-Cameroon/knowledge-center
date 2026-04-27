const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "kcbackend-production-7ae5.up.railway.app";
const TOKEN_KEY = "kc_gsp_token";

export type GspUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  isEmailVerified: boolean;
  lastLoginAt?: string;
};

export type UploadedDocument = {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  originalFilename: string;
};

export type GspDecisionStatus = "pending" | "accepted" | "waitlisted" | "not_admitted";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || data?.message || "Request failed";
    throw new Error(message);
  }
  return data as T;
}

export function saveAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}
export function hasAuthToken() {
  return Boolean(getToken());
}

export async function registerGsp(payload: { name: string; email: string; password: string }) {
  return apiRequest<{ success: boolean; message: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyEmailToken(token: string) {
  return apiRequest<{ success: boolean; message: string }>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function loginGsp(payload: { email: string; password: string }) {
  return apiRequest<{ token: string; user: GspUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(email: string) {
  return apiRequest<{ success: boolean }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return apiRequest<{ success: boolean }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}

export async function getCurrentUser() {
  return apiRequest<{ user: GspUser }>("/api/auth/me");
}

export async function getGspApplication() {
  return apiRequest<{ application: any }>("/api/gsp/application");
}

export async function saveGspDraft(data: any, sectionState: Record<string, boolean>) {
  return apiRequest<{ success: boolean; application: any }>("/api/gsp/application/draft", {
    method: "PUT",
    body: JSON.stringify({ data, sectionState }),
  });
}

export async function submitGspApplication(data: any, sectionState: Record<string, boolean>) {
  return apiRequest<{ success: boolean; reference: string; application: any }>("/api/gsp/application/submit", {
    method: "POST",
    body: JSON.stringify({ data, sectionState }),
  });
}

export async function getGspDecision() {
  return apiRequest<{ released: boolean; decisionStatus: GspDecisionStatus | null; reference?: string; lowerSixthPathwayChoice?: string | null }>("/api/gsp/application/decision");
}

export async function uploadGspDocument(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
  return apiRequest<UploadedDocument>("/api/gsp/uploads", {
    method: "POST",
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type,
      dataUrl,
    }),
  });
}

export async function adminGetApplications(query?: string) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  return apiRequest<{ applications: any[] }>(`/api/admin/gsp/applications${params.toString() ? `?${params.toString()}` : ""}`);
}

export async function adminSetDecision(applicationId: string, decisionStatus: GspDecisionStatus) {
  return apiRequest<{ success: boolean; application: any }>(`/api/admin/gsp/applications/${applicationId}/decision`, {
    method: "PATCH",
    body: JSON.stringify({ decisionStatus }),
  });
}

export async function adminGetUsers() {
  return apiRequest<{ users: GspUser[] }>("/api/admin/gsp/users");
}

export async function adminToggleRelease(isReleased: boolean) {
  return apiRequest<{ success: boolean; release: { isReleased: boolean; releasedAt: string | null } }>("/api/admin/gsp/release", {
    method: "PATCH",
    body: JSON.stringify({ isReleased }),
  });
}

export async function adminGetRelease() {
  return apiRequest<{ release: { isReleased: boolean; releasedAt: string | null } }>("/api/admin/gsp/release");
}
