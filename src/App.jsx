import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sites from "./pages/Sites";
import ProtectedRoute from "./components/ProtectedRoute";
import { AdminProvider } from "./context/AdminContext";

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sites"
            element={
              <ProtectedRoute>
                <Sites />
              </ProtectedRoute>
            }
          />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  );
}
