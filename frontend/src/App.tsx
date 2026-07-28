import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ComplainantPortal } from "./components/ComplainantPortal";
import { AdvocateDashboard } from "./components/AdvocateDashboard";
import "./auth.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/complainant-portal"
            element={
              <ProtectedRoute allowedRoles={["complainant"]}>
                <ComplainantPortal />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/advocate-dashboard"
            element={
              <ProtectedRoute allowedRoles={["advocate", "admin"]}>
                <AdvocateDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdvocateDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
