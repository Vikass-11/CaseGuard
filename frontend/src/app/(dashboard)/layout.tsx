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
} from "lucide-react";
import { getCurrentUser, getStoredEmail, isAuthenticated, logout, UserRole } from "@/lib/auth";

const NAV_ITEMS: { name: string; href: string; icon: any; roles: UserRole[] }[] = [
  { name: "Cases", href: "/dashboard", icon: FileText, roles: ["LAWYER", "CASE_WORKER", "ADMIN"] },
  { name: "New Intake", href: "/cases/new", icon: UserPlus, roles: ["LAWYER", "CASE_WORKER", "ADMIN"] },
  { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["ADMIN"] },
  { name: "Practice Analyser", href: "/practice", icon: Brain, roles: ["LAWYER", "ADMIN"] },
  // "PII Review Queue" and "System Config" from the original nav aren't built yet
  // (no page exists at those routes) — left out rather than linking to a 404.
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

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const user = getCurrentUser();
    setRole(user?.role ?? null);
    setEmail(getStoredEmail());
  }, [router]);

  const handleLogout = () => {
    logout();
  };

  const initials = email ? email.slice(0, 2).toUpperCase() : "?";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border/60 bg-background flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-40">
        <div className="h-20 flex items-center px-8 border-b border-border/60">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">CaseGuard</span>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4 px-2">Menu</p>
          {NAV_ITEMS.map((item) => {
            if (!role || !item.roles.includes(role)) return null;

            const isActive = pathname ? pathname.startsWith(item.href) : false;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={"group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm " + (isActive ? "bg-card text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground")}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-border/60 bg-muted/20">
          <div className="flex items-center space-x-3 px-2 py-2 text-sm text-muted-foreground mb-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground shadow-sm">
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-foreground text-sm truncate">{email || "Signed in"}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground truncate">{role ? role.replace('_', ' ') : ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-destructive/20"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/10">
        <header className="h-20 border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-10">
          <h1 className="text-2xl font-bold tracking-tight capitalize text-foreground">
            {pathname ? (pathname.split('/')[1] || "Dashboard") : "Dashboard"}
          </h1>
        </header>
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
