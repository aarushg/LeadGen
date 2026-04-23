"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

const QUICK_ACCOUNTS = [
  { name: "Admin", email: "admin", password: "admin", color: "bg-violet-500" },
  { name: "Demo User", email: "demo@leadgen.local", password: "password", color: "bg-emerald-500" },
];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<string | null>(null);

  async function signInWith(e: string, p: string, label: string) {
    setQuickLoading(label);
    const res = await signIn("credentials", { redirect: false, email: e, password: p });
    if (res?.error) {
      toast.error("Login failed");
      setQuickLoading(null);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { redirect: false, email, password });
    if (res?.error) {
      toast.error("Invalid credentials");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm space-y-5">
      {/* Quick account tiles */}
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3 text-center">
          Quick access — click to sign in
        </p>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACCOUNTS.map((acct) => (
            <button
              key={acct.name}
              onClick={() => signInWith(acct.email, acct.password, acct.name)}
              disabled={!!quickLoading}
              className="flex flex-col items-center gap-2.5 p-4 glass rounded-2xl hover:border-primary/50 transition-all group disabled:opacity-60"
            >
              <div className={`w-11 h-11 rounded-full ${acct.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                {quickLoading === acct.name
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : initials(acct.name)
                }
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">{acct.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{acct.email}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or sign in manually</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Manual form */}
      <form className="glass rounded-2xl p-5 space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Username or Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin or you@company.com"
            required
            className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium">Password</label>
            <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign in
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline font-medium">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
