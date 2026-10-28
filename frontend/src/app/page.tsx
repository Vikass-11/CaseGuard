"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import {
  Scale,
  ShieldCheck,
  FileText,
  Users,
  Award,
  Clock,
  ArrowRight,
  Lock,
  CheckCircle2,
  PhoneCall,
  AlertTriangle,
  Send,
  Sparkles,
  ChevronRight,
  Shield,
  FileCheck,
  Brain,
  Gavel,
  Check,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PublicHomePage() {
  const router = useRouter();

  // Confidential inquiry form state
  const [contactData, setContactData] = useState({
    fullName: "",
    contactValue: "",
    safeTimeToCall: "Morning (8am - 12pm)",
    situationType: "Domestic Violence Restraining Order (DVRO)",
    urgencyLevel: "Emergency (Within 24 Hours)",
    caseSummary: "",
  });
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.contactValue || !contactData.caseSummary) {
      toast.error("Please provide a safe contact method and a brief overview.");
      return;
    }
    setSubmittingContact(true);
    setTimeout(() => {
      setSubmittingContact(false);
      setContactSubmitted(true);
      toast.success("Confidential inquiry safely transmitted to crisis intake.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#20212B] font-sans selection:bg-[#FED7A5] selection:text-[#20212B] flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative bg-[#20212B] text-white overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-[#2D4354]">
        {/* Luminous Background Accent */}
        <div className="absolute inset-0 bg-radial-[circle_at_80%_20%] from-[#2D4354]/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#20212B] to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D4354] border border-[#FED7A5]/30 text-xs font-bold uppercase tracking-widest text-[#FED7A5]">
                <ShieldCheck className="w-4 h-4 text-[#FED7A5]" />
                FORENSIC CLINICAL ADVOCACY & EMERGENCY COURT RELIEF
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Your Safety. Your Rights. <br />
                <span className="text-[#FED7A5]">A Protected Future.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl">
                Led by Senior Managing Partner Eleanor Vance, our premier legal practice combines decades of courtroom trial mastery with proprietary forensic lethality intelligence. We secure emergency ex-parte protective orders, safeguard minor children, and dismantle coercive control.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#contact"
                  className="bg-[#FED7A5] text-[#20212B] hover:bg-[#FED7A5]/90 px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Request Urgent Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/login"
                  className="border border-[#73766A] hover:border-[#FED7A5] text-white hover:text-[#FED7A5] px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all bg-[#2D4354]/50 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#FED7A5]" />
                  <span>Advocate Case Portal</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#2D4354] grid grid-cols-3 gap-6 text-xs text-gray-400">
                <div>
                  <p className="text-2xl font-extrabold text-white">98.4%</p>
                  <p className="text-[11px] font-medium text-gray-400 mt-0.5">Injunction Grant Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#FED7A5]">22+ Yrs</p>
                  <p className="text-[11px] font-medium text-gray-400 mt-0.5">Family Court Trial Mastery</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">100%</p>
                  <p className="text-[11px] font-medium text-gray-400 mt-0.5">Confidential Work-Product</p>
                </div>
              </div>
            </div>

            {/* Right Column: CaseGuard Intelligence Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#2D4354]/60 backdrop-blur-xl border border-[#FED7A5]/30 p-8 rounded-3xl shadow-2xl space-y-6 relative">
                <div className="flex items-center justify-between border-b border-[#73766A]/40 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Scale className="w-5 h-5 text-[#FED7A5]" />
                    <span className="font-extrabold text-sm text-white tracking-wide">CASEGUARD FORENSIC ENGINE</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#FED7A5] bg-[#20212B] px-2 py-1 rounded-md border border-[#FED7A5]/20">
                    Live System
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-[#20212B]/80 p-4 rounded-2xl border border-[#73766A]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-300">Intake Statement Ingestion</span>
                      <span className="text-[#3A6B53] font-bold">PII Redacted</span>
                    </div>
                    <p className="text-gray-400 text-[11px] font-mono leading-relaxed">
                      &quot;[PERSON_1] forced entry at 02:00, uttered death threats, and restricted airway. Photographic evidence secured.&quot;
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#20212B]/80 p-3.5 rounded-xl border border-[#73766A]/30">
                      <span className="text-gray-400 text-[10px] uppercase font-bold block">Assessed Severity</span>
                      <span className="text-sm font-extrabold text-[#9E6752]">Critical (Life-Threatening)</span>
                    </div>
                    <div className="bg-[#20212B]/80 p-3.5 rounded-xl border border-[#73766A]/30">
                      <span className="text-gray-400 text-[10px] uppercase font-bold block">Strangulation Flag</span>
                      <span className="text-sm font-extrabold text-[#FED7A5]">Positive (7.5x Risk)</span>
                    </div>
                  </div>

                  <div className="bg-[#20212B]/80 p-4 rounded-2xl border border-[#73766A]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-300">Judicial Remedy Recommended</span>
                      <span className="text-[#FED7A5] text-[10px] font-bold">Statutory Fast-Track</span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      Ex-Parte DV-110 Temporary Restraining Order with Immediate Move-Out Mandate and Firearm Relinquishment.
                    </p>
                  </div>
                </div>

                <Link
                  href="/practice"
                  className="w-full bg-[#FED7A5] hover:bg-[#FED7A5]/90 text-[#20212B] py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow cursor-pointer"
                >
                  <span>Test Practice Analyser Sandbox</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Practice Areas Grid */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-[#9E6752]">
            SPECIALIZED LITIGATION DIVISIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#20212B]">
            Trial Defense & Protective Injunction Mastery
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Our firm delivers aggressive, evidence-grounded courtroom advocacy across all areas of intimate partner litigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: "Emergency Restraining Orders (DVRO)",
              desc: "Securing same-day ex-parte temporary protective orders, stay-away mandates, residence exclusions, and firearm confiscation orders."
            },
            {
              icon: Gavel,
              title: "Contested Evidentiary Trials",
              desc: "Rigorous trial representation during multi-day contested hearings, cross-examining abusive respondents and overcoming aggressive defenses."
            },
            {
              icon: Brain,
              title: "Coercive Control & Digital Stalking",
              desc: "Documenting subtle patterns of financial deprivation, digital surveillance, AirTag tracking, and psychological isolation under modernized statutes."
            },
            {
              icon: Users,
              title: "Child Custody Emergency Relief",
              desc: "Invoking mandatory domestic violence statutory rebuttals to ensure children are protected from abusers and granted supervised visitation only."
            },
            {
              icon: FileText,
              title: "Forensic Strangulation Documentation",
              desc: "Translating delayed physical symptoms, medical imaging, and psychological petechiae into admissible lethal-force evidence."
            },
            {
              icon: Sparkles,
              title: "Decision Support & Brief Studio",
              desc: "Synthesizing chaotic multi-year text messages, police records, and audio recordings into clear, chronological legal declarations."
            }
          ].map((area, idx) => {
            const Icon = area.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-[#E6DFD5] shadow-sm hover:shadow-md hover:border-[#2D4354]/40 transition-all space-y-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#2D4354]/10 border border-[#2D4354]/20 flex items-center justify-center text-[#2D4354] group-hover:bg-[#2D4354] group-hover:text-[#FED7A5] transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#20212B]">{area.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{area.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How We Solve Cases / The CaseGuard Advantage */}
      <section id="how-we-solve" className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-[#9E6752]">
              THE FORENSIC METHOD
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#20212B]">
              How CaseGuard Secures Courtroom Victories
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Family courts demand clear chronology and statutory grounding. Our structured approach leaves no room for judicial ambiguity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Trauma-Informed Intake",
                desc: "Survivor statements are logged via text or secure voice transcription, immediately scrubbed of PII, and categorized."
              },
              {
                step: "02",
                title: "Lethality Risk Modeling",
                desc: "Validated Danger Assessment algorithms calculate escalation velocity, strangulation markers, and weapon proximity."
              },
              {
                step: "03",
                title: "Trial Brief Synthesis",
                desc: "Automated generation of formal court briefs with judicial captions, statutory citations, and chronological evidentiary citations."
              },
              {
                step: "04",
                title: "Practice Analyser Rehearsal",
                desc: "Simulating cross-examinations, identifying vulnerabilities, and testing mitigating arguments prior to trial entry."
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-[#FDFBF7] p-8 rounded-3xl border border-[#E6DFD5] space-y-4 relative">
                <span className="text-3xl font-extrabold text-[#2D4354]/20 block">
                  {step.step}
                </span>
                <h3 className="text-base font-bold text-[#20212B]">{step.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Consultation / Intake Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-[#20212B] text-white rounded-3xl border border-[#2D4354] overflow-hidden shadow-2xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FED7A5] bg-[#2D4354] px-3 py-1 rounded-full border border-[#FED7A5]/20">
                CONFIDENTIAL LEGAL INQUIRY
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Get Immediate Trial Counsel & Protective Guidance
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                Complete this secure questionnaire. If you are in immediate physical danger, dial 911 or call 1-800-799-SAFE.
              </p>
              <div className="pt-2 text-xs text-[#FED7A5] font-semibold space-y-1">
                <p>✓ Privileged Attorney Work-Product</p>
                <p>✓ PII Never Stored on Public Servers</p>
                <p>✓ 24-Hour Emergency Triage Available</p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white text-[#20212B] p-6 sm:p-8 rounded-2xl shadow-lg">
              {contactSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 bg-[#3A6B53]/10 text-[#3A6B53] rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#20212B]">Confidential Inquiry Received</h3>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                    Our crisis intake director will review your details discreetly during your requested safe time: <strong>{contactData.safeTimeToCall}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactData({
                        fullName: "",
                        contactValue: "",
                        safeTimeToCall: "Morning (8am - 12pm)",
                        situationType: "Domestic Violence Restraining Order (DVRO)",
                        urgencyLevel: "Emergency (Within 24 Hours)",
                        caseSummary: "",
                      });
                    }}
                    className="text-xs font-bold text-[#2D4354] hover:underline"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="cName" className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                        Name / Safe Pseudonym
                      </Label>
                      <Input
                        id="cName"
                        value={contactData.fullName}
                        onChange={(e) => setContactData({ ...contactData, fullName: e.target.value })}
                        placeholder="e.g. Jane"
                        className="h-10 text-xs bg-[#FDFBF7] border-[#E6DFD5] rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cContact" className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                        Safe Phone / Email *
                      </Label>
                      <Input
                        id="cContact"
                        value={contactData.contactValue}
                        onChange={(e) => setContactData({ ...contactData, contactValue: e.target.value })}
                        placeholder="Private phone or email"
                        className="h-10 text-xs bg-[#FDFBF7] border-[#E6DFD5] rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                        Safe Time Window
                      </Label>
                      <select
                        value={contactData.safeTimeToCall}
                        onChange={(e) => setContactData({ ...contactData, safeTimeToCall: e.target.value })}
                        className="w-full h-10 px-3 bg-[#FDFBF7] border border-[#E6DFD5] rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
                      >
                        <option>Morning (8am - 12pm)</option>
                        <option>Afternoon (12pm - 5pm)</option>
                        <option>Evening (5pm - 9pm)</option>
                        <option>Text Message Only</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                        Situation Urgency
                      </Label>
                      <select
                        value={contactData.urgencyLevel}
                        onChange={(e) => setContactData({ ...contactData, urgencyLevel: e.target.value })}
                        className="w-full h-10 px-3 bg-[#FDFBF7] border border-[#E6DFD5] rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
                      >
                        <option>Emergency (Within 24 Hours)</option>
                        <option>High (Next 48 Hours)</option>
                        <option>General Legal Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="cSummary" className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                      Brief Overview of Situation *
                    </Label>
                    <Textarea
                      id="cSummary"
                      rows={3}
                      value={contactData.caseSummary}
                      onChange={(e) => setContactData({ ...contactData, caseSummary: e.target.value })}
                      placeholder="Describe what occurred (e.g. violent incident, threats, custody emergency). Details are held strictly confidential."
                      className="text-xs bg-[#FDFBF7] border-[#E6DFD5] rounded-xl"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submittingContact}
                    className="w-full h-11 bg-[#2D4354] hover:bg-[#2D4354]/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all cursor-pointer"
                  >
                    {submittingContact ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#FED7A5]" /> TRANSMITTING...
                      </span>
                    ) : (
                      "TRANSMIT CONFIDENTIAL INQUIRY"
                    )}
                  </Button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
