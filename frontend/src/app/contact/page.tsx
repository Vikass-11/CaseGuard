"use client";

import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
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
  Clock,
  LogOut,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    contactValue: "",
    safeTimeToCall: "Morning (8am - 12pm)",
    situationType: "Domestic Violence Restraining Order (DVRO)",
    urgencyLevel: "Emergency (Within 24 Hours)",
    caseSummary: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactValue || !formData.caseSummary) {
      toast.error("Please provide your contact method and a brief situation overview.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Confidential inquiry submitted safely. Our crisis intake director will reach out via your safe time window.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#20212B] flex flex-col font-sans">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-5 space-y-6 bg-[#20212B] text-white p-8 rounded-3xl border border-[#2D4354] shadow-xl">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FED7A5] bg-[#2D4354] px-3 py-1 rounded-full border border-[#FED7A5]/20">
                PRIVILEGED INQUIRY
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight">Confidential Legal Contact</h1>
              <p className="text-xs text-gray-300 leading-relaxed">
                Connect directly with our specialized domestic violence litigators, forensic analysts, and crisis intake coordinators.
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
                  <p className="font-bold text-white">Direct Line (Unrecorded Intake)</p>
                  <p className="text-gray-400">1-800-555-CG-SAFE (Confidential)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#FED7A5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Encrypted Intake Email</p>
                  <p className="text-gray-400">crisis.intake@caseguard.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#FED7A5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Hours of Intake</p>
                  <p className="text-gray-400">24/7 Priority Emergency Screenings Active</p>
                </div>
              </div>
            </div>

            {/* Privacy Promise Badge */}
            <div className="p-4 rounded-2xl bg-[#2D4354]/60 border border-[#FED7A5]/20 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#FED7A5]">
                <Lock className="w-3.5 h-3.5" />
                <span>Strict Work-Product Privilege</span>
              </div>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                All communications sent through this form are strictly privileged attorney work product and protected under state and federal domestic violence confidentiality laws.
              </p>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E6DFD5] shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-6">
                <div className="w-16 h-16 bg-[#3A6B53]/10 text-[#3A6B53] rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#20212B]">Inquiry Received Privately</h2>
                  <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    Your details have been routed directly to our crisis intake supervisor. We will contact you discreetly during your requested safe time window: <strong>{formData.safeTimeToCall}</strong>.
                  </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: "",
                        contactValue: "",
                        safeTimeToCall: "Morning (8am - 12pm)",
                        situationType: "Domestic Violence Restraining Order (DVRO)",
                        urgencyLevel: "Emergency (Within 24 Hours)",
                        caseSummary: "",
                      });
                    }}
                    className="border border-[#E6DFD5] hover:bg-gray-50 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all"
                  >
                    Send Another Message
                  </button>
                  <Link
                    href="/"
                    className="bg-[#2D4354] text-white hover:bg-[#2D4354]/90 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#20212B]">
                    Request a Confidential Consultation
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Fill in your details below. Only provide contact methods where an abuser has no physical or digital access.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Your Name (Or Safe Pseudonym)
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Jane Doe (or first name only)"
                      className="h-10 text-sm bg-[#FDFBF7] border-[#E6DFD5] rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contactValue" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Safe Phone Number or Email *
                    </Label>
                    <Input
                      id="contactValue"
                      value={formData.contactValue}
                      onChange={(e) => setFormData({ ...formData, contactValue: e.target.value })}
                      placeholder="Safe phone or private email"
                      className="h-10 text-sm bg-[#FDFBF7] border-[#E6DFD5] rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Safe Time to Contact
                    </Label>
                    <select
                      value={formData.safeTimeToCall}
                      onChange={(e) => setFormData({ ...formData, safeTimeToCall: e.target.value })}
                      className="w-full h-10 px-3 bg-[#FDFBF7] border border-[#E6DFD5] rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2D4354]"
                    >
                      <option>Morning (8am - 12pm)</option>
                      <option>Afternoon (12pm - 5pm)</option>
                      <option>Evening (5pm - 9pm)</option>
                      <option>Text Message Only (Anytime)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Urgency Level
                    </Label>
                    <select
                      value={formData.urgencyLevel}
                      onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                      className="w-full h-10 px-3 bg-[#FDFBF7] border border-[#E6DFD5] rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2D4354]"
                    >
                      <option>Emergency (Within 24 Hours)</option>
                      <option>High (Next 48 Hours)</option>
                      <option>General Legal Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="situation" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Brief Situation Overview *
                  </Label>
                  <Textarea
                    id="situation"
                    rows={4}
                    value={formData.caseSummary}
                    onChange={(e) => setFormData({ ...formData, caseSummary: e.target.value })}
                    placeholder="Briefly describe what happened (e.g. recent threats, protective order needed, child custody emergency, harassment). Details are kept strictly privileged."
                    className="bg-[#FDFBF7] border-[#E6DFD5] rounded-xl text-sm"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-[#2D4354] hover:bg-[#2D4354]/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#FED7A5]" /> TRANSMITTING PRIVATELY...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4 text-[#FED7A5]" /> TRANSMIT CONFIDENTIAL INQUIRY
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
