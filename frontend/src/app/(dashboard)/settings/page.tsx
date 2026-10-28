"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { getCurrentUser, getStoredEmail, logout, setSession } from "@/lib/auth";
import {
  User,
  Shield,
  KeyRound,
  Building,
  Mail,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  LogOut,
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password change states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setProfile(res.data);
      setName(res.data.name || "");
    } catch (err: any) {
      console.warn("Could not fetch detailed /auth/me profile, using stored session", err);
      const user = getCurrentUser();
      const email = getStoredEmail();
      setProfile({
        name: email ? email.split("@")[0] : "Advocate",
        email: email || "user@caseguard.com",
        role: user?.role || "CASE_WORKER",
        organizationId: user?.organizationId || "Default Org",
        createdAt: new Date().toISOString()
      });
      if (email) setName(email.split("@")[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await api.put("/auth/profile", { name });
      toast.success("Profile updated successfully.");
      fetchProfile();
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || "Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await api.put("/auth/change-password", { newPassword });
      if (res.data?.token) {
        setSession(res.data.token);
      }
      toast.success("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-sm text-gray-500 font-medium">
        Loading user account profile...
      </div>
    );
  }

  const roleBadgeColor =
    profile?.role === "ADMIN"
      ? "bg-[#534145] text-white"
      : profile?.role === "LAWYER"
      ? "bg-[#2D4354] text-white"
      : "bg-[#73766A] text-white";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans pb-16">
      
      {/* Top Banner */}
      <div className="bg-card p-8 rounded-3xl border border-border/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#2D4354] text-[#FED7A5] flex items-center justify-center font-extrabold text-2xl shadow-md border border-[#FED7A5]/30">
            {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "CG"}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                {profile?.name || "Legal Advocate"}
              </h1>
              <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full ${roleBadgeColor}`}>
                {profile?.role || "CASE_WORKER"}
              </span>
            </div>
            <p className="text-muted-foreground text-xs font-medium mt-1">
              {profile?.email} • Member since {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="inline-flex items-center gap-2 border border-border hover:bg-destructive/10 hover:border-destructive hover:text-destructive px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-muted-foreground transition-all cursor-pointer self-start sm:self-center"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList className="bg-card border border-border/80 p-1 rounded-2xl h-auto">
          <TabsTrigger
            value="general"
            className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            Profile Information
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            Security & Password
          </TabsTrigger>
          <TabsTrigger
            value="compliance"
            className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            Privacy & Governance
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: General Profile */}
        <TabsContent value="general">
          <Card className="rounded-3xl border-border/80 shadow-sm">
            <form onSubmit={handleUpdateProfile}>
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-lg font-bold text-foreground">Personal Details</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Update your advocate display name and review account organization mapping.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Display Name
                    </Label>
                    <Input
                      id="displayName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jane Doe, Esq."
                      className="h-11 rounded-xl bg-background text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailDisplay" className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Email Address (Locked)
                    </Label>
                    <Input
                      id="emailDisplay"
                      value={profile?.email || ""}
                      disabled
                      className="h-11 rounded-xl bg-muted/50 text-sm font-mono cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Assigned Role
                    </Label>
                    <div className="h-11 rounded-xl bg-muted/50 px-4 flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {profile?.role} (Managed by System Administrator)
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Tenant Organization ID
                    </Label>
                    <div className="h-11 rounded-xl bg-muted/50 px-4 flex items-center text-xs font-mono text-muted-foreground truncate">
                      {profile?.organizationId || "Shared Practice Group"}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-4 border-t border-border/60 bg-muted/10 flex justify-end">
                <Button
                  type="submit"
                  disabled={updatingProfile}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase tracking-wider px-6 h-11 rounded-xl shadow-sm transition-all"
                >
                  {updatingProfile ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save Changes
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab 2: Security & Password */}
        <TabsContent value="security">
          <Card className="rounded-3xl border-border/80 shadow-sm">
            <form onSubmit={handleChangePassword}>
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-lg font-bold text-foreground">Change Password</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Update your authentication credentials. We recommend a passphrase of at least 8 characters.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPass" className="text-xs font-bold uppercase tracking-wider text-foreground">
                      New Password
                    </Label>
                    <Input
                      id="newPass"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-11 rounded-xl bg-background text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPass" className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPass"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 rounded-xl bg-background text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-xs text-muted-foreground space-y-1.5">
                  <p className="font-bold text-foreground">Password Standards:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Minimum 6 characters (8+ recommended).</li>
                    <li>Avoid reusing credentials across other non-confidential platforms.</li>
                    <li>Changing your password updates your active JWT session token immediately.</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-4 border-t border-border/60 bg-muted/10 flex justify-end">
                <Button
                  type="submit"
                  disabled={updatingPassword}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase tracking-wider px-6 h-11 rounded-xl shadow-sm transition-all"
                >
                  {updatingPassword ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                    </span>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab 3: Compliance & Data Sovereignty */}
        <TabsContent value="compliance">
          <Card className="rounded-3xl border-border/80 shadow-sm p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Trauma-Informed Security Baseline</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Overview of active safeguards protecting this advocate workstation and case records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-border/80 bg-muted/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A6B53]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Presidio PII Anonymizer</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Active for all victim statement entries and intake submissions. Names, locations, and phone numbers are scrubbed before inference.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border/80 bg-muted/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A6B53]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zero Model Training</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your tenant files and transcripts are isolated and never retained for foundation model fine-tuning.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border/80 bg-muted/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A6B53]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tamper-Evident Audit Trails</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every case addition, document upload, and severity override is permanently logged with your actor ID to uphold evidentiary chain of custody.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border/80 bg-muted/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A6B53]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Role-Based Tenant Guard</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Server-side authorization verifies your role and organization identifier on every single REST API request.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}

