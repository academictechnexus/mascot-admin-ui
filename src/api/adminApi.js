// src/api/adminApi.js
// Robust Admin API layer — SAFE, DEFENSIVE, NON-BREAKING

const API_BASE = import.meta.env.VITE_ADMIN_API;

if (!API_BASE) {
  console.error("❌ VITE_ADMIN_API is not configured");
}

/* =========================
   INTERNAL HELPERS
========================= */
function safeJsonParse(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    console.error("❌ Failed to parse JSON:", text);
    return null;
  }
}

function getToken() {
  return localStorage.getItem("admin_token");
}

function clearSession() {
  localStorage.removeItem("admin_token");
}

/* =========================
   ADMIN LOGIN
========================= */
export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const text = await res.text();
  const data = safeJsonParse(text);

  if (!res.ok || !data?.success || !data?.token) {
    throw new Error(data?.error || data?.message || "login_failed");
  }

  // 🔐 persist token
  localStorage.setItem("admin_token", data.token);

  return data; // { success, token, admin }
}

/* =========================
   AUTHENTICATED FETCH
========================= */
export async function adminFetch(path, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("unauthorized");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  const text = await res.text();
  const data = safeJsonParse(text);

  // 🔒 auth expired / invalid
  if (res.status === 401) {
    clearSession();
    throw new Error("unauthorized");
  }

  // ❌ server-side error
  if (!res.ok) {
    const err = new Error(data?.error || "request_failed");
    err.data = data;
    throw err;
  }

  // ✅ IMPORTANT: always return parsed body
  return data;
}

/* =========================
   OPTIONAL HELPERS (SAFE)
   (Do not break existing code)
========================= */

// Explicit helpers (can be used later if needed)
export const AdminAPI = {
  getSites: () => adminFetch("/admin/sites"),
  createSite: payload =>
    adminFetch("/admin/sites", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateSite: (id, payload) =>
    adminFetch(`/admin/sites/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  getSettings: () => adminFetch("/admin/settings"),
  updateSettings: payload =>
    adminFetch("/admin/settings", {
      method: "PUT",
      body: JSON.stringify(payload)
    })
};
