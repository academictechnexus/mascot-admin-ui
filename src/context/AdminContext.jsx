// src/context/AdminContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { adminFetch } from "../api/adminApi";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load admin from backend on refresh
  useEffect(() => {
    async function loadAdmin() {
      try {
        const res = await adminFetch("/admin/me");
        setAdmin(res.admin);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadAdmin();
  }, []);

  function login(token, adminData) {
    localStorage.setItem("admin_token", token);
    setAdmin(adminData);
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setAdmin(null);
    window.location.href = "/login";
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
