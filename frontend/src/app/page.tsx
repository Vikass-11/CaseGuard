"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  UserCheck,
  Building,
  Menu,
  X,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

export default function PublicLawFirmHomePage() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Public Contact & Case Intake Form State
  const [contactData, setContactData] = useState({
    fullName: "",
    contactMethod: "phone", // phone or email
    contactValue: "",
    safeTimeToCall: "Morning (9am - 12pm)",
    situationType: "Domestic Violence Restraining Order (DVRO)",
    urgencyLevel: "Emergency (Within 24 Hours)",
    caseSummary: "",
    fileAttached: false,
    fileName: ""
  });
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Safety Quick Exit: instantly redirects to weather or search
  const handleQuickExit = () => {
    window.location.replace("https://www.google.com");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.contactValue || !contactData.caseSummary) {
      toast.error("Please provide a contact method and brief situation overview.");
      return;
    }
    setSubmittingContact(true);
    setTimeout(() => {
      setSubmittingContact(false);
      setContactSubmitted(true);
      toast.success("Confidential inquiry received. Our crisis intake director will contact you securely.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#20212B] font-sans selection:bg-[#FED7A5] selection:text-[#20212B]">
      
      {/* Safety Emergency Banner (Topmost) */}
      <div className="bg-[#534145] text-white px-4 py-2 text-xs font-semibold flex items-center justify-between z-50 relative">
        <div className="flex items-center gap-2 max-w-4xl mx-auto text-center justify-center flex-1">
          <AlertTriangle className="w-3.5 h-3.5 text-[#FED7A5] shrink-0" />
          <span>
            <strong>Safety Warning:</strong> If you are in immediate physical danger, call <strong>911</strong> or the 24/7 National DV Hotline at <strong>1-800-799-SAFE</strong>.
          </span>
        </div>
        <button
          onClick={handleQuickExit}
          className="bg-[#9E6752] hover:bg-[#9E6752]/90 text-white px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-sm ml-2"
          title="Instantly leave this site for privacy"
        >
          Quick Exit ✕
        </button>
      </div>

      {/* Main Navigation Bar (Matching Novara Wealth reference header) */}
      <header className="sticky top-0 z-40 bg-[#20212B]/95 backdrop-blur-md border-b border-[#2D4354] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Firm Identity */}
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#2D4354] border border-[#FED7A5]/30 flex items-center justify-center shadow-md">
              <Scale className="h-5 w-5 text-[#FED7A5]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block leading-tight">
                VANCE & PARTNERS
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FED7A5]">
                Specialized Family & Restraining Order Litigators
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
            <a href="#services" className="hover:text-[#FED7A5] transition-colors">Practice Areas</a>
            <a href="#how-we-solve" className="hover:text-[#FED7A5] transition-colors">How We Solve Cases</a>
            <a href="#team" className="hover:text-[#FED7A5] transition-colors">Attorneys & Leadership</a>
            <a href="#track-record" className="hover:text-[#FED7A5] transition-colors">Case Results</a>
            <a href="#contact" className="hover:text-[#FED7A5] transition-colors">Confidential Contact</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#contact"
              className="bg-[#FED7A5] text-[#20212B] hover:bg-[#FED7A5]/90 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
            >
              Request Consultation
            </a>
            <Link
              href="/login"
              className="border border-[#73766A]/60 hover:border-[#FED7A5] text-white hover:text-[#FED7A5] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all bg-[#2D4354]/40"
            >
              Lawyer / Staff Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 text-white hover:text-[#FED7A5]"
            aria-label="Toggle Menu"
          >
            {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#20212B] border-b border-[#2D4354] px-6 py-6 space-y-4">
            <nav className="flex flex-col space-y-3 text-sm font-semibold">
              <a onClick={() => setMobileNavOpen(false)} href="#services" className="text-gray-200 hover:text-[#FED7A5] py-1">Practice Areas</a>
              <a onClick={() => setMobileNavOpen(false)} href="#how-we-solve" className="text-gray-200 hover:text-[#FED7A5] py-1">How We Solve Cases</a>
              <a onClick={() => setMobileNavOpen(false)} href="#team" className="text-gray-200 hover:text-[#FED7A5] py-1">Attorneys & Leadership</a>
              <a onClick={() => setMobileNavOpen(false)} href="#track-record" className="text-gray-200 hover:text-[#FED7A5] py-1">Case Results</a>
              <a onClick={() => setMobileNavOpen(false)} href="#contact" className="text-[#FED7A5] font-bold py-1">Confidential Contact</a>
            </nav>
            <div className="pt-4 border-t border-[#2D4354] flex flex-col gap-2.5">
              <a
                href="#contact"
                onClick={() => setMobileNavOpen(false)}
                className="w-full text-center bg-[#FED7A5] text-[#20212B] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                Request Confidential Consultation
              </a>
              <Link
                href="/login"
                className="w-full text-center border border-[#73766A] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#2D4354]/50"
              >
                Attorney & Staff Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section (Matching Novara Wealth Advisory Hero Aesthetic) */}
      <section className="relative bg-[#20212B] text-white overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 border-b border-[#2D4354]">
        {/* Luminous Mesh Background */}
        <div className="absolute inset-0 bg-radial-[circle_at_80%_20%] from-[#2D4354]/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#20212B] to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2D4354]/80 border border-[#FED7A5]/30 text-xs font-bold uppercase tracking-widest text-[#FED7A5]">
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
                  className="bg-[#FED7A5] hover:bg-[#FED7A5]/90 text-[#20212B] px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 group"
                >
                  <span>Book Free Confidential Intake</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>

                <a
                  href="#how-we-solve"
                  className="bg-[#2D4354]/60 hover:bg-[#2D4354] border border-[#73766A]/60 text-white px-6 py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all flex items-center gap-2"
                >
                  <span>See How We Win</span>
                </a>
              </div>

              {/* Social Proof Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#2D4354]/80 text-xs text-gray-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2D4354] flex items-center justify-center text-[#FED7A5] shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Board Certified</p>
                    <p className="text-gray-400 text-[11px]">Family Law Specialists</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2D4354] flex items-center justify-center text-[#FED7A5] shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">100% Confidential</p>
                    <p className="text-gray-400 text-[11px]">Privileged Intake</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2D4354] flex items-center justify-center text-[#FED7A5] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Same-Day Filing</p>
                    <p className="text-gray-400 text-[11px]">Emergency Ex-Parte</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Right: Floating Interactive Intelligence Widget (Matching Novara Reference Card) */}
            <div className="lg:col-span-5">
              <div className="bg-[#2D4354]/80 backdrop-blur-xl border border-[#FED7A5]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
                
                {/* Header of Preview Card */}
                <div className="flex items-center justify-between pb-4 border-b border-[#73766A]/40">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#FED7A5]">
                      Live Legal Defense Operations
                    </p>
                    <p className="text-xl font-bold text-white mt-0.5">Firm Case Impact Metric</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active Roster
                  </span>
                </div>

                {/* Big Metric Display */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">1,480+</span>
                    <span className="text-emerald-400 text-sm font-bold">↑ 98.6%</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">Protective Orders Granted & Victims Relocated Safely</p>
                </div>

                {/* Progress / Metric Bars */}
                <div className="space-y-3.5 bg-[#20212B]/60 p-4 rounded-2xl border border-[#73766A]/30">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-300">Ex-Parte Emergency Relief Approval</span>
                      <span className="text-[#FED7A5] font-bold">99.1%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FED7A5] rounded-full w-[99%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-300">Evidence Admissibility Standard</span>
                      <span className="text-[#FED7A5] font-bold">100% Validated</span>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#9E6752] rounded-full w-[100%]" />
                    </div>
                  </div>
                </div>

                {/* Rapid Action Box */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#2D4354] border border-[#FED7A5]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FED7A5] text-[#20212B] flex items-center justify-center font-bold text-xs">
                      24h
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Emergency Intake Available</p>
                      <p className="text-[11px] text-gray-300">Average response time: 38 mins</p>
                    </div>
                  </div>
                  <a
                    href="#contact"
                    className="text-xs font-bold text-[#FED7A5] hover:underline flex items-center gap-1"
                  >
                    Reach Out →
                  </a>
                </div>

                {/* Client Quote Snippet */}
                <p className="text-[11px] italic text-gray-300 border-l-2 border-[#FED7A5] pl-3 py-1">
                  &ldquo;Eleanor Vance and her litigators obtained our emergency custody order within 14 hours of filing. Their forensic preparation was unbreakable.&rdquo;
                  <span className="block font-bold not-italic text-white mt-1">— Protective Custody Client, Superior Court</span>
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Practice Areas / Our Services (Matching Novara Services Grid) */}
      <section id="services" className="py-20 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#9E6752] mb-2">Our Practice Areas</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#20212B] tracking-tight">
                Specialized Legal Advocacy for High-Risk Matters
              </h2>
            </div>
            <p className="text-sm text-[#73766A] max-w-md font-medium">
              We specialize in complex, high-conflict litigation where physical safety, parental rights, and lifetime security are hanging in the balance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Emergency Domestic Violence Restraining Orders",
                desc: "Same-day ex-parte filings, move-out orders, 500-yard stay-away mandates, and emergency firearm surrender enforcement under state family protection statutes.",
                tag: "Ex-Parte Immediate Relief"
              },
              {
                icon: Users,
                title: "Emergency Child Custody & Relocation",
                desc: "Securing exclusive temporary custody when children are exposed to abuse, parental alienation, or threats of cross-border or out-of-state abduction.",
                tag: "Minor Child Protection"
              },
              {
                icon: AlertTriangle,
                title: "Coercive Control & Forensic Evidence Subpoenas",
                desc: "Documenting insidious non-physical abuse, electronic surveillance, financial starvation, and psychological entrapment using validated clinical benchmarks.",
                tag: "Forensic Discovery"
              },
              {
                icon: FileCheck,
                title: "Long-Term Permanent Protective Injunctions",
                desc: "Trial representation at contested evidentiary hearings. Presenting medical records, 911 dispatch logs, and digital extractions to obtain 5-year and permanent orders.",
                tag: "Superior Court Hearings"
              },
              {
                icon: Scale,
                title: "Complex Divorce with Domestic Abuse Intersections",
                desc: "Protecting victim spouses against retaliatory lawsuits, fraudulent dissipation of marital assets, and contested spousal support with absolute legal firmness.",
                tag: "High-Asset Protection"
              },
              {
                icon: UserCheck,
                title: "Victim Witness Protection & Criminal Coordination",
                desc: "Liaising with district attorneys and victim advocacy units to ensure civil protective orders seamlessly support criminal felony domestic violence proceedings.",
                tag: "Inter-Agency Advocacy"
              }
            ].map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-[#E6DFD5] shadow-sm hover:shadow-xl hover:border-[#2D4354] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F6EFE6] text-[#2D4354] group-hover:bg-[#2D4354] group-hover:text-[#FED7A5] transition-colors flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#9E6752] bg-[#FFF7EE] px-2.5 py-1 rounded-full border border-[#FED7A5]/40">
                      {srv.tag}
                    </span>
                    <h3 className="text-xl font-bold text-[#20212B] tracking-tight">{srv.title}</h3>
                    <p className="text-sm text-[#73766A] leading-relaxed">{srv.desc}</p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#E6DFD5]/80 flex items-center justify-between">
                    <a
                      href="#contact"
                      className="text-xs font-bold text-[#2D4354] group-hover:text-[#9E6752] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      Inquire About This Matter <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* How We Solve Cases (Our Step-by-Step Methodology) */}
      <section id="how-we-solve" className="py-20 bg-[#F6EFE6]/60 border-y border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9E6752]">Our Proven Case Methodology</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#20212B] tracking-tight">
              How Our Legal Team Wins Injunctions & Protects Clients
            </h2>
            <p className="text-sm text-[#73766A]">
              We do not treat domestic litigation as routine paperwork. Every case receives rigorous forensic evidence construction and decisive judicial intervention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Rapid Trauma-Informed Intake",
                desc: "Client meets in a completely secure, privileged environment. Our team captures timeline chronology, incident logs, and immediate safety requirements."
              },
              {
                step: "02",
                title: "Campbell Lethality Analysis",
                desc: "We screen acute risk markers (strangulation, weapon access, custody interference) using validated clinical benchmarks to establish imminent danger for the court."
              },
              {
                step: "03",
                title: "Immediate Ex-Parte Filing",
                desc: "Our litigators draft a comprehensive Points and Authorities legal memorandum, submitting emergency petitions to the presiding judge within hours."
              },
              {
                step: "04",
                title: "Trial Advocacy & Enforcement",
                desc: "We litigate the full evidentiary hearing, cross-examining the adverse party, entering digital exhibits, and securing multi-year protective decrees."
              }
            ].map((step, sIdx) => (
              <div key={sIdx} className="bg-white rounded-3xl p-6 border border-[#E6DFD5] shadow-sm relative">
                <span className="text-4xl font-black text-[#FED7A5] block mb-3">{step.step}</span>
                <h4 className="text-lg font-bold text-[#20212B] mb-2">{step.title}</h4>
                <p className="text-xs text-[#73766A] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Track Record Stats Banner (Matching Novara Stats Bar) */}
      <section id="track-record" className="py-16 bg-[#20212B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#2D4354]">
            
            <div className="pt-4 md:pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-[#FED7A5]">1,480+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-300 mt-2">Cases Successfully Resolved</p>
            </div>

            <div className="pt-4 md:pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-[#FED7A5]">98.6%</p>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-300 mt-2">Protective Injunction Win Rate</p>
            </div>

            <div className="pt-4 md:pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-[#FED7A5]">&lt; 2 Hrs</p>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-300 mt-2">Emergency Intake Filing Speed</p>
            </div>

            <div className="pt-4 md:pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-[#FED7A5]">22 Yrs</p>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-300 mt-2">Trial & Appellate Experience</p>
            </div>

          </div>
        </div>
      </section>

      {/* Leadership & Legal Team (Head Attorney & Group of Litigators) */}
      <section id="team" className="py-20 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9E6752]">Attorneys & Leadership</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#20212B] tracking-tight">
              A Dedicated Group of Litigators Working Together
            </h2>
            <p className="text-sm text-[#73766A]">
              Under the direction of Senior Managing Partner Eleanor Vance, our attorneys, forensic paralegals, and trauma advocates coordinate closely on every petition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Head of the Firm */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#2D4354] shadow-md relative flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#2D4354] text-[#FED7A5] px-3 py-1 rounded-full">
                  Head of Firm & Senior Partner
                </span>
                <h3 className="text-2xl font-bold text-[#20212B]">Eleanor Vance, Esq.</h3>
                <p className="text-xs font-bold text-[#9E6752] uppercase tracking-wider">
                  Former Family Court Referee • 22 Years Courtroom Experience
                </p>
                <p className="text-xs text-[#73766A] leading-relaxed">
                  Eleanor leads the firm&apos;s trial litigation department. Recognized by the State Bar as a leading authority on domestic violence jurisprudence, ex-parte emergency injunctions, and lethal escalation prevention.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6DFD5] text-[11px] text-[#73766A]">
                <strong>Bar Admissions:</strong> State Supreme Court, U.S. Federal District Court
              </div>
            </div>

            {/* Senior Litigator 1 */}
            <div className="bg-white rounded-3xl p-8 border border-[#E6DFD5] shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#F6EFE6] text-[#2D4354] px-3 py-1 rounded-full">
                  Partner • Forensic Evidence Specialist
                </span>
                <h3 className="text-2xl font-bold text-[#20212B]">Marcus Sterling, Esq.</h3>
                <p className="text-xs font-bold text-[#9E6752] uppercase tracking-wider">
                  Digital Discovery & Subpoena Strategist • 14 Years Experience
                </p>
                <p className="text-xs text-[#73766A] leading-relaxed">
                  Specializes in uncovering digital surveillance, extracting deleted threatening communications, and proving stalking patterns in contested family proceedings.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6DFD5] text-[11px] text-[#73766A]">
                <strong>Practice:</strong> High-Conflict Custody, Ex-Parte Discovery
              </div>
            </div>

            {/* Senior Litigator 2 */}
            <div className="bg-white rounded-3xl p-8 border border-[#E6DFD5] shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#F6EFE6] text-[#2D4354] px-3 py-1 rounded-full">
                  Senior Counsel • Protective Custody
                </span>
                <h3 className="text-2xl font-bold text-[#20212B]">Elena Rostova, Esq.</h3>
                <p className="text-xs font-bold text-[#9E6752] uppercase tracking-wider">
                  Child Welfare Litigator • 12 Years Experience
                </p>
                <p className="text-xs text-[#73766A] leading-relaxed">
                  Dedicated to defending children exposed to domestic volatility, securing emergency custody modifications, and preventing non-custodial parent flight.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6DFD5] text-[11px] text-[#73766A]">
                <strong>Practice:</strong> Emergency Child Safety & Relocation
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 bg-[#F6EFE6]/70 border-t border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9E6752]">Client Testimonials</p>
            <h2 className="text-3xl font-extrabold text-[#20212B] tracking-tight mt-1">
              Courageous Voices We Have Stood Beside
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border border-[#E6DFD5] shadow-sm space-y-4">
              <div className="flex gap-1 text-[#FED7A5]">
                {"★".repeat(5)}
              </div>
              <p className="text-sm text-[#20212B] italic leading-relaxed">
                &ldquo;When my ex-husband threatened to take our daughter out of the country, no other lawyer would move fast enough. Vance & Partners prepared a 40-page brief and was before the judge in 16 hours. The judge granted the order immediately. They saved our lives.&rdquo;
              </p>
              <p className="text-xs font-bold text-[#9E6752] uppercase tracking-wider">
                — C.M., Emergency Restraining Order Client
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E6DFD5] shadow-sm space-y-4">
              <div className="flex gap-1 text-[#FED7A5]">
                {"★".repeat(5)}
              </div>
              <p className="text-sm text-[#20212B] italic leading-relaxed">
                &ldquo;Their forensic danger analysis presented facts the opposing attorney could not refute. They treated me with unbelievable dignity and compassion while fighting like lions in court.&rdquo;
              </p>
              <p className="text-xs font-bold text-[#9E6752] uppercase tracking-wider">
                — T.H., Coercive Control Hearing Client
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Public Case Intake & Confidential Contact Section (The requested Contact Page/Module) */}
      <section id="contact" className="py-24 bg-[#20212B] text-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D4354] border border-[#FED7A5]/30 text-xs font-bold uppercase tracking-widest text-[#FED7A5]">
              <Lock className="w-3.5 h-3.5" /> 100% Confidential & Encrypted Intake
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Request Confidential Legal Consultation
            </h2>
            <p className="text-sm text-gray-300 max-w-xl mx-auto">
              Please share the basic facts of your situation. An attorney or crisis caseworker will reach out strictly via your designated safe contact method.
            </p>
          </div>

          <div className="bg-[#2D4354]/80 backdrop-blur-md rounded-3xl border border-[#FED7A5]/30 p-8 sm:p-12 shadow-2xl">
            {contactSubmitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Inquiry Received Privately</h3>
                <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                  Your details have been submitted directly to our confidential crisis legal team. We will reach out to you via your preferred safe contact window.
                </p>
                <div className="p-4 rounded-xl bg-[#20212B]/70 border border-[#73766A]/40 max-w-md mx-auto text-xs text-left text-gray-300 space-y-1">
                  <p className="font-bold text-[#FED7A5]">Immediate Safety Tips:</p>
                  <p>• Clear this browser tab from your history.</p>
                  <p>• If someone monitors your phone, use a trusted friend&apos;s device or a public library.</p>
                  <p>• 24/7 National Emergency Hotline: <strong>1-800-799-7233</strong>.</p>
                </div>
                <button
                  onClick={() => {
                    setContactSubmitted(false);
                    setContactData({
                      fullName: "",
                      contactMethod: "phone",
                      contactValue: "",
                      safeTimeToCall: "Morning (9am - 12pm)",
                      situationType: "Domestic Violence Restraining Order (DVRO)",
                      urgencyLevel: "Emergency (Within 24 Hours)",
                      caseSummary: "",
                      fileAttached: false,
                      fileName: ""
                    });
                  }}
                  className="text-xs text-[#FED7A5] font-bold uppercase tracking-wider underline hover:text-white"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name / Alias */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                      Your Full Name (Or Safe Alias) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={contactData.fullName}
                      onChange={(e) => setContactData({ ...contactData, fullName: e.target.value })}
                      className="w-full bg-[#20212B] border border-[#73766A]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FED7A5] transition-colors"
                    />
                  </div>

                  {/* Safe Contact Method */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                      Safe Phone Number or Secure Email *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. (555) 234-5678 or secure@proton.me"
                      value={contactData.contactValue}
                      onChange={(e) => setContactData({ ...contactData, contactValue: e.target.value })}
                      className="w-full bg-[#20212B] border border-[#73766A]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FED7A5] transition-colors"
                    />
                    <p className="text-[10px] text-gray-400">Ensure this device is not monitored by the adverse party.</p>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Safe Time */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                      Safe Time to Contact You
                    </label>
                    <select
                      value={contactData.safeTimeToCall}
                      onChange={(e) => setContactData({ ...contactData, safeTimeToCall: e.target.value })}
                      className="w-full bg-[#20212B] border border-[#73766A]/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FED7A5] transition-colors"
                    >
                      <option>Anytime (Safe to call)</option>
                      <option>Morning (8am - 12pm)</option>
                      <option>Afternoon (12pm - 5pm)</option>
                      <option>Evening (5pm - 8pm)</option>
                      <option>Text Message / SMS Only</option>
                      <option>Email Only</option>
                    </select>
                  </div>

                  {/* Case Category */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                      Matter Category
                    </label>
                    <select
                      value={contactData.situationType}
                      onChange={(e) => setContactData({ ...contactData, situationType: e.target.value })}
                      className="w-full bg-[#20212B] border border-[#73766A]/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FED7A5] transition-colors"
                    >
                      <option>Domestic Violence Restraining Order (DVRO)</option>
                      <option>Emergency Child Custody / Kidnapping Risk</option>
                      <option>Coercive Control & Harassment</option>
                      <option>Civil Harassment Restraining Order</option>
                      <option>Divorce with Violence Concerns</option>
                      <option>Other Urgent Legal Inquiry</option>
                    </select>
                  </div>

                  {/* Urgency */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                      Urgency Level
                    </label>
                    <select
                      value={contactData.urgencyLevel}
                      onChange={(e) => setContactData({ ...contactData, urgencyLevel: e.target.value })}
                      className="w-full bg-[#20212B] border border-[#73766A]/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FED7A5] transition-colors"
                    >
                      <option>Emergency (Within 2-4 Hours)</option>
                      <option>High Priority (Today)</option>
                      <option>Standard (Within 24 Hours)</option>
                      <option>General Consultation Planning</option>
                    </select>
                  </div>

                </div>

                {/* Brief Summary */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Brief Summary of Incident / Legal Need *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly state what occurred, any recent threats, upcoming custody exchanges, or pending court dates..."
                    value={contactData.caseSummary}
                    onChange={(e) => setContactData({ ...contactData, caseSummary: e.target.value })}
                    className="w-full bg-[#20212B] border border-[#73766A]/60 rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FED7A5] transition-colors"
                  />
                </div>

                {/* Optional Attachment Upload */}
                <div className="p-4 rounded-2xl bg-[#20212B]/50 border border-[#73766A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      Attach Evidence (Optional)
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Upload screenshot of texts, police CAD incident report, or protective order notice (PDF, JPG, PNG).
                    </p>
                  </div>
                  <label className="cursor-pointer bg-[#2D4354] hover:bg-[#2D4354]/80 text-[#FED7A5] border border-[#FED7A5]/30 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-colors">
                    <span>{contactData.fileAttached ? `Attached: ${contactData.fileName}` : "+ Choose File"}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setContactData({ ...contactData, fileAttached: true, fileName: f.name });
                          toast.success(`Attached: ${f.name}`);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Protected by Attorney-Client Privilege</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingContact}
                    className="bg-[#FED7A5] hover:bg-[#FED7A5]/90 text-[#20212B] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingContact ? "Transmitting Privately..." : "Submit Confidential Inquiry"}</span>
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </section>

      {/* Footer (Corporate Legal Disclaimers & Emergency Hotlines) */}
      <footer className="bg-[#20212B] text-gray-400 border-t border-[#2D4354] py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#2D4354] flex items-center justify-center">
                  <Scale className="h-4 w-4 text-[#FED7A5]" />
                </div>
                <span className="font-bold text-white text-base">Vance & Partners</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Specialized litigation practice dedicated to emergency domestic violence injunctions, custody defense, and forensic lethality protection.
              </p>
            </div>

            <div>
              <p className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">Direct Links</p>
              <ul className="space-y-2">
                <li><a href="#services" className="hover:text-white">Practice Areas</a></li>
                <li><a href="#how-we-solve" className="hover:text-white">Case Resolution Process</a></li>
                <li><a href="#team" className="hover:text-white">Senior Litigators</a></li>
                <li><a href="#contact" className="hover:text-white">Confidential Contact</a></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">Internal Access</p>
              <ul className="space-y-2">
                <li><Link href="/login" className="hover:text-white">Lawyer Case Intake Portal</Link></li>
                <li><Link href="/login" className="hover:text-white">Forensic Risk Analyzer</Link></li>
                <li><Link href="/login" className="hover:text-white">Administrative Console</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-white uppercase tracking-wider mb-2 text-[11px]">Crisis Contacts</p>
              <p className="text-white font-semibold">National DV Hotline: 1-800-799-7233</p>
              <p className="text-white font-semibold">Crisis Text Line: Text &quot;SAFE&quot; to 741741</p>
              <p className="text-[11px] text-gray-500 mt-2">Available 24/7/365. Free and confidential.</p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#2D4354] flex flex-col md:flex-row md:items-center justify-between gap-4 text-[11px]">
            <p>© {new Date().getFullYear()} Vance & Partners Legal Group. All rights reserved.</p>
            <p className="text-gray-500">
              Attorney Advertising. This website provides general information and does not constitute formal attorney-client retention until a written agreement is executed.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
