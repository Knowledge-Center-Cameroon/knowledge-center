import { toast } from "sonner";

const BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  "https://forestial-afocal-rex.ngrok-free.dev";
const JSON_HEADERS = {
  "Content-Type": "application/json",
};
const ACCESS_TOKEN_KEY = "kc_gsp_access_token";
const REFRESH_TOKEN_KEY = "kc_gsp_refresh_token";
const LEGACY_TOKEN_KEY = "kc_gsp_token";

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

export type GspDecisionStatus =
  | "pending"
  | "accepted"
  | "waitlisted"
  | "not_admitted";

export function getToken() {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    localStorage.getItem(LEGACY_TOKEN_KEY)
  );
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${BASE_URL}/api/v2/auth/token/refresh/`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ refresh }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.access) {
    clearAuthToken();
    return null;
  }

  saveAuthToken(data.access, refresh);
  return data.access as string;
}

async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  hasRetried = false,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...authHeaders(),
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !hasRetried && getRefreshToken()) {
    const nextToken = await refreshAccessToken();
    if (nextToken) {
      return apiRequest<T>(path, init, true);
    }
  }
  if (!res.ok) {
    const message = data?.error || data?.message || "Request failed";
    throw new Error(message);
  }
  return data as T;
}

export function saveAuthToken(accessToken: string, refreshToken?: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}
export function clearAuthToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}
export function hasAuthToken() {
  return Boolean(getToken());
}

export function persistAuthTokens(data: {
  access?: string;
  refresh?: string;
  token?: string;
}) {
  const accessToken = data.access || data.token;
  if (!accessToken) return false;
  saveAuthToken(accessToken, data.refresh);
  return true;
}

export async function registerGsp(payload: {
  google_id: string;
  username: string;
  email: string;
}) {
  const res = await fetch(`${BASE_URL}/api/v2/auth/google-login/`, {
    headers: {
      ...JSON_HEADERS,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Google sign-in failed");
  }
  return data as {
    success: boolean;
    refresh?: string;
    access?: string;
    token?: string;
    user: GspUser;
  };
}

export async function verifyEmailCode(payload: {
  email: string;
  code: string;
}) {
  return apiRequest<{
    success: boolean;
    message: string;
    token: string;
    user: GspUser;
  }>("/api/v2/auth/verify-email/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resendVerificationCode(email: string) {
  return apiRequest<{
    success: boolean;
    message: string;
    debugVerificationCode?: string;
  }>("/api/v2/auth/resend-verification-code/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function loginGsp(payload: { email: string; password: string }) {
  return apiRequest<{
    success: boolean;
    token: string;
    refresh?: string;
    user: GspUser;
  }>(
    "/api/v2/auth/login/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function forgotPassword(email: string) {
  return apiRequest<{ success: boolean }>("/api/v2/auth/forgot-password/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return apiRequest<{ success: boolean }>("/api/v2/auth/reset-password/", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}

export async function getCurrentUser() {
  return apiRequest<{ user: GspUser }>("/api/v2/auth/me/");
}

export async function createPortalAccount(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return apiRequest<{
    success: boolean;
    message?: string;
    token?: string;
    user?: GspUser;
  }>("/api/v2/auth/register/", {
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

export async function saveGspDraft(
  data: any,
  sectionState: Record<string, boolean>,
  r_id?: string,
) {
  const payload = buildGspApplicationPayload(data, sectionState);

  if (r_id) {
    return apiRequest<{ success: boolean; application: any }>(
      `/api/v2/gsp/registration/${r_id}/`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
  } else {
    return apiRequest<{ success: boolean; application: any }>(
      "/api/v2/gsp/registration/",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }
}

export async function submitGspApplication(
  data: any,
  sectionState: Record<string, boolean>,
  r_id: string,
) {
  const payload = buildGspApplicationPayload(data, sectionState, {
    submitted: true,
    status: "submitted",
  });
  return apiRequest<{ success: boolean; reference: string; application: any }>(
    `/api/v2/gsp/registration/${r_id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

// NOTE: Trailing slash is required — Django APPEND_SLASH will 301-redirect
// slashless PATCH/POST requests and the body is dropped.
export async function getGspDecision() {
  return apiRequest<{
    released: boolean;
    decisionStatus: GspDecisionStatus | null;
    reference?: string;
    lowerSixthPathwayChoice?: string | null;
  }>("/api/gsp/application/decision/");
}

export async function uploadGspDocument({
  file,
  application,
  field,
}: {
  file: File;
  application: string;
  field: "reportCard" | "olSlip" | "alSlip";
}) {
  const form = new FormData();
  form.append(field, file);

  const upload = () =>
    fetch(`${BASE_URL}/api/v2/gsp/registration/${application}/`, {
      method: "PATCH",
      headers: {
        ...authHeaders(),
      },
      body: form,
    });

  return await upload()
    .then(async (res) => {
      if (res.status === 401 && getRefreshToken()) {
        const nextToken = await refreshAccessToken();
        if (nextToken) return upload();
      }
      return res;
    })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.error || data?.message || "Failed to upload document",
        );
      }
      return data;
    })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.error(e);
      toast.error("Failed to upload document. Please try again.");
      throw e;
    });
}

export async function adminGetApplications(query?: string) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  return apiRequest<{ applications: any[] }>(
    `/api/admin/gsp/applications/${params.toString() ? `?${params.toString()}` : ""}`,
  );
}

export async function adminGetApplication(applicationId: string) {
  const res = await apiRequest<any>(
    `/api/admin/gsp/applications/${applicationId}/`,
  );
  return { application: res.application || res };
}

export async function adminSetDecision(
  applicationId: string,
  decisionStatus: GspDecisionStatus,
) {
  return apiRequest<{ success: boolean; application: any }>(
    `/api/admin/gsp/applications/${applicationId}/decision/`,
    {
      method: "PATCH",
      body: JSON.stringify({ decisionStatus }),
    },
  );
}

export async function adminGetUsers() {
  return apiRequest<{ users: GspUser[] }>("/api/admin/gsp/users/");
}

export async function adminToggleRelease(isReleased: boolean) {
  return apiRequest<{
    success: boolean;
    release: { isReleased: boolean; releasedAt: string | null };
  }>("/api/admin/gsp/release/", {
    method: "PATCH",
    body: JSON.stringify({ isReleased }),
  });
}

export async function adminGetRelease() {
  return apiRequest<{
    release: { isReleased: boolean; releasedAt: string | null };
  }>("/api/admin/gsp/release/");
}
