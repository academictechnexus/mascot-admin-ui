export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <p style={{ color: "#475569" }}>
        Overview of your AI assistant platform
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 20,
        marginTop: 30
      }}>
        {[
          ["Total Sites", "—"],
          ["Messages Today", "—"],
          ["Active Plans", "—"],
          ["Leads Captured", "—"]
        ].map(([title, value]) => (
          <div key={title} style={{
            background: "#fff",
            padding: 20,
            borderRadius: 8
          }}>
            <p style={{ color: "#64748b" }}>{title}</p>
            <h2>{value}</h2>
          </div>
        ))}
      </div>
    </>
  );
}
