import { useEffect, useState } from "react";
import { adminFetch } from "../api/adminApi";

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/sites")
      .then(data => {
        if (Array.isArray(data)) setSites(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1>Sites</h1>

        <button
          style={{
            padding: "8px 14px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: 6
          }}
        >
          + Add Site
        </button>
      </div>

      <p style={{ color: "#64748b" }}>
        Manage customer websites, plans, and quotas
      </p>

      {loading ? (
        <p>Loading sites…</p>
      ) : (
        <table
          width="100%"
          cellPadding="10"
          style={{
            background: "#fff",
            borderRadius: 8,
            marginTop: 20
          }}
        >
          <thead style={{ textAlign: "left", color: "#475569" }}>
            <tr>
              <th>Name</th>
              <th>Domain</th>
              <th>Plan</th>
              <th>Daily Quota</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {sites.map(site => (
              <tr key={site.id}>
                <td>{site.name}</td>
                <td>{site.domain}</td>
                <td>{site.plan}</td>
                <td>{site.daily_quota}</td>
                <td>{site.status}</td>
              </tr>
            ))}

            {sites.length === 0 && (
              <tr>
                <td colSpan="5">No sites created yet</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
