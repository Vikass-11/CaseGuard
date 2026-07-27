import React, { useState, useEffect } from "react";
import { RefreshCw, AlertCircle, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import type { Case } from "../types/complaint";

export const CaseDashboard: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const fetchCases = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Since we don't have a getAllCases endpoint, we'll simulate with a placeholder
      // In a real implementation, you would call: await complaintService.getAllCases()
      // For now, we'll use an empty array or mock data
      setCases([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cases");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const getSeverityColor = (severity: string | null): string => {
    switch (severity) {
      case "high":
        return "severity-high";
      case "medium":
        return "severity-medium";
      case "low":
        return "severity-low";
      default:
        return "severity-unknown";
    }
  };

  const getSeverityIcon = (severity: string | null) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="severity-icon" size={16} />;
      case "medium":
        return <AlertCircle className="severity-icon" size={16} />;
      case "low":
        return <Shield className="severity-icon" size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="case-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <Shield className="shield-icon" size={28} />
          <h2>Case Dashboard</h2>
        </div>
        <button 
          onClick={fetchCases} 
          className="refresh-button"
          disabled={isLoading}
        >
          <RefreshCw className={isLoading ? "spinning" : ""} size={18} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {isLoading && cases.length === 0 ? (
        <div className="loading-skeleton">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      ) : cases.length === 0 ? (
        <div className="empty-state">
          <Shield className="empty-icon" size={48} />
          <h3>No Cases Found</h3>
          <p>Submit a new case to get started</p>
        </div>
      ) : (
        <div className="cases-grid">
          {cases.map((caseItem) => (
            <div 
              key={caseItem._id} 
              className={`case-card ${selectedCaseId === caseItem._id ? "selected" : ""}`}
              onClick={() => setSelectedCaseId(caseItem._id)}
            >
              <div className="case-header">
                <div className="case-id">
                  <span className="id-label">Case ID:</span>
                  <span className="id-value">{caseItem._id.slice(0, 8)}...</span>
                </div>
                {caseItem.analysis.severity && (
                  <div className={`severity-badge ${getSeverityColor(caseItem.analysis.severity)}`}>
                    {getSeverityIcon(caseItem.analysis.severity)}
                    <span className="severity-text">{caseItem.analysis.severity}</span>
                  </div>
                )}
              </div>

              <div className="case-details">
                <div className="detail-row">
                  <span className="detail-label">Victim:</span>
                  <span className="detail-value">{caseItem.victimName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Age:</span>
                  <span className="detail-value">{caseItem.age}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Abuse Type:</span>
                  <span className="detail-value">{caseItem.abuseType}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Frequency:</span>
                  <span className="detail-value">{caseItem.frequency}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Threat Level:</span>
                  <span className="detail-value">{caseItem.threatLevel}</span>
                </div>
              </div>

              <div className="case-description">
                <span className="description-label">Description:</span>
                <p className="description-text">
                  {caseItem.incidentDescription.length > 150
                    ? `${caseItem.incidentDescription.slice(0, 150)}...`
                    : caseItem.incidentDescription}
                </p>
              </div>

              {caseItem.analysis.riskScore !== null && (
                <div className="risk-score">
                  <TrendingUp size={16} />
                  <span>Risk Score: {caseItem.analysis.riskScore}/100</span>
                </div>
              )}

              {caseItem.analysis.abusePatterns.length > 0 && (
                <div className="abuse-patterns">
                  <span className="patterns-label">Detected Patterns:</span>
                  <div className="patterns-list">
                    {caseItem.analysis.abusePatterns.map((pattern: string, index: number) => (
                      <span key={index} className="pattern-tag">
                        {pattern}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="case-footer">
                <span className="created-date">
                  Created: {new Date(caseItem.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
