import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "../client-tailwind.css";

import ClientSetupWizard from "../components/ClientSetupWizard";
import ClientControlPanel from "../components/ClientControlPanel";
import { getClientSetupInfo } from "../api/adminApi";

export default function ClientSetupPublic() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getClientSetupInfo(token);
        setSite(data.site);
      } catch (e) {
        console.error(e);
        setError("Invalid or expired setup link.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading setup…</div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-6 rounded-lg shadow text-red-600">
          {error || "Unable to load setup"}
        </div>
      </div>
    );
  }

  return site.setup_completed ? (
    <ClientControlPanel token={token} site={site} />
  ) : (
    <ClientSetupWizard token={token} site={site} />
  );
}
