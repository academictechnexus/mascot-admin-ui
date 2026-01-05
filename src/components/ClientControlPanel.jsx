import { useState } from "react";

export default function ClientControlPanel({ site }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-slate-800 mb-6">
          AI Control Panel
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-medium text-lg mb-2">Status</h2>
            <p className="text-slate-600">
              AI is currently{" "}
              <strong>{paused ? "Paused" : "Active"}</strong>
            </p>
            <button
              onClick={() => setPaused(!paused)}
              className="mt-4 px-4 py-2 rounded bg-brand text-white"
            >
              {paused ? "Resume AI" : "Pause AI"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-medium text-lg mb-2">Knowledge</h2>
            <p className="text-slate-600">
              Manage documents and website learning
            </p>
            <button className="mt-4 px-4 py-2 rounded border">
              Upload New Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
