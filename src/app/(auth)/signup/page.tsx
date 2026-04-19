"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Zap, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // 1. Create account via API
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to create account");
      setLoading(false);
      return;
    }

    // 2. Auto sign-in with the new credentials
    const signInRes = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (signInRes?.error) {
      toast.error("Account created but sign-in failed. Please log in manually.");
      router.push("/login");
    } else {
      toast.success("Account created! Welcome to LeadGen.");
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">LeadGen</span>
          </Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your data is private and separate from other users
          </p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                required
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  minLength={8}
                  required
                  className="w-full px-3 py-2.5 pr-10 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Data separation callout */}
          <div className="pt-1 space-y-1.5">
            {[
              "Your leads are private — only you can see them",
              "Import Excel files tied to your account",
              "Separate from all other users",
            ].map((point) => (
              <div key={point} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                {point}
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By signing up you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms</a> and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Demo: <code className="text-primary">admin</code> /{" "}
          <code className="text-primary">admin</code>
        </p>
      </div>
    </div>
  );
}
