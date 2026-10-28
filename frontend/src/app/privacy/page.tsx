"use client";

import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#20212B] flex flex-col font-sans">
      <PublicNavbar />

      {/* Hero Header */}
      <section className="bg-[#20212B] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#2D4354]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D4354] border border-[#FED7A5]/30 text-xs font-bold uppercase tracking-widest text-[#FED7A5]">
            <Lock className="w-3.5 h-3.5 text-[#FED7A5]" />
            DATA GOVERNANCE & LEGAL PRIVACY
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Privacy Policy & Survivor Data Protections
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
            Governing how CaseGuard and Vance & Partners safeguard intimate partner violence evidence, survivor identities, and privileged legal files.
          </p>
          <p className="text-xs text-[#FED7A5] font-semibold tracking-wide">
            Effective Date: October 2026 • VAWA 34 U.S.C. § 12291(b)(2) Aligned
          </p>
        </div>
      </section>

      {/* Main Legal Policy Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-12 leading-relaxed text-gray-700">
        
        {/* Important Alert Notice */}
        <div className="p-6 rounded-2xl bg-white border-l-4 border-[#9E6752] border border-[#E6DFD5] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9E6752]">
            <AlertTriangle className="w-4 h-4" />
            <span>Survivor Safety Notice</span>
          </div>
          <p className="text-sm leading-relaxed">
            If you suspect your digital devices (phone, laptop, Wi-Fi router) are being tracked, monitored, or infected with stalkerware by an abusive partner, please use a secure device at a local public library, community center, or shelter to access this platform.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#20212B] tracking-tight">
            1. Statutory Framework & VAWA Compliance
          </h2>
          <p className="text-sm leading-relaxed">
            CaseGuard operates in strict accordance with the non-disclosure and confidentiality mandates of the <strong>Violence Against Women Act (VAWA)</strong>, 34 U.S.C. § 12291(b)(2), the Family Violence Prevention and Services Act (FVPSA), and state domestic violence victim advocate privilege statutes.
          </p>
          <p className="text-sm leading-relaxed">
            We recognize that disclosure of personally identifying information (PII) regarding domestic violence, sexual assault, stalking, or child abuse victims carries immediate physical danger. Therefore, our platform implements mandatory technical barriers preventing the unauthorized revelation of any survivor&apos;s physical location, contact details, or narrative disclosures.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#20212B] tracking-tight">
            2. Automated PII Redaction & Data Minimization
          </h2>
          <p className="text-sm leading-relaxed">
            Before case statements, recorded voice files, or intake notes undergo machine-assisted pattern recognition or vector indexing:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Presidio Anonymization Engine:</strong> Natural person names are replaced with entity tokens (e.g., <code>[PERSON_1]</code>, <code>[OFFENDER]</code>).
            </li>
            <li>
              <strong>Geographic & Contact Stripping:</strong> Physical street addresses, schools, child care facilities, phone numbers, and email accounts are redacted.
            </li>
            <li>
              <strong>Vehicle & Identifier Scrubbing:</strong> License plate numbers, vehicle VINs, and social security numbers are stripped from processing payloads.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#20212B] tracking-tight">
            3. Zero Model Training Guarantee
          </h2>
          <p className="text-sm leading-relaxed">
            We pledge unconditionally that:
          </p>
          <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3A6B53] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700">
                <strong>No Public LLM Training:</strong> Client statements, evidence uploads, and attorney briefs are never used to train, retrain, or improve commercial machine learning models.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3A6B53] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700">
                <strong>Strict Tenant Isolation:</strong> Case data is partitioned cryptographically and logically. No case worker or lawyer from another organization can access or query your cases.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3A6B53] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700">
                <strong>Ephemeral Transcription:</strong> Uploaded voice memos used for intake speech-to-text are processed through private dedicated endpoints and cleared upon brief finalization.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#20212B] tracking-tight">
            4. Cryptographic Security & Chain of Custody
          </h2>
          <p className="text-sm leading-relaxed">
            All data in transit is protected using TLS 1.3 protocol with forward secrecy. All database storage volumes, case inputs, and document attachments are encrypted at rest with AES-256 standard. Immutable audit logs monitor all user access, record alterations, and human-in-the-loop prediction overrides to protect the evidentiary chain-of-custody for judicial proceedings.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#20212B] tracking-tight">
            5. Data Retention & Right to Expungement
          </h2>
          <p className="text-sm leading-relaxed">
            Organizations retain sole ownership of their case repositories. Upon written instruction from authorized legal administrators or client directive pursuant to state privacy laws, all case records, attachments, and vector embeddings can be exported in standardized forensic format or permanently expunged using DOD 5220.22-M compliant data sanitization standards.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#20212B] tracking-tight">
            6. Privacy Officer Contact
          </h2>
          <p className="text-sm leading-relaxed">
            If you have questions regarding our trauma-informed privacy protocols, subpoena responses, or data protection agreements, contact our Data Protection Officer at:
          </p>
          <div className="bg-[#2D4354] text-white p-6 rounded-2xl text-xs space-y-1">
            <p className="font-bold text-[#FED7A5] text-sm">CaseGuard Legal Data Security Office</p>
            <p>Email: privacy@caseguard.com</p>
            <p>Confidential Legal Hotline: 1-800-555-CG-SAFE</p>
            <p>Attn: Chief Privacy Architect & General Counsel</p>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
