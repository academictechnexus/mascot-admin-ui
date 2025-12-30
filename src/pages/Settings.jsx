import { useEffect, useState } from "react";
import { adminFetch } from "../api/adminApi";
import Layout from "../components/Layout";

export default function Settings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await adminFetch("/admin/settings");
    setForm(data);
  }

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage("");

    try {
      await adminFetch("/admin/settings", {
        method: "PUT",
        body: JSON.stringify(form)
      });

      setMessage("✅ Settings saved successfully");
    } catch (err) {
      setMessage("❌ Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (!form) return null;

  return (
    <Layout title="Global Settings">
      <div style={styles.container}>
        <Section title="AI Controls">
          <Toggle
            label="AI Enabled"
            value={form.ai_enabled}
            onChange={v => update("ai_enabled", v)}
          />
          <Toggle
            label="Learning Enabled"
            value={form.learning_enabled}
            onChange={v => update("learning_enabled", v)}
          />
        </Section>

        <Section title="Demo Limits">
          <Input
            label="Demo Days"
            type="number"
            value={form.demo_days}
            onChange={v => update("demo_days", Number(v))}
          />
          <Input
            label="Demo Daily Quota"
            type="number"
            value={form.demo_daily_quota}
            onChange={v => update("demo_daily_quota", Number(v))}
          />
        </Section>

        <Section title="AI Behavior">
          <Input
            label="Temperature"
            type="number"
            step="0.1"
            value={form.temperature}
            onChange={v => update("temperature", Number(v))}
          />
          <Input
            label="Max Tokens"
            type="number"
            value={form.max_tokens}
            onChange={v => update("max_tokens", Number(v))}
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
          <button onClick={save} disabled={saving} style={styles.saveBtn}>
            {saving ? "Saving…" : "Save Settings"}
          </button>
          {message && <div style={styles.message}>{message}</div>}
        </div>
      </div>
    </Layout>
  );
}

/* ---------- UI HELPERS ---------- */

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label style={styles.row}>
      <span>{label}</span>
      <input
        type="checkbox"
        checked={!!value}
        onChange={e => onChange(e.target.checked)}
      />
    </label>
  );
}

function Input({ label, ...props }) {
  return (
    <label style={styles.row}>
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

function Textarea({ label, ...props }) {
  return (
    <label style={{ ...styles.row, alignItems: "flex-start" }}>
      <span>{label}</span>
      <textarea {...props} rows={4} />
    </label>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  container: { maxWidth: 900 },
  section: {
    background: "#0f172a",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20
  },
  sectionTitle: { marginBottom: 12 },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12
  },
  footer: { marginTop: 20 },
  saveBtn: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 6
  },
  message: { marginTop: 10 }
};
