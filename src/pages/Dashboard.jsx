import Layout from "../components/Layout";

export default function Dashboard() {
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
            All Systems Operational
          </div>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div style={styles.kpiGrid}>
          <KpiCard label="Total Sites" value="12" hint="2 added this month" />
          <KpiCard label="Messages Today" value="1,248" hint="+18% vs yesterday" />
          <KpiCard label="AI Responses" value="1,231" hint="99% success rate" />
          <KpiCard label="Quota Usage" value="62%" hint="Across all sites" />
        </div>

        {/* ================= ATTENTION REQUIRED ================= */}
        <section style={styles.attentionCard}>
          <h3 style={styles.sectionTitle}>⚠️ Attention Required</h3>

          <ul style={styles.alertList}>
            <li>2 sites are above <b>80% daily quota</b></li>
            <li>1 site has <b>zero usage</b> in last 7 days</li>
            <li>1 site is currently <b>disabled</b></li>
            <li>3 AI responses flagged for retry today</li>
          </ul>
        </section>

        {/* ================= MAIN GRID ================= */}
        <div style={styles.mainGrid}>
          {/* Usage Overview */}
          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>Usage Overview</h3>

            <ProgressRow label="Chat Requests" value={72} />
            <ProgressRow label="Knowledge Lookups" value={48} />
            <ProgressRow label="Admin API Calls" value={26} />

            <p style={styles.muted}>
              Usage resets automatically every 24 hours
            </p>
          </section>

          {/* System & AI Status */}
          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>System & AI Status</h3>

            <InfoRow label="Backend" value="Healthy" ok />
            <InfoRow label="Database" value="Connected (Neon)" ok />
            <InfoRow label="Authentication" value="JWT Secure" ok />
            <InfoRow label="AI Provider" value="OpenAI Active" ok />
            <InfoRow label="AI Learning" value="Enabled" ok />
          </section>
        </div>

        {/* ================= TOP SITES ================= */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Top Sites by Usage</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Site</th>
                <th>Plan</th>
                <th>Usage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>academictechnexus.com</td>
                <td>Advanced</td>
                <td>82%</td>
                <td style={styles.ok}>Active</td>
              </tr>
              <tr>
                <td>demo-basic</td>
                <td>Basic</td>
                <td>41%</td>
                <td style={styles.ok}>Active</td>
              </tr>
              <tr>
                <td>client-example.com</td>
                <td>Pro</td>
                <td>12%</td>
                <td style={styles.warn}>Low Usage</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ================= RECENT ACTIVITY ================= */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Recent Activity</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5 min ago</td>
                <td>Admin login</td>
                <td style={styles.ok}>Success</td>
              </tr>
              <tr>
                <td>22 min ago</td>
                <td>Site updated (plan upgrade)</td>
                <td style={styles.ok}>Completed</td>
              </tr>
              <tr>
                <td>1 hr ago</td>
                <td>Quota warning triggered</td>
                <td style={styles.warn}>Monitored</td>
              </tr>
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
        <div style={{ ...styles.progressFill, width: `${value}%` }} />
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
