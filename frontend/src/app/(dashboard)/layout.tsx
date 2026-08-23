"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  UserPlus, 
  Settings, 
  LogOut,
  AlertTriangle
} from "lucide-react";

// Mocking role for now (would come from Auth Context)
const MOCK_USER_ROLE: "LAWYER" | "CASE_WORKER" | "ADMIN" = "LAWYER";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { name: "Cases", href: "/cases", icon: FileText, roles: ["LAWYER", "CASE_WORKER", "ADMIN"] },
    { name: "New Intake", href: "/intake", icon: UserPlus, roles: ["LAWYER", "CASE_WORKER", "ADMIN"] },
    { name: "PII Review Queue", href: "/privacy-queue", icon: ShieldCheck, roles: ["LAWYER", "ADMIN"] },
    { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["ADMIN"] },
    { name: "System Config", href: "/config", icon: Settings, roles: ["ADMIN"] },
  ];

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
            if (!item.roles.includes(MOCK_USER_ROLE)) return null;
            
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
              JD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-foreground truncate">Jane Doe</p>
              <p className="text-xs truncate capitalize">{MOCK_USER_ROLE.replace('_', ' ').toLowerCase()}</p>
            </div>
          </div>
          <button className="w-full mt-2 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold capitalize">
            {pathname ? (pathname.split('/')[1] || "Dashboard") : "Dashboard"}
          </h1>
          {/* Example of a trauma-informed mild warning, not blaring red */}
          {MOCK_USER_ROLE === "ADMIN" && (
            <div className="flex items-center space-x-2 bg-accent/20 text-accent-foreground px-3 py-1.5 rounded-full text-sm font-medium border border-accent/30">
              <AlertTriangle className="h-4 w-4" />
              <span>3 Referrals Need Verification</span>
            </div>
          )}
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
