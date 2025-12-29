export default function Sidebar() {
  return (
    <aside style={{
      width: 240,
      background: "#0f172a",
      color: "#e5e7eb",
      height: "100vh",
      padding: 20
    }}>
      <h2 style={{ color: "#fff", marginBottom: 30 }}>
        Mascot Admin
      </h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <a href="/" style={{ color: "#e5e7eb" }}>Dashboard</a>
        <a href="/sites" style={{ color: "#e5e7eb" }}>Sites</a>

        <button
          style={{ marginTop: 30 }}
          onClick={() => {
            localStorage.removeItem("admin_token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
