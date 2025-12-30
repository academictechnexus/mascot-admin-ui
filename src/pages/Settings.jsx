import { useEffect, useState } from "react";
import { adminFetch } from "../api/adminApi";
import Layout from "../components/Layout";

export default function Settings() {
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await adminFetch("/admin/settings");
      setForm(data);
    } catch {
      setStatus({ type: "error", msg: "Failed to load settings" });
    }
  }

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function saveSettings() {
    setSaving(true);
    setStatus({ type: "", msg: "" });

    try {
      await adminFetch("/admin/settings", {
        method: "PUT",
        body: JSON.stringify({
          demo_days: Number(form.demo_days),
          demo_daily_quota: Number(form.demo_daily_quota),
          ai_enabled: !!form.ai_enabled,
          learning_enabled: !!form.learning_enabled,
          temperature: Number(form.temperature),
          max_tokens: Number(form.max_tokens),
          system_prompt: form.system_prompt || "",
          blocked_topics: form.blocked_topics || ""
        })
      });

      setStatus({ type: "success", msg: "Settings saved successfully" });
    } catch (err) {
      setStatus({
        type: "error",
        msg: "Save failed. Please check backend connectivity."
      });
    } finally {
      setSaving(false);
    }
  }

  if (!form) return null;

  return (
    <Layout title="Global AI Settings">
      <div style={styles.page}>
        <Section title="AI Controls">
          <Toggle
            label="AI Enabled"
            checked={form.ai_enabled}
            onChange={v => update("ai_enabled", v)}
          />
          <Toggle
            label="Learning Enabled"
            checked={form.learning_enabled}
            onChange={v => update("learning_enabled", v)}
          />
        </Section>

        <Section title="Demo Limits">
          <Input
            label="Demo Days"
            value={form.demo_days}
            onChange={v => update("demo_days", v)}
          />
          <Input
            label="Demo Daily Quota"
            value={form.demo_daily_quota}
            onChange={v => update("demo_daily_quota", v)}
          />
        </Section>

        <Section title="AI Behavior">
          <Input
            label="Temperature"
            value={form.temperature}
            step="0.1"
            onChange={v => update("temperature", v)}
          />
          <Input
            label="Max Tokens"
            value={form.max_tokens}
            onChange={v => update("max_tokens", v)}
          />
        </Section>

        <Section title="Prompts & Safety">
          <Textarea
            label="System Prompt"
            value={form.system_prompt || ""}
            onChange={v => update("system_prompt", v)}
          />
          <Textarea
            label="Blocked Topics (comma separated)"
            value={form.blocked_topics || ""}
            onChange={v => update("blocked_topics", v)}
          />
        </Section>

        <div style={styles.footer}>
          <button
            onClick={saveSettings}
            disabled={saving}
            style={styles.saveBtn}
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>

          {status.msg && (
            <div
              style={{
                ...styles.status,
                ...(status.type === "success"
                  ? styles.success
                  : styles.error)
              }}
            >
              {status.msg}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

/* ================= UI COMPONENTS ================= */

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label style={styles.row}>
      <span style={styles.label}>{label}</span>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={e => onChange(e.target.checked)}
      />
    </label>
  );
}

function Input({ label, value, onChange, ...rest }) {
  return (
    <label style={styles.row}>
      <span style={styles.label}>{label}</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={styles.input}
        {...rest}
      />
    </label>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <label style={{ ...styles.row, alignItems: "flex-start" }}>
      <span style={styles.label}>{label}</span>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        style={styles.textarea}
      />
    </label>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: { maxWidth: 900 },

  section: {
    background: "#020617",
    border: "1px solid #1e293b",
    padding: 20,
    borderRadius: 10,
    marginBottom: 24
  },

  sectionTitle: {
    marginBottom: 14,
    color: "#e5e7eb",
    fontSize: 15
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 14
  },

  label: {
    color: "#cbd5f5",
    fontSize: 14
  },

  input: {
    width: 160,
    background: "#020617",
    border: "1px solid #334155",
    color: "#e5e7eb",
    padding: "6px 8px",
    borderRadius: 6
  },

  textarea: {
    width: 420,
    background: "#020617",
    border: "1px solid #334155",
    color: "#e5e7eb",
    padding: 8,
    borderRadius: 6
  },

  footer: {
    marginTop: 20,
    display: "flex",
    gap: 16,
    alignItems: "center"
  },

  saveBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "10px 22px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer"
  },

  status: {
    fontSize: 14,
    padding: "8px 12px",
    borderRadius: 6
  },

  success: {
    background: "#052e16",
    color: "#86efac",
    border: "1px solid #14532d"
  },

  error: {
    background: "#450a0a",
    color: "#fca5a5",
    border: "1px solid #7f1d1d"
  }
};
