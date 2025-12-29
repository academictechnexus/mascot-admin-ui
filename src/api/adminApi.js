const API_BASE = import.meta.env.VITE_ADMIN_API;

/**
 * Admin Login
 */
export async function loginAdmin(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || "Invalid credentials");
  }

  // Store JWT + admin info
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
    return;
  }

  return res.json();
}
