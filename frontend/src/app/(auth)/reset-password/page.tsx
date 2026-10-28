"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2, ArrowLeft, KeyRound, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset token is missing. Please use the link provided in your recovery email.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/auth/reset-password", { token, newPassword });
      setSuccess(true);
      toast.success(res.data?.msg || "Password reset successful.");
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      const msg = err?.response?.data?.msg || "Password reset failed. The token may be invalid or expired.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-[#E6DFD5] rounded-3xl bg-white overflow-hidden">
      {success ? (
        <div className="p-8 text-center space-y-6">
          <div className="w-14 h-14 bg-[#3A6B53]/10 text-[#3A6B53] rounded-full mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#20212B]">Password Reset Successfully</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your credentials have been securely updated. Redirecting you to the advocate sign-in portal...
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#2D4354] text-white hover:bg-[#2D4354]/90 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-2 text-center pb-6 pt-8">
            <CardTitle className="text-xl font-bold tracking-tight text-[#20212B]">
              Reset Account Password
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Create a strong new password to regain access to your case portfolio.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 px-8">
            {!tokenFromUrl && (
              <div className="space-y-2 text-left">
                <Label htmlFor="token" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Reset Authorization Token
                </Label>
                <Input
                  id="token"
                  placeholder="Paste reset token here..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="h-11 text-xs font-mono bg-[#FDFBF7] border-[#E6DFD5] rounded-xl"
                  required
                />
              </div>
            )}

            <div className="space-y-2 text-left">
              <Label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                New Password
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 h-11 text-sm bg-[#FDFBF7] border-[#E6DFD5] rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-11 text-sm bg-[#FDFBF7] border-[#E6DFD5] rounded-xl"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-4 pb-8 px-8 border-t border-[#E6DFD5] bg-[#FDFBF7]">
            <Button
              type="submit"
              className="w-full text-xs font-bold tracking-widest uppercase h-11 bg-[#2D4354] text-white hover:bg-[#2D4354]/90 rounded-xl shadow transition-all cursor-pointer"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#FED7A5]" /> UPDATING...
                </span>
              ) : (
                "CONFIRM PASSWORD RESET"
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#2D4354] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-4 sm:p-8 font-sans">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex flex-col items-center group">
            <div className="h-14 w-14 bg-[#2D4354] rounded-2xl border border-[#FED7A5]/30 flex items-center justify-center mb-4 shadow-md group-hover:border-[#FED7A5] transition-all">
              <KeyRound className="h-7 w-7 text-[#FED7A5]" strokeWidth={1.75} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#20212B]">CaseGuard</h1>
            <p className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1">
              Credential Authorization
            </p>
          </Link>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500 bg-white rounded-3xl border border-[#E6DFD5]">Loading reset token...</div>}>
          <ResetPasswordForm />
        </Suspense>

      </div>
    </div>
  );
}

