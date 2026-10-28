"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, Lock, Mail, Eye, EyeOff, LogOut, Scale, Sparkles } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { setSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      setSession(res.data.token, email);
      toast.success("Authentication successful. Welcome to CaseGuard.");
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.msg || err?.response?.data?.message || "Invalid email or password.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = (role: "admin" | "worker") => {
    if (role === "admin") {
      setEmail("admin@caseguard.com");
      setPassword("password123");
    } else {
      setEmail("worker@caseguard.com");
      setPassword("password123");
    }
    toast.info(`Filled ${role.toUpperCase()} test credentials.`);
  };

  const handleQuickExit = () => {
    window.location.replace("https://www.weather.com");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-4 sm:p-8 font-sans relative">
      
      {/* Top Bar for Safe Exit */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button
          onClick={handleQuickExit}
          className="bg-[#9E6752] hover:bg-[#9E6752]/90 text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          title="Quickly leave to a neutral weather website"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Quick Safety Exit</span>
        </button>
      </div>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex flex-col items-center group">
            <div className="h-16 w-16 bg-[#2D4354] rounded-2xl border border-[#FED7A5]/30 flex items-center justify-center mb-4 shadow-md group-hover:border-[#FED7A5] transition-all">
              <Scale className="h-8 w-8 text-[#FED7A5]" strokeWidth={1.75} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#20212B]">CaseGuard</h1>
            <p className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1">
              Forensic Legal Advocacy Portal
            </p>
          </Link>
        </div>

        <Card className="w-full shadow-xl border-[#E6DFD5] rounded-3xl bg-white overflow-hidden">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-2 text-center pb-6 pt-8">
              <CardTitle className="text-xl font-bold tracking-tight text-[#20212B]">
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 font-medium">
                Enter your credentials to access the secure case portfolio
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 px-8">
              <div className="space-y-2">
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#9E6752] hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 text-sm bg-[#FDFBF7] border-[#E6DFD5] rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Credentials Helper Pill */}
              <div className="pt-1">
                <div className="p-3 bg-[#F6EFE6] rounded-xl border border-[#E6DFD5] text-[11px] text-gray-600 space-y-1.5">
                  <span className="font-bold text-[#2D4354] block">Quick Testing Accounts:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials("admin")}
                      className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-[#E6DFD5] rounded-lg font-bold text-[#20212B] text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Fill Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials("worker")}
                      className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-[#E6DFD5] rounded-lg font-bold text-[#20212B] text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Fill Case Worker
                    </button>
                  </div>
                </div>
              </div>

            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-4 pb-8 px-8 border-t border-[#E6DFD5] bg-[#FDFBF7]">
              <Button
                type="submit"
                className="w-full text-xs font-bold tracking-widest uppercase h-11 bg-[#2D4354] text-white hover:bg-[#2D4354]/90 rounded-xl shadow-md transition-all cursor-pointer"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#FED7A5]" /> AUTHENTICATING...
                  </span>
                ) : (
                  "SIGN IN TO PORTAL"
                )}
              </Button>

              <div className="text-xs text-center text-gray-500 font-medium">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-bold text-[#2D4354] hover:underline underline-offset-4">
                  Register here
                </Link>
              </div>

              <div className="pt-2 text-[10px] text-center text-gray-400 space-x-3">
                <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
                <span>•</span>
                <Link href="/" className="hover:text-gray-600">Home</Link>
              </div>
            </CardFooter>
          </form>
        </Card>

      </div>
    </div>
  );
}
