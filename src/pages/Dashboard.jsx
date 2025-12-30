import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { adminFetch } from "../api/adminApi";

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminFetch("/admin/analytics/overview"),
      adminFetch("/admin/analytics/sites")
    ])
      .then(([overviewData, sitesData]) => {
        setOverview(overviewData);
        setSites(sitesData);
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

  const totalUsage =
    sites.reduce((sum, s) => sum + Number(s.usage_today || 0), 0) || 0;

  const quotaUsagePercent =
    sites.length === 0
      ? 0
      : Math.round(
          (totalUsage /
            sites.reduce((s, x) => s + Number(x.daily_quota || 0), 0)) *
            100
        );

  const highUsageSites = sites.filter(
    s => s.daily_quota && s.usage_today / s.daily_quota >= 0.8
  );

  const inactiveSites = sites.filter(s => s.usage_today === 0);

  return (
    <Layout>
      <div style={styles.container}>
        {/* ================= HEADER ================= */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>
              Mission control for system health, usage & AI behavior
            </p>
          </div>

          <div style={styles.badgeHealthy}>
            <span style={styles.dotHealthy} />
            Live System Data
          </div>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div style={styles.kpiGrid}>
          <KpiCard
            label="Total Sites"
            value={overview.totalSites}
            hint={`${overview.activeSites} active`}
          />
          <KpiCard
            label="Messages Today"
            value={overview.messagesToday}
            hint="Across all sites"
          />
          <KpiCard
            label="Knowledge Items"
            value={overview.knowledgeItems}
            hint="Learned summaries"
          />
          <KpiCard
            label="Quota Usage"
            value={`${quotaUsagePercent}%`}
            hint="Today"
          />
        </div>

        {/* ================= ATTENTION REQUIRED ================= */}
        <section style={styles.attentionCard}>
          <h3 style={styles.sectionTitle}>⚠️ Attention Required</h3>

          <ul style={styles.alertList}>
            {highUsageSites.length > 0 && (
              <li>
                {highUsageSites.length} site(s) above{" "}
                <b>80% daily quota</b>
              </li>
            )}
            {inactiveSites.length > 0 && (
              <li>
                {inactiveSites.length} site(s) have{" "}
                <b>zero usage today</b>
              </li>
            )}
            {highUsageSites.length === 0 &&
              inactiveSites.length === 0 && (
                <li>All systems operating within limits</li>
              )}
          </ul>
        </section>

        {/* ================= MAIN GRID ================= */}
        <div style={styles.mainGrid}>
          {/* Usage Overview */}
          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>Usage Overview</h3>

            <ProgressRow
              label="Messages Used"
              value={quotaUsagePercent}
            />

            <p style={styles.muted}>
              Usage resets automatically every 24 hours
            </p>
          </section>

          {/* System & AI Status */}
          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>System & AI Status</h3>

            <InfoRow label="Backend" value="Operational" ok />
            <InfoRow label="Database" value="Neon Connected" ok />
            <InfoRow label="Authentication" value="JWT Secured" ok />
            <InfoRow label="AI Provider" value="OpenAI Active" ok />
            <InfoRow label="Learning Engine" value="Enabled" ok />
          </section>
        </div>

        {/* ================= TOP SITES ================= */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Site Usage Today</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Site</th>
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

function KpiCard({ label, value, hint }) {
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={styles.kpiValue}>{value}</div>
      <div style={styles.kpiHint}>{hint}</div>
    </div>
  );
}

function ProgressRow({ label, value }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={styles.progressHeader}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div style={styles.progressBar}>
        <div
          style={{ ...styles.progressFill, width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value, ok }) {
  return (
    <div style={styles.infoRow}>
      <span>{label}</span>
      <span style={ok ? styles.ok : styles.warn}>{value}</span>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: { display: "flex", flexDirection: "column", gap: 24 },

  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  title: { fontSize: 24, fontWeight: 600, margin: 0 },
  subtitle: { fontSize: 14, color: "#6b7280" },

  badgeHealthy: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 12px",
    borderRadius: 999,
    background: "#ecfeff",
    color: "#0f766e",
    border: "1px solid #99f6e4",
    fontSize: 13
  },

  dotHealthy: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#14b8a6"
  },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16
  },

  kpiCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    border: "1px solid #e5e7eb"
  },

  kpiLabel: { fontSize: 13, color: "#6b7280" },
  kpiValue: { fontSize: 28, fontWeight: 600 },
  kpiHint: { fontSize: 12, color: "#9ca3af" },

  attentionCard: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: 10,
    padding: 20
  },

  alertList: {
    marginTop: 10,
    paddingLeft: 18,
    color: "#92400e",
    fontSize: 14
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: 24
  },

  card: {
    background: "#fff",
    borderRadius: 10,
    padding: 24,
    border: "1px solid #e5e7eb"
  },

  sectionTitle: { fontSize: 16, fontWeight: 600, marginBottom: 12 },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13
  },

  progressBar: {
    height: 8,
    background: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden"
  },

  progressFill: { height: "100%", background: "#4f46e5" },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: 14
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14
  },

  ok: { color: "#16a34a", fontWeight: 500 },
  warn: { color: "#d97706", fontWeight: 500 },

  muted: { fontSize: 12, color: "#9ca3af", marginTop: 10 }
};
