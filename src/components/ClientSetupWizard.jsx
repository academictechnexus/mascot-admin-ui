import { useState } from "react";
import { saveClientSetup, uploadClientDocs } from "../api/adminApi";

const QUESTIONS = [
  { key: "business_name", label: "What is your business name?" },
  { key: "industry", label: "Which industry are you in?" },
  { key: "description", label: "Describe what your business does" },
  { key: "services", label: "Main products or services" },
  { key: "customers", label: "Who are your customers?" },
  { key: "common_questions", label: "What do customers usually ask?" },
  { key: "ai_help", label: "What should the AI help with?" },
  { key: "blocked", label: "What should the AI NOT answer?" },
  { key: "tone", label: "Preferred AI tone" },
  { key: "greeting", label: "AI greeting message" },
  { key: "escalation", label: "When should AI escalate to a human?" },
  { key: "hours", label: "Business working hours" },
  { key: "language", label: "Language & geography" },
  { key: "compliance", label: "Compliance or legal restrictions" }
];

export default function ClientSetupWizard({ token, site }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const q = QUESTIONS[step];
  const progress = Math.round(((step + 1) / (QUESTIONS.length + 1)) * 100);

  async function next() {
    if (step < QUESTIONS.length) {
      setStep(step + 1);
      return;
    }

    try {
      setSaving(true);
      await saveClientSetup(token, answers);
      if (files.length) {
        await uploadClientDocs(token, files);
      }
      window.location.reload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-xl rounded-xl shadow p-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          AI Setup for {site.domain}
        </h1>

        <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
          <div
            className="bg-brand h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {q ? (
          <>
            <label className="block text-slate-700 font-medium mb-2">
              {q.label}
            </label>
            <textarea
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand"
              rows={4}
              value={answers[q.key] || ""}
              onChange={e =>
                setAnswers({ ...answers, [q.key]: e.target.value })
              }
            />
          </>
        ) : (
          <>
            <label className="block text-slate-700 font-medium mb-2">
              Upload up to 3 documents (optional)
            </label>
            <input
              type="file"
              multiple
              className="block w-full text-slate-600"
              onChange={e => setFiles([...e.target.files])}
            />
          </>
        )}

        <button
          onClick={next}
          disabled={saving}
          className="mt-6 w-full bg-brand text-white py-3 rounded-lg hover:bg-brand-dark transition"
        >
          {saving
            ? "Saving…"
            : step === QUESTIONS.length
            ? "Finish Setup"
            : "Next"}
        </button>
      </div>
    </div>
  );
}
