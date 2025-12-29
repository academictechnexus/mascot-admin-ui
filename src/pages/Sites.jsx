import { useEffect, useState } from "react";
import { adminFetch } from "../api/adminApi";

export default function Sites() {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    adminFetch("/sites").then(setSites);
  }, []);

  return (
    <>
      <h1>Sites</h1>
      <p style={{ color: "#475569" }}>
        Manage domains, plans, and quotas
      </p>

      <table width="100%" cellPadding="12"
        style={{ background: "#fff", marginTop: 20, borderRadius: 8 }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#475569" }}>
            <th>Name</th>
            <th>Domain</th>
            <th>Plan</th>
            <th>Quota</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sites?.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.domain}</td>
              <td>{s.plan}</td>
              <td>{s.daily_quota}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
