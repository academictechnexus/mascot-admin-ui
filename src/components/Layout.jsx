import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{
        flex: 1,
        padding: 32,
        background: "#f8fafc",
        minHeight: "100vh"
      }}>
        {children}
      </main>
    </div>
  );
}
