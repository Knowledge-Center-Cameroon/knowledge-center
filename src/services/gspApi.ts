import { toast } from "sonner";

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "https://kcbackend-production-7ae5.up.railway.app";
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

export function getToken() {
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

export async function registerGsp(payload: { google_id: string; username: string; email: string }) {
  const res = await fetch(`${BASE_URL}/api/v2/auth/google-login/`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Google sign-in failed");
  }
  return data as { success: boolean; refresh?: string; access?: string; token?: string; user: GspUser };
}

export async function verifyEmailCode(payload: { email: string; code: string }) {
  return apiRequest<{ success: boolean; message: string; token: string; user: GspUser }>("/api/v2/auth/verify-email/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resendVerificationCode(email: string) {
  return apiRequest<{ success: boolean; message: string; debugVerificationCode?: string }>("/api/v2/auth/resend-verification-code/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function loginGsp(payload: { email: string; password: string }) {
  return apiRequest<{ token: string; user: GspUser }>("/api/v2/auth/google-login/", {
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
  return apiRequest<{ user: GspUser }>("/api/v2/auth/me/");
}

export async function createPortalAccount(payload: { name: string; email: string; password: string }) {
  return apiRequest<{ success: boolean; message?: string; token?: string; user?: GspUser }>("/api/v2/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCurrentUser(payload: { name?: string }) {
  return apiRequest<{ user: GspUser }>("/api/v2/auth/me/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getGspApplication() {
  const res = await apiRequest<any>("/api/v2/gsp/registration/");
  // If it's an array (ListCreateAPIView), get the first one
  const app = Array.isArray(res) ? (res.length > 0 ? res[0] : null) : res;
  return { application: app };
}

function buildGspApplicationPayload(
  data: any,
  sectionState: Record<string, boolean>,
  extras: Record<string, any> = {},
) {
  const {
    documents: _documents,
    reportCard: _reportCard,
    olSlip: _olSlip,
    alSlip: _alSlip,
    ...applicationData
  } = data;

  return {
    ...applicationData,
    phoneNumber: `${data.phoneCode || "+237"} ${data.phone || ""}`.trim(),
    secondaryGuardianOccupation: data.secondGuardianOccupation,
    sectionState,
    ...extras,
  };
}

export async function saveGspDraft(data: any, sectionState: Record<string, boolean>, r_id?: string) {
  const payload = buildGspApplicationPayload(data, sectionState);

  if (r_id) {
    return apiRequest<{ success: boolean; application: any }>(`/api/v2/gsp/registration/${r_id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  } else {
    return apiRequest<{ success: boolean; application: any }>("/api/v2/gsp/registration/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
} 

export async function submitGspApplication(data: any, sectionState: Record<string, boolean>, r_id: string) {
  const payload = buildGspApplicationPayload(data, sectionState, {
    submitted: true,
    status: "submitted",
  });
  return apiRequest<{ success: boolean; reference: string; application: any }>(`/api/v2/gsp/registration/${r_id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getGspDecision() {
  return apiRequest<{ released: boolean; decisionStatus: GspDecisionStatus | null; reference?: string; lowerSixthPathwayChoice?: string | null }>("/api/gsp/application/decision");
}

export async function uploadGspDocument({ file, application, field }: { file: File; application: string; field: "reportCard" | "olSlip" | "alSlip" }) {
  const form = new FormData();
  form.append(field, file);
  // return apiRequest<UploadedDocument>(`/api/v2/gsp/registration/${application}`, {
  //   method: "PATCH",
  //   body: form
  // });
  return await fetch(`${BASE_URL}/api/v2/gsp/registration/${application}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: form,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || data?.message || "Failed to upload document");
    }
    return data;
  })
  .then(data => {return data})
  .catch(e => {
    console.error(e);
    toast.error("Failed to upload document. Please try again.");
    throw e;
  });
}

export async function adminGetApplications(query?: string) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  return apiRequest<{ applications: any[] }>(`/api/admin/gsp/applications${params.toString() ? `?${params.toString()}` : ""}`);
}

export async function adminGetApplication(applicationId: string) {
  const res = await apiRequest<any>(`/api/admin/gsp/applications/${applicationId}`);
  return { application: res.application || res };
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
