import React, { useState } from "react";
import { Shield, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import type { CaseCreate } from "../types/complaint";
import { complaintService } from "../services/complaintService";

export const ComplaintForm: React.FC = () => {
  const [formData, setFormData] = useState<CaseCreate>({
    victimName: "",
    age: 0,
    abuseType: "",
    incidentDescription: "",
    frequency: "",
    threatLevel: "",
    statement: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CaseCreate, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CaseCreate, string>> = {};

    if (!formData.victimName.trim()) {
      newErrors.victimName = "Victim name is required";
    }

    if (formData.age <= 0 || formData.age > 120) {
      newErrors.age = "Please enter a valid age";
    }

    if (!formData.abuseType.trim()) {
      newErrors.abuseType = "Abuse type is required";
    }

    if (!formData.incidentDescription.trim()) {
      newErrors.incidentDescription = "Incident description is required";
    }

    if (!formData.frequency.trim()) {
      newErrors.frequency = "Frequency is required";
    }

    if (!formData.threatLevel.trim()) {
      newErrors.threatLevel = "Threat level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await complaintService.createCase(formData);
      setSubmitStatus("success");
      
      // Reset form on success
      setFormData({
        victimName: "",
        age: 0,
        abuseType: "",
        incidentDescription: "",
        frequency: "",
        threatLevel: "",
        statement: ""
      });
      
      console.log("Case created:", response);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit case");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: CaseCreate) => ({
      ...prev,
      [name]: name === "age" ? (value === "" ? 0 : parseInt(value, 10)) : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof CaseCreate]) {
      setErrors((prev: Partial<Record<keyof CaseCreate, string>>) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="complaint-form-container">
      <div className="form-header">
        <Shield className="shield-icon" size={32} />
        <h2>Submit a Confidential Case</h2>
        <p className="form-subtitle">Your information will be protected and anonymized</p>
      </div>

      {submitStatus === "success" && (
        <div className="alert alert-success">
          <CheckCircle size={20} />
          <span>Case submitted successfully. Your case ID has been generated.</span>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="complaint-form">
        <div className="form-group">
          <label htmlFor="victimName">Victim Name *</label>
          <input
            type="text"
            id="victimName"
            name="victimName"
            value={formData.victimName}
            onChange={handleChange}
            className={errors.victimName ? "input-error" : ""}
            placeholder="Enter victim's name"
          />
          {errors.victimName && <span className="error-text">{errors.victimName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age *</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
            className={errors.age ? "input-error" : ""}
            placeholder="Enter age"
            min="0"
            max="120"
          />
          {errors.age && <span className="error-text">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="abuseType">Type of Abuse *</label>
          <select
            id="abuseType"
            name="abuseType"
            value={formData.abuseType}
            onChange={handleChange}
            className={errors.abuseType ? "input-error" : ""}
          >
            <option value="">Select type of abuse</option>
            <option value="physical">Physical Abuse</option>
            <option value="emotional">Emotional Abuse</option>
            <option value="sexual">Sexual Abuse</option>
            <option value="financial">Financial Abuse</option>
            <option value="neglect">Neglect</option>
            <option value="other">Other</option>
          </select>
          {errors.abuseType && <span className="error-text">{errors.abuseType}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="incidentDescription">Incident Description *</label>
          <textarea
            id="incidentDescription"
            name="incidentDescription"
            value={formData.incidentDescription}
            onChange={handleChange}
            className={errors.incidentDescription ? "input-error" : ""}
            placeholder="Describe the incident in detail"
            rows={4}
          />
          {errors.incidentDescription && <span className="error-text">{errors.incidentDescription}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="frequency">Frequency *</label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className={errors.frequency ? "input-error" : ""}
          >
            <option value="">Select frequency</option>
            <option value="once">Once</option>
            <option value="few_times">A few times</option>
            <option value="ongoing">Ongoing</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          {errors.frequency && <span className="error-text">{errors.frequency}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="threatLevel">Threat Level *</label>
          <select
            id="threatLevel"
            name="threatLevel"
            value={formData.threatLevel}
            onChange={handleChange}
            className={errors.threatLevel ? "input-error" : ""}
          >
            <option value="">Select threat level</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          {errors.threatLevel && <span className="error-text">{errors.threatLevel}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="statement">Additional Statement (Optional)</label>
          <textarea
            id="statement"
            name="statement"
            value={formData.statement}
            onChange={handleChange}
            placeholder="Any additional information you would like to share"
            rows={3}
          />
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="spinner" size={20} />
              Submitting...
            </>
          ) : (
            "Submit Case"
          )}
        </button>
      </form>
    </div>
  );
};
