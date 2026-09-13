"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
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
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      setSession(res.data.token, email);
      toast.success("Signed in successfully.");
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.msg || "Invalid email or password.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center mb-6 shadow-sm">
            <ShieldCheck className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground text-center">CaseGuard</h1>
          <p className="text-muted-foreground text-sm font-medium tracking-wide mt-2 text-center">Secure Legal Management System</p>
        </div>

        <Card className="w-full shadow-xl border-border/80 rounded-2xl bg-card">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-2 text-center pb-8 pt-8">
              <CardTitle className="text-xl font-bold tracking-tight">Sign in to your account</CardTitle>
              <CardDescription className="text-sm font-medium">
                Enter your credentials to access the secure case environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-8">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane.doe@legal-aid.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6 pb-8 px-8 border-t border-border/80 bg-muted/10 mt-6">
            <Button type="submit" className="w-full text-xs font-bold tracking-widest uppercase h-12 shadow-md hover:shadow-lg transition-all" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> SIGNING IN...
                </span>
              ) : (
                "SIGN IN"
              )}
            </Button>
            <div className="text-sm text-center text-muted-foreground font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline underline-offset-4">
                Register here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      </div>
    </div>
  );
}
