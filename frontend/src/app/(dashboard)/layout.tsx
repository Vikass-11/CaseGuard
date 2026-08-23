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
} from "lucide-react";
import { getCurrentUser, getStoredEmail, isAuthenticated, logout, UserRole } from "@/lib/auth";

const NAV_ITEMS: { name: string; href: string; icon: any; roles: UserRole[] }[] = [
  { name: "Cases", href: "/dashboard", icon: FileText, roles: ["LAWYER", "CASE_WORKER", "ADMIN"] },
  { name: "New Intake", href: "/cases/new", icon: UserPlus, roles: ["LAWYER", "CASE_WORKER", "ADMIN"] },
  { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["ADMIN"] },
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
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <ShieldCheck className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-lg tracking-tight">CaseGuard</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            if (!role || !item.roles.includes(role)) return null;

            const isActive = pathname ? pathname.startsWith(item.href) : false;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={"flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors " + (isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-medium text-secondary-foreground">
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-foreground truncate">{email || "Signed in"}</p>
              <p className="text-xs truncate capitalize">{role ? role.replace('_', ' ').toLowerCase() : ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/30">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold capitalize">
            {pathname ? (pathname.split('/')[1] || "Dashboard") : "Dashboard"}
          </h1>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
