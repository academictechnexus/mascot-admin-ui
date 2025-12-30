import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { adminFetch } from "../api/adminApi";

export default function AiControls() {
  /* =========================
     STATE
  ========================= */
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("global");

  const [config, setConfig] = useState({
    enabled: true,
    learningEnabled: true,
    tone: "professional",
    temperature: 0.6,
    maxTokens: 500,
    blockedTopics: "",
    systemPrompt: "You are a helpful AI assistant."
  });

  /* =========================
     LOAD SITES (for site-level controls)
  ========================= */
  useEffect(() => {
    adminFetch("/admin/sites").then(setSites).catch(() => {});
  }, []);

  /* =========================
     SAVE (UI ONLY FOR NOW)
  ========================= */
  function saveConfig() {
    alert(
      "AI configuration saved (UI-ready).\n\nNext step: connect to backend persistence."
    );
  }

  return (
    <Layout>
      <div style={styles.container}>
        {/* ================= HEADER ================= */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>AI Controls</h1>
            <p style={styles.subtitle}>
              Configure AI behavior globally or per site
            </p>
          </div>

          <button style={styles.primaryBtn} onClick={saveConfig}>
            Save Changes
          </button>
        </div>

        {/* ================= SCOPE SELECTOR ================= */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Configuration Scope</h3>

          <select
            value={selectedSite}
            onChange={e => setSelectedSite(e.target.value)}
            style={styles.select}
          >
            <option value="global">🌐 Global (All Sites)</option>
            {sites.map(site => (
              <option key={site.id} value={site.id}>
                🏷 {site.name} ({site.domain})
              </option>
            ))}
          </select>

          <p style={styles.hint}>
            Site-level settings override global configuration
          </p>
        </section>

        {/* ================= CORE CONTROLS ================= */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Core AI Behavior</h3>

          <Toggle
            label="AI Enabled"
            checked={config.enabled}
            onChange={v => setConfig({ ...config, enabled: v })}
          />

          <Toggle
            label="Self-Learning Enabled"
            checked={config.learningEnabled}
            onChange={v => setConfig({ ...config, learningEnabled: v })}
          />

          <Field label="AI Tone">
            <select
              value={config.tone}
              onChange={e =>
                setConfig({ ...config, tone: e.target.value })
              }
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="sales">Sales-Focused</option>
              <option value="support">Customer Support</option>
            </select>
          </Field>

          <Field label="System Prompt">
            <textarea
              rows={3}
              value={config.systemPrompt}
              onChange={e =>
                setConfig({ ...config, systemPrompt: e.target.value })
              }
            />
          </Field>
        </section>

        {/* ================= MODEL CONTROLS ================= */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Model Parameters</h3>

          <Field label={`Creativity (Temperature): ${config.temperature}`}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature}
              onChange={e =>
                setConfig({
                  ...config,
                  temperature: Number(e.target.value)
                })
              }
            />
          </Field>

          <Field label="Max Response Length (tokens)">
            <input
              type="number"
              min="100"
              max="2000"
              value={config.maxTokens}
              onChange={e =>
                setConfig({
                  ...config,
                  maxTokens: Number(e.target.value)
                })
              }
            />
          </Field>
        </section>

        {/* ================= SAFETY ================= */}
        <section style={styles.cardDanger}>
          <h3 style={styles.sectionTitle}>Safety & Restrictions</h3>

          <Field label="Blocked Topics / Keywords">
            <textarea
              rows={2}
              placeholder="e.g. pricing negotiation, legal advice"
              value={config.blockedTopics}
              onChange={e =>
                setConfig({
                  ...config,
                  blockedTopics: e.target.value
                })
              }
            />
          </Field>

          <p style={styles.dangerHint}>
            Requests containing these terms will be ignored or redirected
          </p>
        </section>

        {/* ================= KILL SWITCH ================= */}
        <section style={styles.killSwitch}>
          <div>
            <h3 style={styles.sectionTitle}>Emergency Kill Switch</h3>
            <p style={styles.hint}>
              Instantly disable AI responses for this scope
            </p>
          </div>

          <button
            style={styles.killBtn}
            onClick={() =>
              alert("Kill switch triggered (UI only)")
            }
          >
            Disable AI
          </button>
        </section>
      </div>
    </Layout>
  );
}

/* ================= COMPONENTS ================= */

function Field({ label, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div style={styles.toggle}>
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
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

  title: { fontSize: 24, fontWeight: 600, margin: 0 },
  subtitle: { fontSize: 14, color: "#6b7280" },

  primaryBtn: {
    background: "#4f46e5",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer"
  },

  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: 14
  },

  cardDanger: {
    background: "#fff1f2",
    padding: 24,
    borderRadius: 10,
    border: "1px solid #fecaca",
    display: "flex",
    flexDirection: "column",
    gap: 12
  },

  sectionTitle: { fontSize: 16, fontWeight: 600 },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },

  label: { fontSize: 13, color: "#374151" },

  select: {
    padding: 8,
    borderRadius: 6
  },

  toggle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  hint: { fontSize: 12, color: "#6b7280" },
  dangerHint: { fontSize: 12, color: "#991b1b" },

  killSwitch: {
    background: "#0f172a",
    color: "#fff",
    padding: 20,
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  killBtn: {
    background: "#dc2626",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer"
  }
};
