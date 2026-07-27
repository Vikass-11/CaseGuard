import { useState } from "react";
import { Shield } from "lucide-react";
import { ComplaintForm } from "./components/ComplaintForm";
import { CaseDashboard } from "./components/CaseDashboard";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<"form" | "dashboard">("form");

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <Shield className="logo-icon" size={32} />
          <h1 className="app-title">CaseGuard</h1>
          <p className="app-subtitle">Secure Case Management System</p>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-tab ${activeTab === "form" ? "active" : ""}`}
          onClick={() => setActiveTab("form")}
        >
          Submit Case
        </button>
        <button
          className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
      </nav>

      <main className="app-main">
        {activeTab === "form" && <ComplaintForm />}
        {activeTab === "dashboard" && <CaseDashboard />}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 CaseGuard. All rights reserved.</p>
        <p className="footer-note">Your data is protected and anonymized.</p>
      </footer>
    </div>
  );
}

export default App;
