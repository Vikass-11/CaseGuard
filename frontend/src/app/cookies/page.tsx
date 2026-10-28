"use client";

import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { Cookie, ShieldCheck, Lock, Trash2, AlertTriangle } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#20212B] flex flex-col font-sans">
      <PublicNavbar />

      {/* Hero Header */}
      <section className="bg-[#20212B] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#2D4354]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D4354] border border-[#FED7A5]/30 text-xs font-bold uppercase tracking-widest text-[#FED7A5]">
            <Cookie className="w-3.5 h-3.5 text-[#FED7A5]" />
            DATA STORAGE TRANSPARENCY
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Cookie & Local Storage Policy
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
            CaseGuard operates with zero commercial trackers, zero behavioral ad cookies, and minimal essential session storage.
          </p>
          <p className="text-xs text-[#FED7A5] font-semibold tracking-wide">
            Updated: October 2026 • Privacy-by-Design Compliance
          </p>
        </div>
      </section>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-10 leading-relaxed text-gray-700">
        
        {/* Anti-Tracking Commitment */}
        <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A6B53]">
            <ShieldCheck className="w-4 h-4 text-[#3A6B53]" />
            <span>Zero Third-Party Advertising Trackers</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            CaseGuard does not use Google Analytics, Meta Pixels, commercial ad retargeters, or cross-site fingerprinting scripts. We believe that tracking domestic violence survivors across the web is an intolerable safety risk.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#20212B] tracking-tight">
            1. What Technologies We Use
          </h2>
          <p className="text-sm leading-relaxed">
            We use only <strong>strictly necessary</strong> local storage items required to keep you securely signed in to the application. Without these items, session state cannot be maintained between pages.
          </p>
        </section>

        {/* Storage Keys Table */}
        <div className="bg-white rounded-2xl border border-[#E6DFD5] overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#2D4354] text-[#FED7A5] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Key / Cookie</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-[#20212B]">token</td>
                <td className="py-3 px-4">localStorage</td>
                <td className="py-3 px-4">Encrypted JSON Web Token for authenticated API calls</td>
                <td className="py-3 px-4">5 Days (or until Sign Out)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-[#20212B]">userEmail</td>
                <td className="py-3 px-4">localStorage</td>
                <td className="py-3 px-4">Displays user initials and email in dashboard header</td>
                <td className="py-3 px-4">5 Days (or until Sign Out)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-[#20212B]">theme</td>
                <td className="py-3 px-4">localStorage</td>
                <td className="py-3 px-4">Persists light/dark interface contrast preference</td>
                <td className="py-3 px-4">Persistent</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#20212B] tracking-tight">
            2. Survivor Safety: How to Clear Your Browser Storage
          </h2>
          <p className="text-sm leading-relaxed">
            If you need to ensure no trace of visiting this case management website remains on your device:
          </p>
          <div className="p-6 rounded-2xl bg-[#F6EFE6] border border-[#E6DFD5] space-y-3 text-xs text-gray-700">
            <p><strong>1. Click &quot;Log Out&quot;:</strong> Signing out automatically deletes your authentication session token from local storage.</p>
            <p><strong>2. Clear Browser History:</strong> Press <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono">Ctrl+Shift+Delete</kbd> (Windows) or <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono">Cmd+Shift+Delete</kbd> (Mac) and select &quot;Cookies and other site data&quot; along with &quot;Cached images and files&quot;.</p>
            <p><strong>3. Use Private/Incognito Mode:</strong> Browsing in Private mode ensures all session data is purged automatically when the window is closed.</p>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}

