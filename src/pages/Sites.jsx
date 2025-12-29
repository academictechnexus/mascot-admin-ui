import { useEffect, useState } from "react";
import { adminFetch } from "../api/adminApi";

export default function Sites() {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    adminFetch("/sites").then(data => {
      if (Array.isArray(data)) setSites(data);
    });
  }, []);

  return (
    <div>
      <h1>Sites</h1>
      <p>Manage domains and plans</p>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Domain</th>
            <th>Plan</th>
            <th>Quota</th>
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
        </tbody>
      </table>
    </div>
  );
}
