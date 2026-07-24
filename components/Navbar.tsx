'use client';

import React from 'react';

interface NavbarProps {
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal }) => {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🛡️</span>
          <span className="font-bold text-xl tracking-tight text-white">
            CaseGuard <span className="text-blue-500 text-xs px-2 py-0.5 rounded bg-blue-950 border border-blue-800">AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <a href="#features" className="text-sm text-slate-400 hover:text-white transition">
            Features
          </a>
          <a href="#intake" className="text-sm text-slate-400 hover:text-white transition">
            Public Intake
          </a>
          <button
            onClick={onOpenAuthModal}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-blue-500/20"
          >
            Lawyer / Officer Portal
          </button>
        </div>
      </div>
    </nav>
  );
};