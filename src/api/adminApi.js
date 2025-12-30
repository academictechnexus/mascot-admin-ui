const API_BASE = import.meta.env.VITE_ADMIN_API;

/**
 * Admin Login
 */
export async function loginAdmin(username, password) {
  if (!API_BASE) {
    throw new Error("VITE_ADMIN_API is not configured");
  }

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    let msg = "Login failed";
    try {
      const err = await res.json();
      msg = err.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();

  if (!data.success || !data.token) {
    throw new Error("Invalid login response");
  }

  localStorage.setItem("admin_token", data.token);
  localStorage.setItem("admin_user", JSON.stringify(data.admin));

  return data.admin;
}

/**
 * Authenticated admin fetch
 */
export async function adminFetch(path, options = {}) {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    window.location.href = "/login";
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  return res.json();
}
