'use client';

import React from 'react';

interface HeroProps {
  onOpenAuthModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAuthModal }) => {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
      <span className="inline-block px-3 py-1 bg-slate-800 text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border border-slate-700">
        AI-Assisted Legal Triage & Threat Recognition
      </span>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-white">
        Empowering Legal Aid & Public Safety with Safe AI
      </h1>
      <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
        CaseGuard automates domestic violence risk scoring, evidence transcription, and legal brief generation while guaranteeing complete client PII confidentiality.
      </p>
      <div className="flex justify-center gap-4">
        <a
          href="#intake"
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Submit Confidential Complaint
        </a>
        <button
          onClick={onOpenAuthModal}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-6 py-3 rounded-xl font-semibold transition"
        >
          Access Case Dashboard
        </button>
      </div>
    </section>
  );
};