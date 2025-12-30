import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { adminFetch } from "../api/adminApi";

export default function Dashboard() {
  const [overview, setOverview] = useState({});
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminFetch("/admin/analytics/overview"),
      adminFetch("/admin/analytics/sites")
    ])
      .then(([overviewData, sitesData]) => {
        setOverview(overviewData || {});
        setSites(Array.isArray(sitesData) ? sitesData : []);
      })
      .catch(() => {
        setOverview({});
        setSites([]);
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

  const quotaUsagePercent =
    totalQuota > 0 ? Math.round((totalUsage / totalQuota) * 100) : 0;

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>Dashboard</h1>

        <div style={styles.kpiGrid}>
          <Kpi label="Total Sites" value={overview.totalSites || 0} />
          <Kpi label="Active Sites" value={overview.activeSites || 0} />
          <Kpi label="Messages Today" value={overview.messagesToday || 0} />
          <Kpi label="Quota Usage" value={`${quotaUsagePercent}%`} />
        </div>

        <section style={styles.card}>
          <h3>Site Usage Today</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Plan</th>
                <th>Usage</th>
                <th>Quota</th>
              </tr>
            </thead>
            <tbody>
              {sites.map(site => (
                <tr key={site.id}>
                  <td>{site.domain}</td>
                  <td>{site.plan}</td>
                  <td>{site.usage_today}</td>
                  <td>{site.daily_quota}</td>
                </tr>
              ))}
              {sites.length === 0 && (
                <tr>
                  <td colSpan="4">No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </Layout>
  );
}

function Kpi({ label, value }) {
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={styles.kpiValue}>{value}</div>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", gap: 24 },
  title: { fontSize: 24, fontWeight: 600 },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16
  },
  kpiCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    border: "1px solid #e5e7eb"
  },
  kpiLabel: { fontSize: 13, color: "#6b7280" },
  kpiValue: { fontSize: 28, fontWeight: 600 },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    border: "1px solid #e5e7eb"
  },
  table: { width: "100%", borderCollapse: "collapse" }
};
