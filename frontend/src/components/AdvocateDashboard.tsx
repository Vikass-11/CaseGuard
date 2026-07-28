import { useState } from "react";
import { Shield, Search, Filter, Download, FileText, AlertTriangle, TrendingUp, MoreVertical } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import type { Case } from "../types/complaint";

export const AdvocateDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [cases] = useState<Case[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.victimName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || caseItem.analysis.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: string | null): string => {
    switch (severity) {
      case "high": return "severity-high";
      case "medium": return "severity-medium";
      case "low": return "severity-low";
      default: return "severity-unknown";
    }
  };

  return (
    <div className="portal-container">
      <header className="portal-header">
        <div className="header-content">
          <div className="brand">
            <Shield className="shield-icon" size={32} />
            <h1>CaseGuard</h1>
            <span className="role-badge">Advocate Dashboard</span>
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-org">{user?.organization}</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="portal-main">
        <div className="portal-sidebar">
          <nav className="sidebar-nav">
            <div className="nav-item active">
              <FileText size={20} />
              <span>Case Queue</span>
            </div>
            <div className="nav-item">
              <AlertTriangle size={20} />
              <span>High Priority</span>
            </div>
            <div className="nav-item">
              <TrendingUp size={20} />
              <span>Analytics</span>
            </div>
          </nav>
        </div>

        <div className="portal-content">
          <div className="content-header">
            <h2>Case Queue</h2>
            <p className="content-subtitle">
              Manage and review submitted cases
            </p>
          </div>

          <div className="dashboard-controls">
            <div className="search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by name or case ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-controls">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Severity</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <button className="filter-button">
                <Filter size={18} />
                More Filters
              </button>
            </div>
          </div>

          <div className="cases-table-container">
            <table className="cases-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Victim Name</th>
                  <th>Abuse Type</th>
                  <th>Severity</th>
                  <th>Risk Score</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      No cases found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((caseItem) => (
                    <tr key={caseItem._id}>
                      <td className="case-id">{caseItem._id.slice(0, 8)}...</td>
                      <td>{caseItem.victimName}</td>
                      <td>{caseItem.abuseType}</td>
                      <td>
                        <span className={`severity-badge ${getSeverityColor(caseItem.analysis.severity)}`}>
                          {caseItem.analysis.severity || "Unknown"}
                        </span>
                      </td>
                      <td>{caseItem.analysis.riskScore ?? "N/A"}</td>
                      <td>{new Date(caseItem.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="action-button">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="dashboard-actions">
            <button className="export-button">
              <Download size={18} />
              Export to PDF
            </button>
            <button className="export-button">
              <Download size={18} />
              Export to JSON
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
