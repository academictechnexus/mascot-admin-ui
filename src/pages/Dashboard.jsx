import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { adminFetch } from "../api/adminApi";

export default function Dashboard() {
  const [overview, setOverview] = useState({});
  const [sites, setSites] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminFetch("/admin/analytics/overview"),
      adminFetch("/admin/analytics/sites"),
      adminFetch("/admin/settings")
    ])
      .then(([o, s, g]) => {
        setOverview(o || {});
        setSites(Array.isArray(s) ? s : []);
        setSettings(g || {});
      })
      .catch(() => {
        setOverview({});
        setSites([]);
        setSettings({});
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <p>Loading dashboard…</p>
      </Layout>
    );
  }

  const totalUsage = sites.reduce(
    (sum, s) => sum + Number(s.usage_today || 0),
    0
  );

  const totalQuota = sites.reduce(
    (sum, s) => sum + Number(s.daily_quota || 0),
    0
  );

  const quotaPercent =
    totalQuota > 0 ? Math.round((totalUsage / totalQuota) * 100) : 0;

  const highUsageSites = sites.filter(
    s =>
      s.daily_quota &&
      s.usage_today / s.daily_quota >= 0.8
  );

  const inactiveSites = sites.filter(
    s => Number(s.usage_today || 0) === 0
  );

  return (
    <Layout>
      <div style={styles.container}>
        {/* ================= HEADER ================= */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>
              Real-time AI engine, usage & enforcement overview
            </p>
          </div>

          <span style={styles.badge}>
            System Live
          </span>
        </div>

        {/* ================= KPI ================= */}
        <div style={styles.kpiGrid}>
          <Kpi label="Total Sites" value={overview.totalSites || 0} />
          <Kpi label="Active Sites" value={overview.activeSites || 0} />
          <Kpi label="Messages Today" value={overview.messagesToday || 0} />
          <Kpi label="Knowledge Items" value={overview.knowledgeItems || 0} />
          <Kpi label="Quota Usage" value={`${quotaPercent}%`} />
        </div>

        {/* ================= ALERTS ================= */}
        <section style={styles.alertCard}>
          <h3>⚠️ Attention</h3>
          <ul>
            {highUsageSites.length > 0 && (
              <li>
                {highUsageSites.length} site(s) above 80% quota
              </li>
            )}
            {inactiveSites.length > 0 && (
              <li>
                {inactiveSites.length} site(s) with zero usage today
              </li>
            )}
            {highUsageSites.length === 0 &&
              inactiveSites.length === 0 && (
                <li>All systems within limits</li>
              )}
          </ul>
        </section>

        {/* ================= GLOBAL SETTINGS ================= */}
        <section style={styles.card}>
          <h3>Global AI Configuration (Live)</h3>
          <div style={styles.grid2}>
            <Info label="AI Enabled" value={settings.ai_enabled ? "Yes" : "No"} />
            <Info
              label="Learning Enabled"
              value={settings.learning_enabled ? "Yes" : "No"}
            />
            <Info label="Demo Daily Quota" value={settings.demo_daily_quota} />
            <Info label="Demo Period (days)" value={settings.demo_days} />
            <Info label="Temperature" value={settings.temperature} />
            <Info label="Max Tokens" value={settings.max_tokens} />
          </div>
        </section>

        {/* ================= SITE USAGE ================= */}
        <section style={styles.card}>
          <h3>Site Usage Today</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Plan</th>
                <th>Usage</th>
                <th>Quota</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sites.map(site => (
                <tr key={site.id}>
                  <td>{site.domain}</td>
                  <td>{site.plan}</td>
                  <td>{site.usage_today}</td>
                  <td>{site.daily_quota}</td>
                  <td
                    style={
                      site.status === "active"
                        ? styles.ok
                        : styles.warn
                    }
                  >
                    {site.status}
                  </td>
                </tr>
              ))}

              {sites.length === 0 && (
                <tr>
                  <td colSpan="5">No sites found</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </Layout>
  );
}

/* ================= COMPONENTS ================= */

function Kpi({ label, value }) {
  return (
    <div style={styles.kpi}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={styles.kpiValue}>{value}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.info}>
      <span>{label}</span>
      <strong>{value ?? "—"}</strong>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: { display: "flex", flexDirection: "column", gap: 24 },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  title: { fontSize: 24, fontWeight: 600 },
  subtitle: { fontSize: 14, color: "#6b7280" },

  badge: {
    background: "#ecfeff",
    border: "1px solid #99f6e4",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 13,
    color: "#0f766e"
  },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: 16
  },

  kpi: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 16
  },

  kpiLabel: { fontSize: 13, color: "#6b7280" },
  kpiValue: { fontSize: 26, fontWeight: 600 },

  alertCard: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: 8,
    padding: 16
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 20
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12
  },

  info: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14
  },

  ok: { color: "#16a34a", fontWeight: 500 },
  warn: { color: "#d97706", fontWeight: 500 }
};
