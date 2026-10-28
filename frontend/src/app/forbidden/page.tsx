"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, Lock, HelpCircle } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#20212B] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in duration-500">
        
        {/* Insignia */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#9E6752]/10 border border-[#9E6752]/30 flex items-center justify-center text-[#9E6752] shadow-sm">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#9E6752] bg-[#9E6752]/10 px-3 py-1 rounded-full border border-[#9E6752]/20">
            HTTP 403 • ACCESS RESTRICTED
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#20212B]">
            Insufficient Privileges
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your current account credentials do not possess the elevated role required to view or perform operations on this resource.
          </p>
        </div>

        {/* Informational Guidance Box */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6DFD5] text-left text-xs space-y-2.5 text-gray-600 shadow-sm">
          <p className="font-bold text-[#20212B] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#2D4354]" />
            Security & Role Access Controls
          </p>
          <p>
            Administrative panels, sensitive forensic audit trails, and multi-tenant configurations are strictly restricted to verified <strong>ADMIN</strong> or supervisory <strong>LAWYER</strong> profiles to protect survivor records.
          </p>
          <p>
            If you believe this is an error or require temporary role elevation for an active hearing, please request permission from your organization&apos;s lead administrator.
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
            href="/contact"
            className="w-full sm:w-auto border border-[#E6DFD5] hover:bg-white text-gray-700 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-[#73766A]" />
            Contact Administrator
          </Link>
        </div>

      </div>
    </div>
  );
}
