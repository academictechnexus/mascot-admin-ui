import { NavLink } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function Sidebar() {
  const { logout } = useAdmin();

  return (
    <aside style={styles.sidebar}>
      {/* ================= BRAND ================= */}
      <div style={styles.brand}>
        <span style={styles.logo}>🧠</span>
        <div>
          <div style={styles.brandTitle}>Mascot AI</div>
          <div style={styles.brandSubtitle}>Admin Console</div>
        </div>
      </div>

      {/* ================= NAVIGATION ================= */}
      <nav style={styles.nav}>
        <NavSection title="Overview">
          <NavItem to="/dashboard" label="Dashboard" />
        </NavSection>

        <NavSection title="Management">
          <NavItem to="/sites" label="Sites" />
          <NavItem to="/knowledge" label="Knowledge Base" />
        </NavSection>

        <NavSection title="AI Controls">
          <NavItem to="/ai-controls" label="AI Configuration" />
        </NavSection>
      </nav>

      {/* ================= FOOTER ================= */}
      <div style={styles.footer}>
        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </aside>
  );
}

/* =========================
   NAV SECTION
========================= */
function NavSection({ title, children }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

/* =========================
   NAV ITEM
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
   STYLES (ENTERPRISE)
========================= */
const styles = {
  sidebar: {
    width: 270,
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
    gap: 12,
    fontWeight: 600,
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 28,
    paddingLeft: 8
  },

  logo: {
    fontSize: 22
  },

  brandTitle: {
    fontSize: 15,
    fontWeight: 600
  },

  brandSubtitle: {
    fontSize: 12,
    color: "#94a3b8"
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    flex: 1
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },

  sectionTitle: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#64748b",
    paddingLeft: 12,
    marginBottom: 4
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
