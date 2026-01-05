// src/api/adminApi.js
// FINAL — production-safe, no env dependency

const API_BASE = "https://mascot.academictechnexus.com";

/* =========================
   ADMIN LOGIN
========================= */
export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!res.ok || !data.token) {
    throw new Error(data.error || "login_failed");
  }

  localStorage.setItem("admin_token", data.token);
  return data;
}

/* =========================
   AUTH FETCH (STABLE)
========================= */
export async function adminFetch(path, options = {}) {
  const token = localStorage.getItem("admin_token");
  if (!token) throw new Error("unauthorized");

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: options.body
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Non-JSON response:", text);
    throw new Error("invalid_response");
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

/* =========================
   🆕 CLIENT AI SETUP HELPERS (ADDED)
========================= */

export function saveSiteSetup(siteId, answers) {
  return adminFetch(`/admin/sites/${siteId}/setup`, {
    method: "POST",
    body: JSON.stringify({ answers })
  });
}

export function uploadSiteDocs(siteId, files) {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));

  return adminFetch(`/admin/sites/${siteId}/setup/upload`, {
    method: "POST",
    body: formData
  });
}
