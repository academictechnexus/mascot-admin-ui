import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { adminFetch } from "../api/adminApi";

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // ✅ added (non-breaking)
  const [showModal, setShowModal] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [error, setError] = useState(null); // ✅ added

  const [form, setForm] = useState({
    domain: "",
    plan: "demo",
    daily_quota: 50,
    status: "active"
  });

  /* =========================
     LOAD SITES
  ========================= */
  async function loadSites() {
    try {
      setLoading(true);
      setError(null);

      const data = await adminFetch("/admin/sites");

      // Defensive: ensure array
      setSites(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load sites", e);
      setError("Failed to load sites");
      setSites([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSites();
  }, []);

  /* =========================
     MODAL HANDLERS
  ========================= */
  function openAdd() {
    setEditingSite(null);
    setError(null);
    setForm({
      domain: "",
      plan: "demo",
      daily_quota: 50,
      status: "active"
    });
    setShowModal(true);
  }

  function openEdit(site) {
    setEditingSite(site);
    setError(null);
    setForm({
      domain: site.domain,
      plan: site.plan,
      daily_quota: site.daily_quota,
      status: site.status
    });
    setShowModal(true);
  }

  /* =========================
     SAVE SITE (ADD / EDIT)
  ========================= */
  async function saveSite() {
    try {
      setSaving(true);
      setError(null);

      if (editingSite) {
        // UPDATE EXISTING SITE
        await adminFetch(`/admin/sites/${editingSite.id}`, {
          method: "PUT",
          body: JSON.stringify({
            plan: form.plan,
            daily_quota: Number(form.daily_quota),
            status: form.status
          })
        });
      } else {
        // CREATE NEW SITE
        const cleanDomain = form.domain
          .replace(/^https?:\/\//, "")
          .replace(/\/$/, "")
          .toLowerCase()
          .trim();

        const payload = {
          // ✅ backend-compatible payload
          name: cleanDomain.split(".")[0],
          domain: cleanDomain,
          plan: form.plan,
          daily_quota: Number(form.daily_quota),
          status: form.status
        };

        await adminFetch("/admin/sites", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }

      // ✅ reload sites AFTER save
      await loadSites();

      setShowModal(false);
    } catch (e) {
      console.error("Save site failed", e);

      if (e?.message === "site_already_exists") {
        setError("Site already exists");
      } else {
        setError("Failed to save site");
      }
    } finally {
      setSaving(false);
    }
  }

  /* =========================
     TOGGLE STATUS
  ========================= */
  async function toggleStatus(site) {
    try {
      setLoading(true);
      setError(null);

      await adminFetch(`/admin/sites/${site.id}`, {
        method: "PUT",
        body: JSON.stringify({
          plan: site.plan,
          daily_quota: site.daily_quota,
          status: site.status === "active" ? "disabled" : "active"
        })
      });

      await loadSites();
    } catch (e) {
      console.error("Toggle status failed", e);
      setError("Failed to update site status");
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <Layout title="Sites">
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Sites</h1>
            <p style={styles.subtitle}>Manage tenants, plans, and quotas</p>
          </div>
          <button onClick={openAdd} style={styles.primaryBtn}>
            + Add Site
          </button>
        </div>

        {error && (
          <div style={{ ...styles.card, color: "#991b1b" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={styles.card}>Loading…</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Plan</th>
                  <th>Daily Quota</th>
                  <th>Status</th>
                  <th align="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sites.map(site => (
                  <tr key={site.id}>
                    <td>{site.domain}</td>
                    <td>{site.plan}</td>
                    <td>{site.daily_quota}</td>
                    <td>
                      <span
                        style={{
                          ...styles.badge,
                          ...(site.status === "active"
                            ? styles.active
                            : styles.disabled)
                        }}
                      >
                        {site.status}
                      </span>
                    </td>
                    <td align="right">
                      <button
                        style={styles.actionBtn}
                        onClick={() => openEdit(site)}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.dangerBtn}
                        onClick={() => toggleStatus(site)}
                      >
                        {site.status === "active" ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}

                {sites.length === 0 && (
                  <tr>
                    <td colSpan="5">No sites created</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>{editingSite ? "Edit Site" : "Add Site"}</h3>

              <input
                placeholder="Domain (example.com)"
                value={form.domain}
                disabled={!!editingSite}
                onChange={e =>
                  setForm({ ...form, domain: e.target.value })
                }
              />

              <select
                value={form.plan}
                onChange={e =>
                  setForm({ ...form, plan: e.target.value })
                }
              >
                <option value="demo">Demo</option>
                <option value="paid">Paid</option>
              </select>

              <input
                type="number"
                placeholder="Daily quota"
                value={form.daily_quota}
                onChange={e =>
                  setForm({
                    ...form,
                    daily_quota: Number(e.target.value)
                  })
                }
              />

              <div style={styles.modalActions}>
                <button onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  onClick={saveSite}
                  style={styles.primaryBtn}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  container: { display: "flex", flexDirection: "column", gap: 20 },
  header: { display: "flex", justifyContent: "space-between" },
  title: { margin: 0 },
  subtitle: { color: "#64748b" },

  primaryBtn: {
    padding: "8px 14px",
    background: "#4f46e5",
    color: "#fff",
    borderRadius: 6,
    border: "none",
    cursor: "pointer"
  },

  tableWrap: {
    background: "#fff",
    borderRadius: 8,
    border: "1px solid #e5e7eb"
  },

  table: { width: "100%", borderCollapse: "collapse" },

  badge: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12
  },

  active: { background: "#dcfce7", color: "#166534" },
  disabled: { background: "#fee2e2", color: "#991b1b" },

  actionBtn: {
    marginRight: 8,
    padding: "6px 10px"
  },

  dangerBtn: {
    padding: "6px 10px",
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca"
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  modal: {
    background: "#fff",
    padding: 24,
    borderRadius: 8,
    width: 360,
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10
  },

  card: {
    padding: 20,
    background: "#fff",
    borderRadius: 8
  }
};
