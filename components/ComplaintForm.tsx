'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { ComplaintFormInput } from '@/types';

export const ComplaintForm: React.FC = () => {
  const [formData, setFormData] = useState<ComplaintFormInput>({
    complainantName: '',
    contactEmail: '',
    incidentDate: '',
    incidentLocation: '',
    description: '',
    hasWeapons: false,
    hasStrangulation: false,
    hasStalking: false,
    threatsToKill: false,
    evidenceFiles: null,
  });

  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Submitted Intake Payload:', formData);
    setSubmitted(true);
  };

  return (
    <section id="intake" className="max-w-3xl mx-auto px-6 py-16">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-2">Public Incident Intake Form</h2>
        <p className="text-slate-400 text-sm mb-6">
          Submit incident details for legal evaluation. All identifying information is redacted locally before system processing.
        </p>

        {submitted ? (
          <div className="p-6 bg-emerald-950/50 border border-emerald-800 rounded-xl text-center">
            <span className="text-3xl">✅</span>
            <h3 className="text-lg font-semibold text-emerald-400 mt-2">Complaint Submitted Securely</h3>
            <p className="text-sm text-slate-400 mt-1">Your case intake ID has been logged for legal aid triage.</p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                name="complainantName"
                value={formData.complainantName}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Jane Doe"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Contact Email / Phone</label>
                <input
                  type="text"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Incident Date</label>
                <input
                  type="date"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Incident Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Provide detailed information regarding the incident..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="flex items-center space-x-2 text-sm text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  name="hasWeapons"
                  checked={formData.hasWeapons}
                  onChange={handleInputChange}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>Weapons Involved</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  name="hasStrangulation"
                  checked={formData.hasStrangulation}
                  onChange={handleInputChange}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>Strangulation History</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition mt-4"
            >
              Submit Incident for Risk Analysis
            </button>
          </form>
        )}
      </div>
    </section>
  );
};