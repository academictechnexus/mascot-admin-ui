// src/api/adminApi.js
// Robust Admin API layer (handles non-JSON safely)

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

  const text = await res.text(); // 👈 read raw first

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("❌ Non-JSON response from server:", text);
    throw new Error("Server returned invalid response");
  }

  if (!res.ok || !data.success || !data.token) {
    throw new Error(data.message || "Login failed");
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
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("❌ Non-JSON response:", text);
    throw new Error("Server returned invalid response");
  }

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    throw new Error("unauthorized");
  }

  if (!res.ok) {
    throw new Error(data.error || "request_failed");
  }

  return data;
}
