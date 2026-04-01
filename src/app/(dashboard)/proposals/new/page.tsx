"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Globe,
  Megaphone,
  Search,
  Mail,
  Share2,
  Palette,
  PenTool,
  LayoutDashboard,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PROJECT_TYPES = [
  { value: "website", label: "Website", icon: Globe },
  { value: "seo", label: "SEO", icon: Search },
  { value: "paid-ads", label: "Paid Ads", icon: Megaphone },
  { value: "branding", label: "Branding", icon: Palette },
  { value: "social-media", label: "Social Media", icon: Share2 },
  { value: "email-marketing", label: "Email", icon: Mail },
  { value: "content", label: "Content", icon: PenTool },
  { value: "full-marketing", label: "Full Suite", icon: LayoutDashboard },
  { value: "custom", label: "Custom", icon: Zap },
];

const BUDGET_RANGES = [
  { value: "under-5k", label: "Under $5k" },
  { value: "5k-10k", label: "$5k – $10k" },
  { value: "10k-25k", label: "$10k – $25k" },
  { value: "25k-50k", label: "$25k – $50k" },
  { value: "50k-100k", label: "$50k – $100k" },
  { value: "100k+", label: "$100k+" },
];

export default function NewProposalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);

  const [form, setForm] = useState({
    clientName: "",
    clientCompany: searchParams.get("clientCompany") || "",
    clientEmail: "",
    projectType: "",
    projectGoals: "",
    budgetRange: "",
    timelineWeeks: 8,
    additionalContext: "",
    leadId: searchParams.get("leadId") || "",
  });

  function update(key: string, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate proposal");
      }
      const { proposal } = await res.json();
      toast.success("Proposal generated!");
      router.push(`/proposals/${proposal.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
      setGenerating(false);
    }
  }

  const canProceedStep1 = form.clientName && form.clientCompany;
  const canProceedStep2 = form.projectType;
  const canProceedStep3 = form.projectGoals.length >= 20 && form.budgetRange;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold">New Proposal</h1>
          <p className="text-muted-foreground text-sm">Step {step} of 4</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all",
              s <= step ? "bg-primary" : "bg-secondary"
            )}
          />
        ))}
      </div>

      {/* Step 1: Client Info */}
      {step === 1 && (
        <div className="glass rounded-2xl p-5 space-y-4 animate-fade-in">
          <div>
            <h2 className="font-semibold mb-1">Client Information</h2>
            <p className="text-sm text-muted-foreground">Who is this proposal for?</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Client Name <span className="text-destructive">*</span></label>
            <input
              value={form.clientName}
              onChange={(e) => update("clientName", e.target.value)}
              placeholder="Jane Smith"
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Client Company <span className="text-destructive">*</span></label>
            <input
              value={form.clientCompany}
              onChange={(e) => update("clientCompany", e.target.value)}
              placeholder="Acme Corp"
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Client Email</label>
            <input
              type="email"
              value={form.clientEmail}
              onChange={(e) => update("clientEmail", e.target.value)}
              placeholder="jane@acme.com"
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none text-sm"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!canProceedStep1}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Project Type */}
      {step === 2 && (
        <div className="glass rounded-2xl p-5 space-y-4 animate-fade-in">
          <div>
            <h2 className="font-semibold mb-1">Project Type</h2>
            <p className="text-sm text-muted-foreground">What service are you proposing?</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {PROJECT_TYPES.map((pt) => (
              <button
                key={pt.value}
                type="button"
                onClick={() => update("projectType", pt.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all",
                  form.projectType === pt.value
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "border-border hover:border-primary/20 text-muted-foreground hover:text-foreground"
                )}
              >
                <pt.icon className="w-5 h-5" />
                {pt.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={!canProceedStep2}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 3: Goals + Budget */}
      {step === 3 && (
        <div className="glass rounded-2xl p-5 space-y-4 animate-fade-in">
          <div>
            <h2 className="font-semibold mb-1">Project Scope</h2>
            <p className="text-sm text-muted-foreground">Goals, budget, and timeline.</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Project Goals <span className="text-destructive">*</span></label>
            <textarea
              value={form.projectGoals}
              onChange={(e) => update("projectGoals", e.target.value)}
              placeholder="What does the client want to achieve? E.g., increase organic traffic by 50%, launch a new brand identity for a Series A fundraise..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none text-sm resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {form.projectGoals.length}/20 characters minimum
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Budget Range <span className="text-destructive">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              {BUDGET_RANGES.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => update("budgetRange", b.value)}
                  className={cn(
                    "py-2 px-3 rounded-lg border text-xs font-medium transition-colors",
                    form.budgetRange === b.value
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Timeline: <span className="text-primary">{form.timelineWeeks} weeks</span>
            </label>
            <input
              type="range"
              min={1}
              max={52}
              value={form.timelineWeeks}
              onChange={(e) => update("timelineWeeks", parseInt(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 week</span>
              <span>52 weeks</span>
            </div>
          </div>

          <button
            onClick={() => setStep(4)}
            disabled={!canProceedStep3}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 4: Review + Generate */}
      {step === 4 && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass rounded-2xl p-5">
            <h2 className="font-semibold mb-4">Review & Generate</h2>

            <div className="space-y-3">
              {[
                { label: "Client", value: `${form.clientName} · ${form.clientCompany}` },
                { label: "Project", value: PROJECT_TYPES.find(p => p.value === form.projectType)?.label || form.projectType },
                { label: "Budget", value: BUDGET_RANGES.find(b => b.value === form.budgetRange)?.label || form.budgetRange },
                { label: "Timeline", value: `${form.timelineWeeks} weeks` },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <label className="text-sm font-medium mb-2 block">Additional Context (optional)</label>
            <textarea
              value={form.additionalContext}
              onChange={(e) => update("additionalContext", e.target.value)}
              placeholder="Anything else the AI should know? Past work, special requirements, competitor context..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none text-sm resize-none"
            />
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Claude AI will generate:</p>
                <ul className="mt-1 space-y-0.5">
                  {["Executive summary", "Scope of work", "Deliverables", "Week-by-week timeline", "Pricing table", "Terms & CTA"].map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 shadow-lg shadow-primary/20"
          >
            {generating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating proposal...</>
            ) : (
              <><FileText className="w-5 h-5" /> Generate Proposal</>
            )}
          </button>

          {generating && (
            <p className="text-center text-xs text-muted-foreground animate-pulse">
              Claude is writing your proposal... this takes about 15 seconds.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
