import { createContext, useContext, useEffect, useState } from "react";
import { adminFetch } from "../api/adminApi";
import { useLocation } from "react-router-dom";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // 🔒 IMPORTANT: Do not run auth check on public routes
    if (location.pathname === "/login") {
      setLoading(false);
      return;
    }

    async function loadAdmin() {
      try {
        const res = await adminFetch("/admin/me");
        setAdmin(res.admin);
      } catch {
        logout(false);
      } finally {
        setLoading(false);
      }
    }

    loadAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  function login(token, adminData) {
    localStorage.setItem("admin_token", token);
    setAdmin(adminData);
  }

  function logout(redirect = true) {
    localStorage.removeItem("admin_token");
    setAdmin(null);

    if (redirect) {
      window.location.href = "/login";
    }
  }

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
