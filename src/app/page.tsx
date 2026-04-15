<<<<<<< Updated upstream
import { requireAuth } from '@/lib/auth/require-auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  await requireAuth()
  redirect('/dashboard')
=======
import Link from "next/link";
import {
  Search,
  FileText,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">LeadGen</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative py-24 sm:py-32 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-violet-500/8 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Powered by Claude AI
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Turn any company into{" "}
              <span className="gradient-text">a warm lead</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Give LeadGen a target company. It researches them across LinkedIn,
              news, social media, and their website — then writes a personalized
              outreach message that actually gets replies.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
              <Link
                href="/signup"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                Start for free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all font-medium text-base"
              >
                Sign in to dashboard
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {["Lead Research", "Outreach Messages", "Proposal Generator", "CRM Dashboard"].map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Everything you need to win more clients
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Three powerful tools that work together — from finding leads to closing them.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Search,
                  color: "text-blue-400",
                  bg: "bg-blue-500/10",
                  title: "Lead Research Engine",
                  desc: "Point it at any company or contact. It searches across LinkedIn, news, social media, and their website — then synthesizes a full intelligence brief with pain points, conversation hooks, and recent moves.",
                  price: "$2,000–$3,000 setup",
                },
                {
                  icon: FileText,
                  color: "text-violet-400",
                  bg: "bg-violet-500/10",
                  title: "Proposal Generator",
                  desc: "Client fills out a 2-minute intake form. LeadGen outputs a full, formatted proposal: executive summary, scope, deliverables, timeline, and pricing — ready to send.",
                  price: "$1,000–$2,000 setup",
                },
                {
                  icon: BarChart3,
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10",
                  title: "Lead CRM & Pipeline",
                  desc: "Track every lead from research to close. Kanban board, notes, tags, and activity history. See your pipeline at a glance and never let a hot lead go cold.",
                  price: "Included in full suite",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="glass rounded-2xl p-6 hover:border-primary/30 transition-colors group"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{feature.desc}</p>
                  <div className="text-xs font-medium text-primary">{feature.price}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 px-4 border-t border-border/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
              <p className="text-muted-foreground text-lg">From zero to personalized outreach in under 60 seconds.</p>
            </div>
            <div className="space-y-8">
              {[
                { step: "01", icon: Search, title: "Enter a target", desc: "Type in a company name, contact name, or paste a LinkedIn URL." },
                { step: "02", icon: TrendingUp, title: "AI researches them", desc: "LeadGen runs 5 parallel searches across news, LinkedIn, social media, and their website — then Claude synthesizes a full intelligence brief." },
                { step: "03", icon: MessageSquare, title: "Get a personalized message", desc: "Choose your tone and channel. Get an outreach message that references their specific situation, recent news, and pain points." },
                { step: "04", icon: Users, title: "Track and close", desc: "Save leads to your CRM, send proposals, and track everything from new lead to closed deal." },
              ].map((step, i) => (
                <div key={step.step} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="text-xs font-mono text-primary mb-1">STEP {step.step}</div>
                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-4 border-t border-border/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-muted-foreground text-lg">Built to be resold as a done-for-you service.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Research Tool",
                  price: "$2,000–$3,000",
                  label: "setup fee",
                  features: ["Lead research pipeline", "Personalized outreach", "5 tones + 3 channels", "Research history"],
                  cta: "Get started",
                  highlight: false,
                },
                {
                  name: "Full Suite",
                  price: "$3,500–$5,000",
                  label: "setup fee",
                  features: ["Everything in Research", "Proposal generator", "PDF export", "CRM & pipeline", "Priority support"],
                  cta: "Most popular",
                  highlight: true,
                },
                {
                  name: "Proposal Generator",
                  price: "$1,000–$2,000",
                  label: "setup fee",
                  features: ["Client intake form", "AI proposal generation", "Timeline & pricing", "PDF export"],
                  cta: "Get started",
                  highlight: false,
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-6 border ${plan.highlight ? "border-primary/50 bg-primary/5" : "border-border bg-card"}`}
                >
                  {plan.highlight && (
                    <div className="text-xs font-medium text-primary mb-3">MOST POPULAR</div>
                  )}
                  <div className="text-lg font-semibold mb-1">{plan.name}</div>
                  <div className="text-3xl font-bold mb-1">{plan.price}</div>
                  <div className="text-xs text-muted-foreground mb-6">{plan.label}</div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      plan.highlight
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-border hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 border-t border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to close more deals?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join agencies and sales teams using LeadGen to research smarter and outreach better.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-gradient flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span>LeadGen by CyberRush</span>
          </div>
          <div>© {new Date().getFullYear()} CyberRush. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
>>>>>>> Stashed changes
}
