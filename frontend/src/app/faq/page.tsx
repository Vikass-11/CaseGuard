"use client";

import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ShieldCheck,
  Scale,
  Lock,
  Gavel,
  BookOpen,
  ArrowRight
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: "admissibility" | "privacy" | "clinical" | "platform";
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: "admissibility",
    question: "Is CaseGuard analysis admissible in a restraining order (DVRO) hearing?",
    answer: "CaseGuard generates structured Attorney Work-Product designed specifically to satisfy statutory evidentiary burdens (such as California Family Code § 6300 et seq., Texas Family Code § 81, or New York FCA Article 8). While the AI outputs themselves serve as privileged decision-support memoranda, the underlying factual chronology, corroborated timestamps, medical photo logs, and police report summaries synthesized by CaseGuard are routinely admitted as direct evidence and sworn supporting declarations."
  },
  {
    category: "admissibility",
    question: "Can opposing counsel subpoena CaseGuard's clinical assessments?",
    answer: "Under established legal precedent, attorney-directed case preparation, preliminary brief drafts, and strategy notes produced within CaseGuard are protected under the Attorney Work-Product Doctrine (e.g., Hickman v. Taylor) and Attorney-Client Privilege. CaseGuard enforces strict access boundaries and role-based permissions to safeguard this privileged classification."
  },
  {
    category: "privacy",
    question: "How does CaseGuard guarantee survivor confidentiality and VAWA compliance?",
    answer: "In compliance with the Violence Against Women Act (VAWA 34 U.S.C. § 12291(b)(2)) confidentiality mandates, CaseGuard features an automated PII anonymization layer. When an advocate inputs a statement or audio recording, sensitive personal identifiers (such as survivor names, children's schools, physical addresses, and phone numbers) are stripped or replaced with forensic entity placeholders prior to any semantic processing."
  },
  {
    category: "privacy",
    question: "Are case statements or client voice recordings ever used to train commercial AI models?",
    answer: "No. CaseGuard maintains a strict zero-data-retention and zero-model-training architecture. Client narratives, uploaded PDF records, and transcribed audio clips are isolated in private, tenant-scoped encrypted databases and are never used to train, fine-tune, or improve any public or foundational AI models."
  },
  {
    category: "clinical",
    question: "What clinical methodology powers the Lethality and Risk Assessment scores?",
    answer: "Our evaluation algorithms are grounded in peer-reviewed forensic risk protocols, including the Danger Assessment (DA) developed by Dr. Jacquelyn Campbell, the Duluth Model of Power and Control, and evidence-based non-fatal strangulation lethality research. The system evaluates escalating velocity, weapons accessibility, digital stalking, and threats of homicide-suicide."
  },
  {
    category: "clinical",
    question: "What happens if an attorney disagrees with an AI risk rating or recommendation?",
    answer: "CaseGuard operates under a mandatory Human-In-The-Loop paradigm. Attorneys and case workers have full editorial authority to override any AI severity rating, pattern tag, or recommendation with a single click. Overrides are timestamped and logged in the immutable audit trail with the advocate's clinical reasoning, ensuring the human professional remains in complete control."
  },
  {
    category: "platform",
    question: "What are the role permissions between Case Worker, Lawyer, and Admin?",
    answer: "Case Workers can perform intake, log victim statements, upload evidence, and review cases they have initiated. Lawyers have broader firm-wide visibility to analyze patterns, generate and edit formal court briefs, and rehearse hearings in the Practice Analyser. Administrators oversee organization-wide user access, audit logs, and AI evaluation metrics."
  },
  {
    category: "platform",
    question: "What is the Practice Analyser and how does it assist hearing preparation?",
    answer: "The Practice Analyser is a forensic rehearsal sandbox. Litigators can paste testimony or record potential direct/cross-examination scenarios to instantly receive counterargument simulations, evidentiary vulnerability warnings, and relevant statutory doctrine citations before setting foot in the courtroom."
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#20212B] flex flex-col font-sans">
      <PublicNavbar />

      {/* Header Banner */}
      <section className="bg-[#20212B] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#2D4354] relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D4354] border border-[#FED7A5]/30 text-xs font-bold uppercase tracking-widest text-[#FED7A5]">
            <HelpCircle className="w-3.5 h-3.5 text-[#FED7A5]" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Evidentiary & Legal Knowledge Base
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Clear, transparent answers on courtroom admissibility, VAWA privacy protections, clinical lethality protocols, and platform security.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by keyword, statute, or privacy protocol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-[#73766A] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FED7A5] focus:border-transparent transition-all"
            />
          </div>
        </div>
      </section>

      {/* Main FAQ Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-8">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "all", label: "All Questions" },
            { id: "admissibility", label: "Court Admissibility" },
            { id: "privacy", label: "Privacy & VAWA" },
            { id: "clinical", label: "Lethality Scoring" },
            { id: "platform", label: "Platform & Roles" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#2D4354] text-white shadow-sm"
                  : "bg-white text-gray-600 border border-[#E6DFD5] hover:bg-gray-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E6DFD5] shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="font-bold text-base text-[#20212B] leading-snug">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-[#9E6752]" : ""
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E6DFD5] p-8 space-y-2">
              <p className="font-bold text-base text-[#20212B]">No matching answers found</p>
              <p className="text-xs text-gray-500">
                Try searching with different terms or select &quot;All Questions&quot; above.
              </p>
            </div>
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-[#2D4354] text-white p-8 rounded-3xl border border-[#73766A]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mt-12">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-extrabold text-white">Have a specific case or evidentiary question?</h3>
            <p className="text-xs text-gray-300 max-w-lg">
              Our clinical and legal advocacy directors are available to discuss enterprise compliance, judicial standards, or training for your team.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-[#FED7A5] text-[#20212B] hover:bg-[#FED7A5]/90 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shrink-0 transition-all shadow"
          >
            Contact Legal Counsel
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

