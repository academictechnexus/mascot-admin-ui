import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sites from "./pages/Sites";
import AiControls from "./pages/AiControls";
import Knowledge from "./pages/Knowledge";
import Settings from "./pages/Settings";
import Conversations from "./pages/Conversations";

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

          {/* STEP 1 — GLOBAL SETTINGS */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* STEP 2 — PER-SITE AI CONTROLS */}
          <Route
            path="/ai-controls"
            element={
              <ProtectedRoute>
                <AiControls />
              </ProtectedRoute>
            }
          />

          {/* STEP 3 — CONVERSATION VIEWER */}
          <Route
            path="/conversations"
            element={
              <ProtectedRoute>
                <Conversations />
              </ProtectedRoute>
            }
          />

          {/* STEP 3 — KNOWLEDGE VIEWER */}
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
