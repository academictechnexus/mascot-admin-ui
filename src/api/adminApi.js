// src/api/adminApi.js
// FINAL STABLE Admin API layer — ARRAY SAFE, PROD SAFE

const API_BASE = import.meta.env.VITE_ADMIN_API;

if (!API_BASE) {
  console.error("❌ VITE_ADMIN_API is not configured");
}

/* =========================
   HELPERS
========================= */
function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function getToken() {
  return localStorage.getItem("admin_token");
}

function clearToken() {
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
  const data = safeJson(text);

  if (!res.ok || !data?.token) {
    throw new Error(data?.error || "login_failed");
  }

  localStorage.setItem("admin_token", data.token);
  return data;
}

/* =========================
   AUTH FETCH (CRITICAL FIX)
========================= */
export async function adminFetch(path, options = {}) {
  const token = getToken();
  if (!token) throw new Error("unauthorized");

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  const text = await res.text();
  const data = safeJson(text);

  // 🔒 Auth failure
  if (res.status === 401) {
    clearToken();
    throw new Error("unauthorized");
  }

  // ✅ KEY FIX: backend may return ARRAY directly
  if (Array.isArray(data)) {
    return data;
  }

  // ❌ Backend explicit error
  if (!res.ok) {
    throw new Error(data?.error || "request_failed");
  }

  // ✅ Normal object response
  return data;
}
