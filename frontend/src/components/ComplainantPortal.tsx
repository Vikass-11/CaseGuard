import { Shield, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ComplaintForm } from "./ComplaintForm";
import LegalAssistantBot from "./LegalAssistantBot";

export const ComplainantPortal: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="portal-container">
      <header className="portal-header">
        <div className="header-content">
          <div className="brand">
            <Shield className="shield-icon" size={32} />
            <h1>CaseGuard</h1>
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="portal-main relative">
        <div className="portal-sidebar">
          <nav className="sidebar-nav">
            <div className="nav-item active">
              <FileText size={20} />
              <span>Submit Case</span>
            </div>
            <div className="nav-item">
              <Clock size={20} />
              <span>My Cases</span>
            </div>
            <div className="nav-item">
              <CheckCircle size={20} />
              <span>Status Updates</span>
            </div>
          </nav>
        </div>

        <div className="portal-content">
          <div className="content-header">
            <h2>Submit New Case</h2>
            <p className="content-subtitle">
              Your information will be protected and anonymized
            </p>
          </div>

          <div className="case-form-container relative">
            <ComplaintForm />
          </div>

          <div className="info-cards">
            <div className="info-card">
              <Shield className="card-icon" size={24} />
              <h3>Privacy Protected</h3>
              <p>Your personal information is encrypted and anonymized before processing.</p>
            </div>
            <div className="info-card">
              <CheckCircle className="card-icon" size={24} />
              <h3>Secure Submission</h3>
              <p>All case submissions are transmitted through secure encrypted channels.</p>
            </div>
            <div className="info-card">
              <AlertCircle className="card-icon" size={24} />
              <h3>24/7 Support</h3>
              <p>Get help anytime with our dedicated support team for urgent cases.</p>
            </div>
          </div>
        </div>
        
        {/* Floating AI Assistant */}
        <LegalAssistantBot />
      </main>
    </div>
  );
};

