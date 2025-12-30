import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { adminFetch } from "../api/adminApi";

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/sites")
      .then(data => {
        if (Array.isArray(data)) setSites(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Sites</h1>
            <p style={styles.subtitle}>
              Manage customer websites, plans, and usage limits
            </p>
          </div>

          <button style={styles.addBtn}>+ Add Site</button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={styles.card}>Loading sites…</div>
        ) : sites.length === 0 ? (
          <div style={styles.card}>No sites created yet</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Plan</th>
                  <th>Usage</th>
                  <th>Status</th>
                  <th align="right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sites.map(site => (
                  <tr key={site.id}>
                    <td>
                      <div style={styles.siteCell}>
                        <div style={styles.siteName}>{site.name}</div>
                        <div style={styles.siteDomain}>{site.domain}</div>
                      </div>
                    </td>

                    <td>
                      <PlanBadge plan={site.plan} />
                    </td>

                    <td>
                      <UsageBar
                        used={site.usage_today || 0}
                        limit={site.daily_quota}
                      />
                    </td>

                    <td>
                      <StatusBadge status={site.status} />
                    </td>

                    <td align="right">
                      <ActionMenu />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

/* =========================
   SUB COMPONENTS
========================= */

function PlanBadge({ plan }) {
  const colors = {
    free: "#e5e7eb",
    pro: "#c7d2fe",
    enterprise: "#fde68a"
  };

  return (
    <span
      style={{
        ...styles.badge,
        background: colors[plan] || "#e5e7eb"
      }}
    >
      {plan}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: styles.statusActive,
    disabled: styles.statusDisabled
  };

  return (
    <span style={{ ...styles.badge, ...(map[status] || {}) }}>
      {status}
    </span>
  );
}

function UsageBar({ used, limit }) {
  const percent = Math.min(100, Math.round((used / limit) * 100 || 0));

  return (
    <div>
      <div style={styles.usageHeader}>
        <span>{used}</span>
        <span>{limit}</span>
      </div>

      <div style={styles.usageBar}>
        <div
          style={{
            ...styles.usageFill,
            width: `${percent}%`
          }}
        />
      </div>
    </div>
  );
}

function ActionMenu() {
  return (
    <div style={styles.actions}>
      <button style={styles.actionBtn}>View</button>
      <button style={styles.actionBtn}>Edit</button>
      <button style={styles.actionBtnDanger}>Disable</button>
    </div>
  );
}

/* =========================
   STYLES (ENTERPRISE)
========================= */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  title: {
    fontSize: 24,
    fontWeight: 600,
    margin: 0
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4
  },

  addBtn: {
    padding: "8px 14px",
    borderRadius: 6,
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },

  card: {
    background: "#ffffff",
    borderRadius: 10,
    padding: 24,
    border: "1px solid #e5e7eb"
  },

  tableWrapper: {
    background: "#ffffff",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    overflow: "hidden"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14
  },

  siteCell: {
    display: "flex",
    flexDirection: "column"
  },

  siteName: {
    fontWeight: 500
  },

  siteDomain: {
    fontSize: 12,
    color: "#6b7280"
  },

  badge: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    textTransform: "capitalize"
  },

  statusActive: {
    background: "#dcfce7",
    color: "#166534"
  },

  statusDisabled: {
    background: "#fee2e2",
    color: "#991b1b"
  },

  usageHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#6b7280"
  },

  usageBar: {
    height: 6,
    background: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 4
  },

  usageFill: {
    height: "100%",
    background: "#4f46e5"
  },

  actions: {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end"
  },

  actionBtn: {
    padding: "6px 10px",
    fontSize: 12,
    borderRadius: 6,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    cursor: "pointer"
  },

  actionBtnDanger: {
    padding: "6px 10px",
    fontSize: 12,
    borderRadius: 6,
    border: "1px solid #fee2e2",
    background: "#fff1f2",
    color: "#991b1b",
    cursor: "pointer"
  }
};
