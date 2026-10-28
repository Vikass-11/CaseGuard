"use client";

import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  PhoneCall,
  Lock,
  HeartHandshake,
  LogOut,
  ArrowUpRight
} from "lucide-react";

export default function PublicFooter() {
  const handleQuickExit = () => {
    window.location.replace("https://www.weather.com");
  };

  return (
    <footer className="bg-[#20212B] text-gray-300 border-t border-[#2D4354]">
      {/* Emergency Crisis Strip */}
      <div className="bg-[#534145] text-white py-4 px-4 sm:px-6 border-b border-[#2D4354]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FED7A5]/20 flex items-center justify-center text-[#FED7A5]">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">24/7 National Domestic Violence Helpline:</span>
              <span className="text-[#FED7A5] font-semibold">1-800-799-SAFE (7233) • Text &quot;START&quot; to 88788</span>
            </div>
          </div>
          <button
            onClick={handleQuickExit}
            className="bg-[#9E6752] hover:bg-[#9E6752]/90 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Quick Safety Exit</span>
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#2D4354] border border-[#FED7A5]/40 flex items-center justify-center shadow-md">
                <Scale className="h-5 w-5 text-[#FED7A5]" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white block leading-tight">
                  CASEGUARD
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FED7A5]">
                  Forensic Legal Advocacy & Lethality Intelligence
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              A privacy-first clinical decision-support and case management platform designed for legal-aid attorneys, advocates, and trial litigators handling complex domestic violence proceedings.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2D4354]/60 border border-[#73766A]/40 text-[#FED7A5]">
                <ShieldCheck className="w-3.5 h-3.5" /> VAWA & CJIS Aligned
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2D4354]/60 border border-[#73766A]/40 text-[#FED7A5]">
                <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FED7A5] mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">FAQ & Knowledge Base</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact & Crisis Intake</Link>
              </li>
            </ul>
          </div>

          {/* Internal Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FED7A5] mb-4">
              Advocate Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1">
                  Advocate Portal <ArrowUpRight className="w-3 h-3 text-[#FED7A5]" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">Case Directory</Link>
              </li>
              <li>
                <Link href="/cases/new" className="hover:text-white transition-colors">Intake Studio</Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-white transition-colors">Practice Analyser</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">System Admin</Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FED7A5] mb-4">
              Legal & Privacy
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
              </li>
              <li>
                <Link href="/forbidden" className="hover:text-white transition-colors">Access Controls (403)</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Privileged Notice */}
        <div className="mt-12 pt-8 border-t border-[#2D4354] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} CaseGuard Legal Systems, Inc. All rights reserved. Confidential Attorney Work-Product.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-gray-400 transition-colors">Cookies</Link>
            <button onClick={handleQuickExit} className="hover:text-[#FED7A5] transition-colors underline cursor-pointer">
              Quick Exit
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

