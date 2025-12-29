import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <ProtectedRoute>
      <Login />
    </ProtectedRoute>
  );
}
