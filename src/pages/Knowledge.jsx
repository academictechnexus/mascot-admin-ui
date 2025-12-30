import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { adminFetch } from "../api/adminApi";

export default function Knowledge() {
  /* =========================
     STATE
  ========================= */
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("global");
  const [knowledgeItems, setKnowledgeItems] = useState([]);

  const [newItem, setNewItem] = useState({
    title: "",
    content: ""
  });

  const [enabled, setEnabled] = useState(true);

  /* =========================
     LOAD SITES (FOR SITE LEVEL)
  ========================= */
  useEffect(() => {
    adminFetch("/admin/sites")
      .then(setSites)
      .catch(() => {});
  }, []);

  /* =========================
     ADD KNOWLEDGE (UI ONLY)
  ========================= */
  function addKnowledge() {
    if (!newItem.title || !newItem.content) {
      alert("Title and content are required");
      return;
    }

    setKnowledgeItems([
      ...knowledgeItems,
      {
        id: Date.now(),
        site: selectedSite,
        title: newItem.title,
        content: newItem.content
      }
    ]);

    setNewItem({ title: "", content: "" });
  }

  function removeKnowledge(id) {
    setKnowledgeItems(knowledgeItems.filter(k => k.id !== id));
  }

  return (
    <Layout>
      <div style={styles.container}>
        {/* ================= HEADER ================= */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Knowledge Base</h1>
            <p style={styles.subtitle}>
              Manage what the AI knows and learns from
            </p>
          </div>
        </div>

        {/* ================= SITE SELECTOR ================= */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Scope</h3>

          <select
            value={selectedSite}
            onChange={e => setSelectedSite(e.target.value)}
            style={styles.select}
          >
            <option value="global">🌐 Global Knowledge</option>
            {sites.map(site => (
              <option key={site.id} value={site.id}>
                🏷 {site.name} ({site.domain})
              </option>
            ))}
          </select>

          <Toggle
            label="Knowledge Enabled"
            checked={enabled}
            onChange={setEnabled}
          />

          <p style={styles.hint}>
            Site-level knowledge overrides global knowledge
          </p>
        </section>

        {/* ================= ADD KNOWLEDGE ================= */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Add Knowledge</h3>

          <input
            placeholder="Title (e.g. Services Offered)"
            value={newItem.title}
            onChange={e =>
              setNewItem({ ...newItem, title: e.target.value })
            }
            style={styles.input}
          />

          <textarea
            rows={4}
            placeholder="Knowledge content..."
            value={newItem.content}
            onChange={e =>
              setNewItem({ ...newItem, content: e.target.value })
            }
            style={styles.textarea}
          />

          <button onClick={addKnowledge} style={styles.primaryBtn}>
            Add Knowledge
          </button>
        </section>

        {/* ================= KNOWLEDGE LIST ================= */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Existing Knowledge</h3>

          {knowledgeItems.length === 0 ? (
            <p style={styles.hint}>No knowledge added yet</p>
          ) : (
            knowledgeItems.map(item => (
              <div key={item.id} style={styles.knowledgeItem}>
                <div>
                  <strong>{item.title}</strong>
                  <p style={styles.knowledgeText}>{item.content}</p>
                  <span style={styles.scopeTag}>
                    {item.site === "global" ? "Global" : "Site-specific"}
                  </span>
                </div>

                <button
                  onClick={() => removeKnowledge(item.id)}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </section>

        {/* ================= FUTURE NOTE ================= */}
        <section style={styles.futureCard}>
          <h3>🚀 Coming Next</h3>
          <ul>
            <li>PDF & document uploads</li>
            <li>Website crawling</li>
            <li>Auto-learning from conversations</li>
            <li>Per-page knowledge</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}

/* ================= COMPONENTS ================= */

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

  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: 14
  },

  futureCard: {
    background: "#f8fafc",
    padding: 24,
    borderRadius: 10,
    border: "1px dashed #cbd5f5",
    color: "#3730a3"
  },

  sectionTitle: { fontSize: 16, fontWeight: 600 },

  select: {
    padding: 8,
    borderRadius: 6
  },

  input: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #e5e7eb"
  },

  textarea: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #e5e7eb"
  },

  primaryBtn: {
    alignSelf: "flex-start",
    background: "#4f46e5",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer"
  },

  toggle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  knowledgeItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    padding: 12,
    border: "1px solid #e5e7eb",
    borderRadius: 6
  },

  knowledgeText: {
    fontSize: 13,
    color: "#374151",
    marginTop: 4
  },

  scopeTag: {
    fontSize: 11,
    color: "#6366f1"
  },

  removeBtn: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    borderRadius: 6,
    padding: "6px 10px",
    cursor: "pointer",
    height: "fit-content"
  },

  hint: { fontSize: 12, color: "#6b7280" }
};
