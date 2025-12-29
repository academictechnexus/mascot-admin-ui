export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    window.location.href = "/login";
    return null;
  }

  return children;
}
