"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  UserPlus,
  LogOut,
  Brain,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Scale,
  Settings,
  HelpCircle,
  Home
} from "lucide-react";
import { getCurrentUser, getStoredEmail, isAuthenticated, logout, UserRole } from "@/lib/auth";

const NAV_ITEMS: { name: string; href: string; icon: any; roles: UserRole[] }[] = [
  { name: "Cases", href: "/dashboard", icon: FileText, roles: ["LAWYER", "CASE_WORKER", "ADMIN"] },
  { name: "New Intake", href: "/cases/new", icon: UserPlus, roles: ["LAWYER", "CASE_WORKER", "ADMIN"] },
  { name: "Practice Analyser", href: "/practice", icon: Brain, roles: ["LAWYER", "ADMIN"] },
  { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["ADMIN"] },
  { name: "Account Settings", href: "/settings", icon: Settings, roles: ["LAWYER", "CASE_WORKER", "ADMIN"] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const user = getCurrentUser();
    setRole(user?.role ?? null);
    setEmail(getStoredEmail());
  }, [router]);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
  };

  const handleQuickExit = () => {
    window.location.replace("https://www.weather.com");
  };

  const initials = email ? email.slice(0, 2).toUpperCase() : "CG";

  const getPageTitle = () => {
    if (!pathname) return "Dashboard";
    if (pathname.includes("/analysis")) return "AI Clinical Analysis";
    if (pathname.includes("/brief")) return "Legal Case Brief Studio";
    if (pathname.includes("/cases/new")) return "New Case Intake";
    if (pathname.startsWith("/cases/")) return "Case Dossier";
    if (pathname.startsWith("/admin")) return "Administrative Portal";
    if (pathname.startsWith("/practice")) return "Practice Analyser";
    if (pathname.startsWith("/settings")) return "Account Settings";
    return "Case Management";
  };

  const renderNavLinks = () => (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3 px-3">
        Internal Systems
      </p>
      {NAV_ITEMS.map((item) => {
        if (!role || !item.roles.includes(role)) return null;

        const isActive = pathname ? pathname.startsWith(item.href) : false;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${
              isActive
                ? "bg-[#2D4354] text-white shadow-sm"
                : "text-foreground/75 hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon className={`h-4 w-4 ${isActive ? "text-[#FED7A5]" : "text-muted-foreground group-hover:text-foreground"}`} />
              <span>{item.name}</span>
            </div>
            {isActive && <ChevronRight className="h-3.5 w-3.5 text-[#FED7A5]" />}
          </Link>
        );
      })}

      <div className="pt-4 mt-4 border-t border-border/60 space-y-1">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2 px-3">
          Public & Help
        </p>
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <Scale className="h-4 w-4 text-[#9E6752]" />
            <span>Firm Website</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 opacity-60" />
        </Link>
        <Link
          href="/faq"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <HelpCircle className="h-4 w-4 text-[#73766A]" />
            <span>FAQ & Admissibility</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 opacity-60" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background print:h-auto print:overflow-visible print:block print:bg-white font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-border/80 bg-card flex-col shadow-sm relative z-40 print:hidden shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-border/70 justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#2D4354] rounded-xl flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-5 w-5 text-[#FED7A5]" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-foreground block leading-tight">CaseGuard</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E6752]">Legal Defense Suite</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          {renderNavLinks()}
        </div>

        {/* User Profile Bar */}
        <div className="p-4 border-t border-border/80 bg-muted/20">
          <Link
            href="/settings"
            className="flex items-center space-x-3 px-2 py-2 rounded-xl text-sm text-muted-foreground mb-3 hover:bg-muted/60 transition-colors group cursor-pointer"
          >
            <div className="h-9 w-9 rounded-xl bg-[#2D4354] flex items-center justify-center font-bold text-[#FED7A5] text-xs shadow-sm group-hover:scale-105 transition-transform">
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-foreground text-xs truncate group-hover:text-primary transition-colors">{email || "Counselor"}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#9E6752] truncate">
                {role ? role.replace('_', ' ') : 'ATTORNEY'}
              </p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-bold tracking-wider uppercase text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all cursor-pointer border border-border/60 hover:border-destructive/20"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-card h-full flex flex-col shadow-2xl border-r border-border/80 z-50">
            <div className="h-16 flex items-center justify-between px-5 border-b border-border/70">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-[#2D4354] rounded-lg flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-[#FED7A5]" />
                </div>
                <span className="font-bold text-base text-foreground">CaseGuard</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5 px-4">
              {renderNavLinks()}
            </div>

            <div className="p-4 border-t border-border/80 bg-muted/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-[#2D4354] flex items-center justify-center font-bold text-[#FED7A5] text-xs">
                  {initials}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-foreground text-xs truncate">{email || "Counselor"}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{role ? role.replace('_', ' ') : ''}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-bold uppercase text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background flex flex-col print:h-auto print:overflow-visible print:block print:bg-white">
        {/* Sticky App Header */}
        <header className="h-16 sm:h-20 border-b border-border/70 bg-card/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-foreground hover:bg-muted border border-border/70"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight capitalize text-foreground leading-tight">
                {getPageTitle()}
              </h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Forensic Case Management & Clinical Risk Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Safety Exit Button */}
            <button
              onClick={handleQuickExit}
              className="bg-[#9E6752] hover:bg-[#9E6752]/90 text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Quickly exit this site to weather.com"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quick Exit</span>
            </button>

            <Link
              href="/settings"
              className="flex items-center gap-2 pl-2 border-l border-border/60 hover:opacity-85 transition-opacity"
              title="View Profile & Settings"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#2D4354] flex items-center justify-center font-bold text-[#FED7A5] text-xs shadow-sm">
                {initials}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 print:block">
          {children}
        </div>
      </main>
    </div>
  );
}
