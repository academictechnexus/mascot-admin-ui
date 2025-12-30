import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { adminFetch } from "../api/adminApi";

export default function AiControls() {
  /* ================= STATE ================= */
  const [sites, setSites] = useState([]);
  const [scope, setScope] = useState("global");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    ai_enabled: true,
    learning_enabled: true,
    temperature: 0.6,
    max_tokens: 500,
    system_prompt: "",
    blocked_topics: ""
  });

  /* ================= LOAD SITES ================= */
  useEffect(() => {
    adminFetch("/admin/sites").then(setSites).catch(() => {});
  }, []);

  /* ================= LOAD CONFIG ================= */
  useEffect(() => {
    loadConfig();
    // eslint-disable-next-line
  }, [scope]);

  async function loadConfig() {
    setLoading(true);
    setStatus("");

    try {
      if (scope === "global") {
        const data = await adminFetch("/admin/settings");
        setForm({
          ai_enabled: data.ai_enabled,
          learning_enabled: data.learning_enabled,
          temperature: data.temperature,
          max_tokens: data.max_tokens,
          system_prompt: data.system_prompt || "",
          blocked_topics: data.blocked_topics || ""
        });
      } else {
        const data = await adminFetch(`/admin/sites/${scope}/ai`);
        setForm({
          ai_enabled: data.ai_enabled ?? true,
          learning_enabled: data.learning_enabled ?? true,
          temperature: data.temperature ?? 0.6,
          max_tokens: data.max_tokens ?? 500,
          system_prompt: data.system_prompt || "",
          blocked_topics: data.blocked_topics || ""
        });
      }
    } catch {
      setStatus("❌ Failed to load configuration");
    } finally {
      setLoading(false);
    }
  }

  /* ================= SAVE CONFIG ================= */
  async function saveConfig() {
    setStatus("");
    try {
      if (scope === "global") {
        await adminFetch("/admin/settings", {
          method: "PUT",
          body: JSON.stringify(form)
        });
      } else {
        await adminFetch(`/admin/sites/${scope}/ai`, {
          method: "PUT",
          body: JSON.stringify(form)
        });
      }
      setStatus("✅ Configuration saved successfully");
    } catch {
      setStatus("❌ Save failed");
    }
  }

  /* ================= UI ================= */
  return (
    <Layout title="AI Configuration">
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>AI Controls</h1>
            <p style={styles.subtitle}>
              Configure AI behavior globally or per site
            </p>
          </div>
          <button onClick={saveConfig} style={styles.primaryBtn}>
            Save Changes
          </button>
        </div>

        {/* Scope */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Configuration Scope</h3>
          <select
            value={scope}
            onChange={e => setScope(e.target.value)}
            style={styles.select}
          >
            <option value="global">🌐 Global (All Sites)</option>
            {sites.map(site => (
              <option key={site.id} value={site.id}>
                {site.domain}
              </option>
            ))}
          </select>
          <p style={styles.hint}>
            Site-level settings override global configuration
          </p>
        </section>

        {loading ? (
          <div style={styles.card}>Loading…</div>
        ) : (
          <>
            {/* Core */}
            <section style={styles.card}>
              <h3 style={styles.sectionTitle}>Core AI Behavior</h3>

              <Toggle
                label="AI Enabled"
                checked={form.ai_enabled}
                onChange={v =>
                  setForm({ ...form, ai_enabled: v })
                }
              />

              <Toggle
                label="Self-Learning Enabled"
                checked={form.learning_enabled}
                onChange={v =>
                  setForm({ ...form, learning_enabled: v })
                }
              />

              <Field label="System Prompt">
                <textarea
                  rows={3}
                  value={form.system_prompt}
                  onChange={e =>
                    setForm({
                      ...form,
                      system_prompt: e.target.value
                    })
                  }
                />
              </Field>
            </section>

            {/* Model */}
            <section style={styles.card}>
              <h3 style={styles.sectionTitle}>Model Parameters</h3>

              <Field
                label={`Creativity (Temperature): ${form.temperature}`}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={form.temperature}
                  onChange={e =>
                    setForm({
                      ...form,
                      temperature: Number(e.target.value)
                    })
                  }
                />
              </Field>

              <Field label="Max Tokens">
                <input
                  type="number"
                  value={form.max_tokens}
                  onChange={e =>
                    setForm({
                      ...form,
                      max_tokens: Number(e.target.value)
                    })
                  }
                />
              </Field>
            </section>

            {/* Safety */}
            <section style={styles.cardDanger}>
              <h3 style={styles.sectionTitle}>Safety & Restrictions</h3>

              <Field label="Blocked Topics">
                <textarea
                  rows={2}
                  value={form.blocked_topics}
                  onChange={e =>
                    setForm({
                      ...form,
                      blocked_topics: e.target.value
                    })
                  }
                />
              </Field>

              <p style={styles.dangerHint}>
                Comma-separated keywords that the AI must refuse
              </p>
            </section>
          </>
        )}

        {status && <div>{status}</div>}
      </div>
    </Layout>
  );
}

/* ================= UI HELPERS ================= */

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
  dangerHint: { fontSize: 12, color: "#991b1b" }
};
