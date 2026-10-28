"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Loader2, ArrowLeft, Mail, CheckCircle2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [demoToken, setDemoToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your account email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      if (res.data?.resetToken) {
        setDemoToken(res.data.resetToken);
      }
      toast.success("Password reset instructions prepared.");
    } catch (err: any) {
      const msg = err?.response?.data?.msg || "Unable to process password reset. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

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
              Account Recovery Portal
            </p>
          </Link>
        </div>

        <Card className="w-full shadow-lg border-[#E6DFD5] rounded-3xl bg-white overflow-hidden">
          {submitted ? (
            <div className="p-8 text-center space-y-6">
              <div className="w-14 h-14 bg-[#3A6B53]/10 text-[#3A6B53] rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#20212B]">Instructions Dispatched</h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  If <strong>{email}</strong> corresponds to an active account, secure password reset instructions have been generated.
                </p>
              </div>

              {demoToken && (
                <div className="p-4 rounded-xl bg-[#F6EFE6] border border-[#E6DFD5] text-left text-xs space-y-2">
                  <p className="font-bold text-[#2D4354]">Demo / Verification Token Detected:</p>
                  <p className="text-gray-600 font-mono text-[11px] break-all bg-white p-2 rounded border border-[#E6DFD5]">
                    {demoToken}
                  </p>
                  <Link
                    href={`/reset-password?token=${demoToken}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9E6752] hover:underline underline-offset-4"
                  >
                    Click here to proceed directly to Reset Password →
                  </Link>
                </div>
              )}

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2D4354] text-white hover:bg-[#2D4354]/90 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-2 text-center pb-6 pt-8">
                <CardTitle className="text-xl font-bold tracking-tight text-[#20212B]">
                  Forgot your password?
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Enter your registered legal-aid or advocate email address to receive password reset instructions.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 px-8">
                <div className="space-y-2 text-left">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="advocate@legal-aid.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      <Loader2 className="h-4 w-4 animate-spin text-[#FED7A5]" /> TRANSMITTING...
                    </span>
                  ) : (
                    "SEND RESET INSTRUCTIONS"
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

      </div>
    </div>
  );
}

