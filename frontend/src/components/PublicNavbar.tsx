"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  PhoneCall
} from "lucide-react";

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  // Quick Exit function for survivor safety
  const handleQuickExit = () => {
    window.location.replace("https://www.weather.com");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "AI Sandbox", href: "/sandbox" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact & Crisis", href: "/contact" },
  ];

  return (
    <>
      {/* Trauma-Informed Safety Emergency Banner */}
      {bannerVisible && (
        <div className="bg-[#534145] text-white px-4 py-2 text-xs font-semibold flex items-center justify-between z-50 relative border-b border-[#FED7A5]/20">
          <div className="flex items-center gap-2 max-w-5xl mx-auto text-center justify-center flex-1">
            <AlertTriangle className="w-4 h-4 text-[#FED7A5] shrink-0 animate-pulse" />
            <span>
              <strong>Immediate Danger?</strong> If you are in physical danger, dial <strong>911</strong> or call the 24/7 National Domestic Violence Hotline at <strong>1-800-799-SAFE (7233)</strong>.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-3">
            <button
              onClick={handleQuickExit}
              className="bg-[#9E6752] hover:bg-[#9E6752]/90 text-white px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              title="Quickly leave this site to a neutral weather page"
            >
              <LogOut className="w-3 h-3" />
              <span>Quick Exit</span>
            </button>
            <button
              onClick={() => setBannerVisible(false)}
              className="text-gray-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#20212B]/95 backdrop-blur-md border-b border-[#2D4354] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-[#2D4354] border border-[#FED7A5]/40 flex items-center justify-center shadow-md group-hover:border-[#FED7A5] transition-all">
              <Scale className="h-5 w-5 text-[#FED7A5]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block leading-tight">
                CASEGUARD
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FED7A5]">
                Forensic Legal Advocacy & Case Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-300">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 ${
                    isActive
                      ? "text-[#FED7A5] border-b-2 border-[#FED7A5] font-bold"
                      : "hover:text-[#FED7A5]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/contact"
              className="bg-[#FED7A5] text-[#20212B] hover:bg-[#FED7A5]/90 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
            >
              Request Consultation
            </Link>
            <Link
              href="/login"
              className="border border-[#73766A]/60 hover:border-[#FED7A5] text-white hover:text-[#FED7A5] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all bg-[#2D4354]/40"
            >
              Portal Login
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-[#FED7A5] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#20212B] border-b border-[#2D4354] px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <nav className="flex flex-col space-y-3 text-sm font-semibold">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-1.5 ${
                    pathname === link.href ? "text-[#FED7A5] font-bold" : "text-gray-200 hover:text-[#FED7A5]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-[#2D4354] flex flex-col gap-2.5">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#FED7A5] text-[#20212B] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                Request Confidential Consultation
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center border border-[#73766A] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#2D4354]/50"
              >
                Portal Login
              </Link>
              <button
                onClick={handleQuickExit}
                className="w-full text-center bg-[#9E6752] text-white py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Quick Safety Exit (Weather)</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

