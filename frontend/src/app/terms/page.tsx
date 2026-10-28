"use client";

import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { Scale, AlertTriangle, ShieldCheck, FileCheck, Gavel } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#20212B] flex flex-col font-sans">
      <PublicNavbar />

      {/* Hero Header */}
      <section className="bg-[#20212B] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#2D4354]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D4354] border border-[#FED7A5]/30 text-xs font-bold uppercase tracking-widest text-[#FED7A5]">
            <Gavel className="w-3.5 h-3.5 text-[#FED7A5]" />
            LEGAL TERMS OF SERVICE
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Professional Use Terms & Conditions
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
            Governing professional use of the CaseGuard platform, clinical decision-support tools, and court brief generation studio.
          </p>
          <p className="text-xs text-[#FED7A5] font-semibold tracking-wide">
            Effective: October 2026 • Commercial Product Version 2.4
          </p>
        </div>
      </section>

      {/* Main Terms Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-12 leading-relaxed text-gray-700">
        
        {/* Critical Emergency Disclaimer */}
        <div className="p-6 rounded-2xl bg-[#534145] text-white shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FED7A5]">
            <AlertTriangle className="w-4 h-4 text-[#FED7A5]" />
            <span>Critical Safety & Emergency Disclaimer</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-200">
            CaseGuard is an asynchronous legal case management and decision-support software application. It does NOT monitor emergency transmissions, deploy physical law enforcement, or replace emergency dispatch services. If a client is in imminent physical danger, immediately instruct them to dial 911 or reach out to law enforcement.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#20212B] tracking-tight">
            1. Authorized Use & License Grant
          </h2>
          <p className="text-sm leading-relaxed">
            CaseGuard grants authorized legal-aid non-profits, domestic violence shelters, family law firms, and accredited victim assistance agencies a limited, non-exclusive, non-transferable license to access and use the platform strictly for managing intimate partner violence cases, evaluating clinical lethality factors, and drafting litigation documents.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#20212B] tracking-tight">
            2. Professional Responsibility & ABA Model Rules
          </h2>
          <p className="text-sm leading-relaxed">
            Attorneys utilizing CaseGuard acknowledge and agree that:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Independent Professional Judgment:</strong> AI-generated patterns, severity scores, and brief drafts constitute investigative aids and draft suggestions. They do not substitute for the independent legal judgment, factual investigation, and tactical decisions of licensed legal counsel (ABA Model Rule 2.1).
            </li>
            <li>
              <strong>Mandatory Verification:</strong> Litigators must review and verify all factual recitations, statutory citations, and evidentiary claims before filing documents with any court (Fed. R. Civ. P. 11 / state equivalents).
            </li>
            <li>
              <strong>Supervision of Non-Lawyer Assistance:</strong> Supervising attorneys remain responsible for the work product of case workers and advocates utilizing the system under ABA Model Rules 5.1 and 5.3.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#20212B] tracking-tight">
            3. Account Security & Credential Hygiene
          </h2>
          <p className="text-sm leading-relaxed">
            Given the sensitive nature of domestic violence records, authorized users are strictly prohibited from sharing login credentials. Users must maintain complex passwords (minimum 8 characters), change initial temporary passwords upon first login, and notify organization administrators immediately upon suspected credential compromise or unauthorized access.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#20212B] tracking-tight">
            4. Limitation of Liability
          </h2>
          <p className="text-sm leading-relaxed">
            To the maximum extent permitted by applicable law, CaseGuard Legal Systems, Inc. shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from court rulings, denial of protective orders, scheduling lapses, or third-party telecommunication failures. The software is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#20212B] tracking-tight">
            5. Governing Law
          </h2>
          <p className="text-sm leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles. Any dispute arising under these terms shall be resolved in the state or federal courts located in San Francisco County, California.
          </p>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
