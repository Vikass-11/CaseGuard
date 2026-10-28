"use client";

import Link from "next/link";
import { Scale, ArrowLeft, Home, Search, HelpCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#20212B] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in duration-500">
        
        {/* Insignia */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#2D4354]/10 border border-[#2D4354]/30 flex items-center justify-center text-[#2D4354] shadow-sm">
          <Scale className="w-10 h-10 text-[#2D4354]" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#9E6752] bg-[#9E6752]/10 px-3 py-1 rounded-full border border-[#9E6752]/20">
            HTTP 404 • RECORD NOT LOCATED
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#20212B]">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            The case file, litigation brief, or page address you requested does not exist or may have been archived under strict tenant retention rules.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-[#2D4354] hover:bg-[#2D4354]/90 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Home className="w-4 h-4 text-[#FED7A5]" />
            Return to Dashboard
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto border border-[#E6DFD5] hover:bg-white text-gray-700 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#73766A]" />
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

