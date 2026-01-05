import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/Layout";
import { saveSiteSetup, uploadSiteDocs } from "../api/adminApi";

const QUESTIONS = [
  { key: "business_name", label: "What is your business name?" },
  { key: "industry", label: "Which industry best describes your business?" },
  { key: "business_description", label: "Describe what your business does" },
  { key: "services", label: "List your main products or services" },
  { key: "target_customers", label: "Who are your target customers?" },
  { key: "common_questions", label: "What questions do customers usually ask?" },
  { key: "ai_help", label: "What should the AI help users with?" },
  { key: "forbidden_topics", label: "What should the AI NOT answer?" },
  { key: "escalation_rules", label: "When should AI escalate to a human?" },
  { key: "tone", label: "Preferred AI tone" },
  { key: "greeting", label: "AI greeting message" },
  { key: "working_hours", label: "Business working hours" },
  { key: "geography_language", label: "Geography & language" },
  { key: "compliance", label: "Compliance or legal restrictions" }
];

export default function ClientAiSetup() {
  const { siteId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  async function next() {
    if (step < QUESTIONS.length) {
      setStep(step + 1);
      return;
    }

    try {
      setSaving(true);
      await saveSiteSetup(siteId, answers);
      if (files.length) {
        await uploadSiteDocs(siteId, files);
      }
      navigate("/sites");
    } finally {
      setSaving(false);
    }
  }

  const q = QUESTIONS[step];

  return (
    <Layout title="Client AI Setup">
      <h2>AI Setup — Step {step + 1} of {QUESTIONS.length + 1}</h2>

      {q ? (
        <>
          <p>{q.label}</p>
          <textarea
            rows={4}
            value={answers[q.key] || ""}
            onChange={e =>
              setAnswers({ ...answers, [q.key]: e.target.value })
            }
          />
        </>
      ) : (
        <>
          <p>Upload up to 3 documents (PDF, DOC, TXT)</p>
          <input
            type="file"
            multiple
            onChange={e => setFiles([...e.target.files])}
          />
        </>
      )}

      <button onClick={next} disabled={saving}>
        {saving ? "Saving…" : step === QUESTIONS.length ? "Finish Setup" : "Next"}
      </button>
    </Layout>
  );
}
