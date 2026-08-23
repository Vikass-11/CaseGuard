"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
          <CardDescription>
            Register to securely access the CaseGuard platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" placeholder="Jane" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" placeholder="Doe" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="jane.doe@legal-aid.org" required />
          </div>
          
          <div className="space-y-2 pt-2 border-t border-border mt-4">
            <Label htmlFor="orgName" className="flex justify-between">
              <span>Organization Name</span>
              <span className="text-muted-foreground font-normal text-xs">(Creates new tenant)</span>
            </Label>
            <Input id="orgName" placeholder="e.g. Center for Family Justice" required />
            <p className="text-xs text-muted-foreground mt-1">
              You will automatically become the Administrator for this organization.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          <Button className="w-full text-md h-11" asChild>
            <Link href="/login">Register & Continue</Link>
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
