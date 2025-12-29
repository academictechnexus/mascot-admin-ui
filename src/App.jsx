import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sites from "./pages/Sites";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const token = localStorage.getItem("admin_token");
  return token ? (
    <ProtectedRoute>
      <Dashboard />
      <Sites />
    </ProtectedRoute>
  ) : (
    <Login />
  );
}
