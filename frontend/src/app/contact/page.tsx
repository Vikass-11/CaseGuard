"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Send,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock
} from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    contactValue: "",
    safeTimeToCall: "Morning (8am - 12pm)",
    situationType: "Domestic Violence Restraining Order (DVRO)",
    urgencyLevel: "Emergency (Within 24 Hours)",
    caseSummary: "",
    fileAttached: false,
    fileName: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleQuickExit = () => {
    window.location.replace("https://www.google.com");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactValue || !formData.caseSummary) {
      toast.error("Please fill in contact method and situation summary.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Confidential inquiry submitted safely.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#20212B]">
      {/* Quick Exit Header */}
      <div className="bg-[#534145] text-white px-4 py-2 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <AlertTriangle className="w-3.5 h-3.5 text-[#FED7A5]" />
          <span>If in immediate physical danger, dial <strong>911</strong> or call <strong>1-800-799-SAFE</strong>.</span>
        </div>
        <button
          onClick={handleQuickExit}
          className="bg-[#9E6752] hover:bg-[#9E6752]/90 text-white px-3 py-1 rounded text-[11px] font-bold uppercase"
        >
          Quick Exit ✕
        </button>
      </div>

      <header className="bg-[#20212B] border-b border-[#2D4354] py-5 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#2D4354] border border-[#FED7A5]/30 flex items-center justify-center">
              <Scale className="h-5 w-5 text-[#FED7A5]" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg">Vance & Partners</span>
              <span className="block text-[10px] text-[#FED7A5] font-bold uppercase">Legal Defense Suite</span>
            </div>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-[#FED7A5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-5 space-y-6 bg-[#20212B] text-white p-8 rounded-3xl border border-[#2D4354] shadow-xl">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FED7A5] bg-[#2D4354] px-2.5 py-1 rounded-full">
                Privileged Inquiry
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight">Confidential Legal Contact</h1>
              <p className="text-xs text-gray-300 leading-relaxed">
                Connect directly with Senior Managing Partner Eleanor Vance and our specialized restraining order litigation team.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#2D4354] text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FED7A5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Central Law Chambers</p>
                  <p className="text-gray-400">450 Judicial Way, Suite 1200, Metro City</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#FED7A5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Crisis Intake Dispatch</p>
                  <p className="text-gray-400">(800) 555-VANCE • Available 24/7</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#FED7A5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Secure Encrypted Inquiries</p>
                  <p className="text-gray-400">intake@vancelegalpartners.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#FED7A5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Emergency Court Timelines</p>
                  <p className="text-gray-400">Ex-Parte applications filed same day before 1:30 PM court cutoff</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#2D4354]/60 border border-[#FED7A5]/20 text-[11px] text-gray-300 space-y-1">
              <p className="font-bold text-[#FED7A5]">Browser Privacy:</p>
              <p>All submissions over this form are SSL encrypted and protected under attorney work-product privilege.</p>
            </div>
          </div>

          {/* Right Intake Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E6DFD5] shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-[#20212B]">Case Submission Received</h2>
                <p className="text-sm text-[#73766A] max-w-md mx-auto">
                  Our case intake director has queued your file for urgent legal review. Expect a call or message via your safe contact instructions.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold uppercase text-[#2D4354] hover:underline"
                >
                  Submit Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-bold text-[#20212B]">Tell Us What Occurred</h2>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-[#73766A]">Your Name or Alias *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#FDFBF7] border border-[#E6DFD5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D4354]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-[#73766A]">Safe Phone or Email *</label>
                  <input
                    type="text"
                    required
                    placeholder="Safe number or private email"
                    value={formData.contactValue}
                    onChange={(e) => setFormData({ ...formData, contactValue: e.target.value })}
                    className="w-full bg-[#FDFBF7] border border-[#E6DFD5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D4354]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-[#73766A]">Urgency</label>
                    <select
                      value={formData.urgencyLevel}
                      onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                      className="w-full bg-[#FDFBF7] border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-xs"
                    >
                      <option>Emergency (Immediate Filing)</option>
                      <option>High Priority (Next 24h)</option>
                      <option>Standard Case Consultation</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-[#73766A]">Matter Type</label>
                    <select
                      value={formData.situationType}
                      onChange={(e) => setFormData({ ...formData, situationType: e.target.value })}
                      className="w-full bg-[#FDFBF7] border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-xs"
                    >
                      <option>Domestic Violence Restraining Order</option>
                      <option>Child Custody Emergency</option>
                      <option>Coercive Control / Stalking</option>
                      <option>Civil Injunction Proceeding</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-[#73766A]">Incident Narrative *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Brief description of threats, physical contact, timeline dates..."
                    value={formData.caseSummary}
                    onChange={(e) => setFormData({ ...formData, caseSummary: e.target.value })}
                    className="w-full bg-[#FDFBF7] border border-[#E6DFD5] rounded-xl p-4 text-sm focus:outline-none focus:border-[#2D4354]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#2D4354] hover:bg-[#20212B] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#FED7A5]" />
                  <span>{submitting ? "Transmitting..." : "Send Confidential Message"}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
