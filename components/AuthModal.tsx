'use client';

import React from 'react';
import { AuthModalProps } from '@/types';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold mb-1">Select Access Portal</h3>
        <p className="text-slate-400 text-sm mb-6">Choose your account authorization level.</p>

        <div className="space-y-3">
          <button
            onClick={() => alert('Redirecting to Legal Aid Advocate Portal...')}
            className="w-full text-left p-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-blue-400">Legal Aid Advocate / Lawyer</div>
              <div className="text-xs text-slate-400">Review case files, petitions & AI chatbots</div>
            </div>
            <span>→</span>
          </button>

          <button
            onClick={() => alert('Redirecting to Law Enforcement Portal...')}
            className="w-full text-left p-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-emerald-400">Law Enforcement / Police</div>
              <div className="text-xs text-slate-400">Access threat risk scores & evidence transcripts</div>
            </div>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};