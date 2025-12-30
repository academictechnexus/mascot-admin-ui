import Sidebar from "./Sidebar";
import { useAdmin } from "../context/AdminContext";

export default function Layout({ children }) {
  const { admin, logout } = useAdmin();

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.brand}>
            <span style={styles.logo}>🧠</span>
            <span>Mascot Admin</span>
          </div>

          <div style={styles.userArea}>
            <div style={styles.userInfo}>
              <span style={styles.username}>
                {admin?.username || "Admin"}
              </span>
              <span style={styles.role}>
                {admin?.role || "admin"}
              </span>
            </div>

            <button onClick={logout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

/* =========================
   STYLES (PROFESSIONAL UI)
========================= */
const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#f1f5f9", // slate-100
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },

  header: {
    height: 64,
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    zIndex: 10
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 600,
    fontSize: 16,
    color: "#111827"
  },

  logo: {
    fontSize: 20
  },

  userArea: {
    display: "flex",
    alignItems: "center",
    gap: 16
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: 1.1
  },

  username: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827"
  },

  role: {
    fontSize: 12,
    color: "#6b7280",
    textTransform: "capitalize"
  },

  logoutBtn: {
    padding: "6px 14px",
    fontSize: 13,
    borderRadius: 6,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    cursor: "pointer",
    transition: "all 0.15s ease"
  },

  content: {
    flex: 1,
    padding: 32,
    background: "#f8fafc"
  }
};
