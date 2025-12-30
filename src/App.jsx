import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sites from "./pages/Sites";
import AiControls from "./pages/AiControls";
import Knowledge from "./pages/Knowledge";

import ProtectedRoute from "./components/ProtectedRoute";
import { AdminProvider } from "./context/AdminContext";

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/login" element={<Login />} />

          {/* ================= PROTECTED ================= */}
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

          <Route
            path="/ai-controls"
            element={
              <ProtectedRoute>
                <AiControls />
              </ProtectedRoute>
            }
          />

          <Route
            path="/knowledge"
            element={
              <ProtectedRoute>
                <Knowledge />
              </ProtectedRoute>
            }
          />

          {/* ================= DEFAULT ================= */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  );
}
