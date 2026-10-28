"use client";

import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import {
  Scale,
  ShieldCheck,
  Brain,
  Lock,
  FileText,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Gavel,
  AlertTriangle,
  Building2,
  Sparkles
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#20212B] flex flex-col font-sans">
      <PublicNavbar />

      {/* Hero Header */}
      <section className="bg-[#20212B] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#2D4354] relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-[circle_at_80%_20%] from-[#2D4354]/60 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D4354] border border-[#FED7A5]/30 text-xs font-bold uppercase tracking-widest text-[#FED7A5]">
            <Scale className="w-3.5 h-3.5 text-[#FED7A5]" />
            ABOUT CASEGUARD
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            The Forensic Standard in <br />
            <span className="text-[#FED7A5]">Domestic Violence Legal Advocacy</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed">
            CaseGuard was founded by trauma-informed trial attorneys, forensic psychologists, and security architects to eliminate the evidentiary gaps that leave domestic violence survivors vulnerable in high-stakes family court hearings.
          </p>
        </div>
      </section>

      {/* Mission & Purpose */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-[#9E6752]">
              OUR FOUNDING MISSION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#20212B] leading-tight">
              Transforming Traumatic Statements into Objective Courtroom Assets
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              In domestic abuse litigation, survivors often face cross-examination designed to exploit trauma-induced memory fragmentation. Meanwhile, under-resourced legal-aid advocates manage overwhelming caseloads with limited hours to synthesize complex multi-year timelines.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              CaseGuard bridges this divide. We combine clinical lethality risk modeling with automated PII sanitization and rapid brief assembly—empowering advocates to present clear, undeniable evidence of coercive control, escalating violence, and imminent risk to the court.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#2D4354] hover:bg-[#2D4354]/90 text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Schedule Firm Briefing <ArrowRight className="w-4 h-4 text-[#FED7A5]" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#2D4354]/10 border border-[#2D4354]/20 flex items-center justify-center text-[#2D4354]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#20212B]">Trauma-Informed</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Structured narrative capture designed to minimize secondary trauma while obtaining crucial forensic details.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#9E6752]/10 border border-[#9E6752]/20 flex items-center justify-center text-[#9E6752]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#20212B]">Privacy Guaranteed</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Automated PII scrubbing ensures real victim names and addresses are never passed to external AI models.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#534145]/10 border border-[#534145]/20 flex items-center justify-center text-[#534145]">
                <Gavel className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#20212B]">Court-Admissible</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Briefs adhere to formal judicial formatting, statutory evidentiary thresholds, and work-product standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#2D4354]/10 border border-[#2D4354]/20 flex items-center justify-center text-[#2D4354]">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#20212B]">Lethality Scoring</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Clinically validated risk indicators including non-fatal strangulation, stalking, and escalation velocity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ethical Architecture & Zero-Training Commitment */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-widest uppercase text-[#9E6752]">
              DATA SOVEREIGNTY & ETHICS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#20212B]">
              Our Non-Negotiable Privacy Commitments
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              When dealing with life-and-death domestic violence matters, standard commercial software security is insufficient. CaseGuard operates under strict zero-knowledge principles:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#E6DFD5] space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#2D4354] text-[#FED7A5] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-[#20212B]">Zero Model Training</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Client statements, case files, audio recordings, and attorney briefs are NEVER used to train machine learning models. Your data remains strictly isolated to your tenant organization.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#E6DFD5] space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#2D4354] text-[#FED7A5] flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-[#20212B]">Human-In-The-Loop Oversight</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                AI in CaseGuard acts strictly as an assistant. Every clinical risk score and recommendation is fully transparent and can be overridden by the attorney or case worker with a documented justification.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#E6DFD5] space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#2D4354] text-[#FED7A5] flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-[#20212B]">Tamper-Evident Audit Logging</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every record modification, document ingestion, and prediction override is permanently logged with actor timestamps to preserve evidentiary chain-of-custody for judicial scrutiny.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Advisors */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-widest uppercase text-[#9E6752]">
            EXECUTIVE LEADERSHIP & ADVISORY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#20212B]">
            Advocates with Courtroom Mastery
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Our multidisciplinary team combines 60+ years of family court trial litigation with clinical crisis intervention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#E6DFD5] shadow-sm space-y-4 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#2D4354] text-[#FED7A5] flex items-center justify-center text-xl font-extrabold">
              EV
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#20212B]">Eleanor Vance, Esq.</h3>
              <p className="text-xs text-[#9E6752] font-bold uppercase tracking-wider mt-0.5">
                Senior Managing Partner & Litigation Director
              </p>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Former Family Law Trial Attorney of the Year with 22 years specializing in ex-parte restraining order trials, multi-jurisdictional custody disputes, and coercive control litigation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E6DFD5] shadow-sm space-y-4 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#534145] text-white flex items-center justify-center text-xl font-extrabold">
              MB
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#20212B]">Dr. Marcus Bennett, Psy.D.</h3>
              <p className="text-xs text-[#9E6752] font-bold uppercase tracking-wider mt-0.5">
                Chief of Clinical Lethality Assessment
              </p>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Forensic psychologist and expert witness with over 400 courtroom appearances evaluating strangulation sequelae, post-separation escalation vectors, and intimate partner trauma.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E6DFD5] shadow-sm space-y-4 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#73766A] text-white flex items-center justify-center text-xl font-extrabold">
              SJ
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#20212B]">Hon. Sarah Jenkins (Ret.)</h3>
              <p className="text-xs text-[#9E6752] font-bold uppercase tracking-wider mt-0.5">
                Senior Judicial Advisor & Evidentiary Counsel
              </p>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Served 18 years on the Family Law and Domestic Violence Trial Bench. Advises CaseGuard on statutory admissibility, judicial reasoning patterns, and work-product doctrine.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#2D4354] text-white py-16 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Equip Your Organization with Objective Legal Intelligence
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
            Whether you are a legal-aid non-profit or a private litigation firm, CaseGuard reduces brief preparation time by 70% while safeguarding vital client protections.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="bg-[#FED7A5] text-[#20212B] hover:bg-[#FED7A5]/90 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              Request Confidential Intake
            </Link>
            <Link
              href="/login"
              className="border border-[#73766A] hover:border-[#FED7A5] text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all bg-[#20212B]/40"
            >
              Sign In to Case Portal
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
