<<<<<<< Updated upstream
"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

import { signUpUser } from '@/lib/auth/client'

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const result = await signUpUser({
        role: 'nurse',
        username,
        password,
      })
      setMessage(result.message)
      setTimeout(() => {
        router.push('/login')
      }, 700)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-md items-center px-4">
      <section className="w-full rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Signup</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            required
            className="w-full rounded-md border px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            required
            className="w-full rounded-md border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {message ? <p className="text-sm text-green-700">{message}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? 'Please wait...' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Go to login
          </Link>
          .
        </p>
      </section>
    </main>
  )
=======
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Zap, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email to confirm.");
      router.push("/dashboard");
      router.refresh();
    "use client";

    import { useState } from "react";
    import Link from "next/link";
    import { useRouter } from "next/navigation";
    import { createClient } from "@/lib/supabase/client";
    import { Zap, Eye, EyeOff, Loader2 } from "lucide-react";
    import { toast } from "sonner";

    export default function SignupPage() {
      const router = useRouter();
      const supabase = createClient();
      const [fullName, setFullName] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [showPassword, setShowPassword] = useState(false);
      const [loading, setLoading] = useState(false);

      async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created! Check your email to confirm.");
          router.push("/dashboard");
          router.refresh();
        }
        setLoading(false);
      }

      async function handleGoogleLogin() {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `${location.origin}/auth/callback` },
        });
        if (error) toast.error(error.message);
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
              <p className="text-muted-foreground text-sm mt-1">Start generating leads with AI</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm font-medium mb-4"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create account
                </button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-4">
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
          </div>
        </div>
      );
    }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create account
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
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
      </div>
    </div>
  );
>>>>>>> Stashed changes
}
