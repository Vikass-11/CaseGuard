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

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    orgName: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/auth/register", {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        orgName: form.orgName,
      });
      setSession(res.data.token, form.email);
      toast.success("Account created — welcome to CaseGuard.");
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.msg || "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-8 py-12">
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
              <CardTitle className="text-xl font-bold tracking-tight">Create an Account</CardTitle>
              <CardDescription className="text-sm font-medium">
                Register to securely access the CaseGuard platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane.doe@legal-aid.org"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border mt-4">
              <Label htmlFor="orgName" className="flex justify-between">
                <span>Organization Name</span>
                <span className="text-muted-foreground font-normal text-xs">(Creates new tenant)</span>
              </Label>
              <Input
                id="orgName"
                placeholder="e.g. Center for Family Justice"
                value={form.orgName}
                onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                You will automatically become the Administrator for this organization.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6 pb-8 px-8 border-t border-border/80 bg-muted/10 mt-6">
            <Button type="submit" className="w-full text-xs font-bold tracking-widest uppercase h-12 shadow-md hover:shadow-lg transition-all" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> CREATING ACCOUNT...
                </span>
              ) : (
                "REGISTER & CONTINUE"
              )}
            </Button>
            <div className="text-sm text-center text-muted-foreground font-medium">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      </div>
    </div>
  );
}
