// src/api/adminApi.js
// Centralized Admin API layer (JWT-safe, Context-ready)

const API_BASE = import.meta.env.VITE_ADMIN_API;

if (!API_BASE) {
  console.error("❌ VITE_ADMIN_API is not configured");
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

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok || !data.success || !data.token) {
    throw new Error(data?.message || "Login failed");
  }

  return data; // { token, admin }
}

/* =========================
   AUTHENTICATED FETCH
========================= */
export async function adminFetch(path, options = {}) {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    throw new Error("unauthorized");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    throw new Error("unauthorized");
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    throw new Error(data?.error || "request_failed");
  }

  return data;
}
