export async function loginAdmin(username, password) {
  console.log("API_BASE =", API_BASE);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  console.log("Login response status:", res.status);

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Response is not valid JSON");
  }

  console.log("Login response body:", data);

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  if (!data.success || !data.token) {
    throw new Error("Login failed: success/token missing");
  }

  localStorage.setItem("admin_token", data.token);
  localStorage.setItem("admin_user", JSON.stringify(data.admin));

  return data.admin;
}
