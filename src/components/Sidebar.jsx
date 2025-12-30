import { NavLink } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function Sidebar() {
  const { logout } = useAdmin();

  return (
    <aside style={styles.sidebar}>
      {/* Brand */}
      <div style={styles.brand}>
        <span style={styles.logo}>🧠</span>
        <span>Mascot Admin</span>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <NavItem to="/dashboard" label="Dashboard" />
        <NavItem to="/sites" label="Sites" />
      </nav>

      {/* Footer / Logout */}
      <div style={styles.footer}>
        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </aside>
  );
}

/* =========================
   NAV ITEM COMPONENT
========================= */
function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...styles.navItem,
        ...(isActive ? styles.navItemActive : {})
      })}
    >
      {label}
    </NavLink>
  );
}

/* =========================
   STYLES (PROFESSIONAL)
========================= */
const styles = {
  sidebar: {
    width: 260,
    background: "#0f172a", // slate-900
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    boxShadow: "2px 0 8px rgba(0,0,0,0.15)"
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 600,
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 32,
    paddingLeft: 8
  },

  logo: {
    fontSize: 20
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1
  },

  navItem: {
    padding: "10px 12px",
    borderRadius: 6,
    color: "#e5e7eb",
    textDecoration: "none",
    fontSize: 14,
    transition: "background 0.15s ease, color 0.15s ease"
  },

  navItemActive: {
    background: "#1e293b", // slate-800
    color: "#ffffff",
    fontWeight: 500
  },

  footer: {
    borderTop: "1px solid #1e293b",
    paddingTop: 16,
    marginTop: 16
  },

  logoutBtn: {
    width: "100%",
    padding: "10px",
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #334155",
    background: "transparent",
    color: "#e5e7eb",
    cursor: "pointer",
    transition: "background 0.15s ease"
  }
};
