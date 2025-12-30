import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>
              System overview & operational insights
            </p>
          </div>

          <div style={styles.badge}>
            <span style={styles.dot} />
            System Healthy
          </div>
        </div>

        {/* KPI Cards */}
        <div style={styles.kpiGrid}>
          <KpiCard
            label="Total Sites"
            value="12"
            hint="+2 this month"
          />
          <KpiCard
            label="Messages Today"
            value="1,248"
            hint="+18% vs yesterday"
          />
          <KpiCard
            label="Active Plans"
            value="9"
            hint="3 Pro • 6 Free"
          />
          <KpiCard
            label="API Usage"
            value="62%"
            hint="Daily quota"
          />
        </div>

        {/* Main Grid */}
        <div style={styles.mainGrid}>
          {/* Usage Overview */}
          <section style={styles.card}>
            <h3 style={styles.cardTitle}>Usage Overview</h3>

            <div style={styles.progressBlock}>
              <ProgressRow label="Chat Requests" value={72} />
              <ProgressRow label="Uploads" value={45} />
              <ProgressRow label="Admin API" value={28} />
            </div>

            <p style={styles.cardHint}>
              Usage resets every 24 hours
            </p>
          </section>

          {/* System Info */}
          <section style={styles.card}>
            <h3 style={styles.cardTitle}>System Information</h3>

            <InfoRow label="Backend Status" value="Operational" ok />
            <InfoRow label="Database" value="Neon PostgreSQL" ok />
            <InfoRow label="Auth System" value="JWT Secured" ok />
            <InfoRow label="Deployment" value="Railway + Cloudflare" ok />
            <InfoRow label="AI Provider" value="OpenAI" ok />
          </section>
        </div>

        {/* Recent Activity */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Recent Activity</h3>

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
                <td>2 min ago</td>
                <td>Admin login</td>
                <td style={styles.ok}>Success</td>
              </tr>
              <tr>
                <td>18 min ago</td>
                <td>Site added</td>
                <td style={styles.ok}>Completed</td>
              </tr>
              <tr>
                <td>1 hr ago</td>
                <td>Chat request spike</td>
                <td style={styles.warn}>Monitored</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </Layout>
  );
}

/* =========================
   REUSABLE COMPONENTS
========================= */

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
          style={{
            ...styles.progressFill,
            width: `${value}%`
          }}
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

/* =========================
   STYLES (ENTERPRISE)
========================= */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24
  },

  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
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

  badge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    padding: "6px 12px",
    borderRadius: 999,
    background: "#ecfeff",
    color: "#0f766e",
    border: "1px solid #99f6e4"
  },

  dot: {
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
    background: "#ffffff",
    borderRadius: 10,
    padding: 20,
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
  },

  kpiLabel: {
    fontSize: 13,
    color: "#6b7280"
  },

  kpiValue: {
    fontSize: 28,
    fontWeight: 600,
    marginTop: 6
  },

  kpiHint: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: 24
  },

  card: {
    background: "#ffffff",
    borderRadius: 10,
    padding: 24,
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16
  },

  progressBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    color: "#374151"
  },

  progressBar: {
    height: 8,
    background: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    background: "#4f46e5"
  },

  cardHint: {
    marginTop: 12,
    fontSize: 12,
    color: "#9ca3af"
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    padding: "6px 0",
    borderBottom: "1px dashed #e5e7eb"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14
  },

  ok: {
    color: "#16a34a",
    fontWeight: 500
  },

  warn: {
    color: "#d97706",
    fontWeight: 500
  }
};
