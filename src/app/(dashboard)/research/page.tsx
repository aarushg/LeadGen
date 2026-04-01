"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Globe,
  Linkedin,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Save,
  RefreshCw,
  ExternalLink,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { type LeadResearchData, LEAD_STATUS_LABELS } from "@/types/lead";
import { createClient } from "@/lib/supabase/client";

const RESEARCH_STEPS = [
  "Searching recent news...",
  "Scanning LinkedIn & social...",
  "Analyzing company profile...",
  "Identifying pain points...",
  "Writing intelligence brief...",
];

const TONES = ["professional", "casual", "direct", "warm"] as const;
const CHANNELS = ["email", "linkedin", "twitter"] as const;
type Tone = (typeof TONES)[number];
type Channel = (typeof CHANNELS)[number];

export default function ResearchPage() {
  const router = useRouter();
  const supabase = createClient();

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [website, setWebsite] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Research state
  const [step, setStep] = useState<"idle" | "researching" | "done">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [research, setResearch] = useState<LeadResearchData | null>(null);
  const [sources, setSources] = useState<{ title: string; url: string }[]>([]);

  // Outreach state
  const [tone, setTone] = useState<Tone>("professional");
  const [channel, setChannel] = useState<Channel>("email");
  const [senderName, setSenderName] = useState("");
  const [senderCompany, setSenderCompany] = useState("");
  const [senderValueProp, setSenderValueProp] = useState("");
  const [outreachMessage, setOutreachMessage] = useState("");
  const [outreachSubject, setOutreachSubject] = useState("");
  const [generatingOutreach, setGeneratingOutreach] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Save state
  const [saving, setSaving] = useState(false);

  async function handleResearch(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim()) return;

    setStep("researching");
    setCurrentStep(0);
    setResearch(null);

    // Animate steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= RESEARCH_STEPS.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, contactName, website }),
      });

      clearInterval(stepInterval);
      setCurrentStep(RESEARCH_STEPS.length - 1);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Research failed");
      }

      const data = await res.json();
      setResearch(data.leadProfile);
      setSources(data.sources || []);
      setStep("done");
    } catch (err) {
      clearInterval(stepInterval);
      setStep("idle");
      toast.error(err instanceof Error ? err.message : "Research failed");
    }
  }

  async function handleGenerateOutreach() {
    if (!research || !senderName || !senderCompany || !senderValueProp) {
      toast.error("Fill in your sender info first");
      return;
    }
    setGeneratingOutreach(true);
    try {
      const res = await fetch("/api/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tone,
          channel,
          senderName,
          senderCompany,
          senderValueProp,
          contactName: contactName || companyName,
          companyName,
          researchSummary: research,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate message");
      const data = await res.json();
      setOutreachMessage(data.message);
      setOutreachSubject(data.subject || "");
    } catch {
      toast.error("Failed to generate outreach message");
    } finally {
      setGeneratingOutreach(false);
    }
  }

  async function handleCopy() {
    const text = outreachSubject
      ? `Subject: ${outreachSubject}\n\n${outreachMessage}`
      : outreachMessage;
    await navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
    toast.success("Copied to clipboard");
  }

  async function handleSaveLead() {
    setSaving(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: companyName,
          full_name: contactName || null,
          company_website: website || null,
          research_data: research,
          outreach_message: outreachMessage || null,
          outreach_tone: tone,
          outreach_channel: channel,
          status: "researched",
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const { lead } = await res.json();
      toast.success("Lead saved!");
      router.push(`/research/${lead.id}`);
    } catch {
      toast.error("Failed to save lead");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Lead Research</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Enter a target company or contact — get a full intelligence brief + personalized outreach.
        </p>
      </div>

      {/* Research Form */}
      <form onSubmit={handleResearch} className="glass rounded-2xl p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Company Name <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corp"
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Contact Name (optional)</label>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-colors"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          Advanced options
        </button>

        {showAdvanced && (
          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Website URL
              </label>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://acme.com"
                type="url"
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn URL
              </label>
              <input
                placeholder="https://linkedin.com/in/..."
                type="url"
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-colors"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={step === "researching" || !companyName.trim()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {step === "researching" ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Researching...</>
          ) : (
            <><Zap className="w-4 h-4" /> Research Lead</>
          )}
        </button>
      </form>

      {/* Progress */}
      {step === "researching" && (
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold mb-4 text-sm">Researching {companyName}...</h3>
          <div className="space-y-3">
            {RESEARCH_STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                {i < currentStep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : i === currentStep ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-border flex-shrink-0" />
                )}
                <span className={cn("text-sm", i <= currentStep ? "text-foreground" : "text-muted-foreground")}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {step === "done" && research && (
        <div className="space-y-4 animate-fade-in">
          {/* Intelligence Brief */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Intelligence Brief</h2>
              <div className="flex items-center gap-2 flex-wrap">
                {research.fundingStage && research.fundingStage !== "unknown" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {research.fundingStage}
                  </span>
                )}
                {research.employeeCount && research.employeeCount !== "unknown" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">
                    {research.employeeCount} employees
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Company</h3>
                <p className="text-sm leading-relaxed">{research.companySummary}</p>
              </div>

              {research.contactBackground && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Contact</h3>
                  <p className="text-sm leading-relaxed">{research.contactBackground}</p>
                </div>
              )}

              {research.painPoints?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Pain Points</h3>
                  <ul className="space-y-1.5">
                    {research.painPoints.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {research.conversationHooks?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Conversation Hooks</h3>
                  <div className="space-y-2">
                    {research.conversationHooks.map((h, i) => (
                      <div key={i} className="p-3 rounded-lg bg-primary/5 border border-primary/15">
                        <p className="text-sm font-medium">{h.hook}</p>
                        <p className="text-xs text-muted-foreground mt-1">{h.context}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {research.recentNews?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Recent News</h3>
                  <div className="space-y-2">
                    {research.recentNews.slice(0, 3).map((n, i) => (
                      <div key={i} className="p-3 rounded-lg bg-secondary border border-border">
                        <p className="text-sm font-medium">{n.headline}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.relevance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Outreach Composer */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold">Write Outreach Message</h2>

            {/* Sender info */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block text-muted-foreground">Your Name</label>
                <input
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block text-muted-foreground">Your Company</label>
                <input
                  value={senderCompany}
                  onChange={(e) => setSenderCompany(e.target.value)}
                  placeholder="CyberRush Agency"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block text-muted-foreground">Your Value Prop</label>
                <input
                  value={senderValueProp}
                  onChange={(e) => setSenderValueProp(e.target.value)}
                  placeholder="We help SaaS companies..."
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Tone & Channel */}
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Tone</label>
                <div className="flex gap-1.5 flex-wrap">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize",
                        tone === t
                          ? "bg-primary/15 text-primary border-primary/30"
                          : "border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Channel</label>
                <div className="flex gap-1.5 flex-wrap">
                  {CHANNELS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setChannel(c)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize",
                        channel === c
                          ? "bg-primary/15 text-primary border-primary/30"
                          : "border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateOutreach}
              disabled={generatingOutreach || !senderName || !senderCompany || !senderValueProp}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {generatingOutreach ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Writing message...</>
              ) : (
                <><Zap className="w-4 h-4" /> Generate Message</>
              )}
            </button>

            {outreachMessage && (
              <div className="space-y-3">
                {outreachSubject && (
                  <div>
                    <label className="text-xs font-medium mb-1 block text-muted-foreground">Subject Line</label>
                    <input
                      value={outreachSubject}
                      onChange={(e) => setOutreachSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none text-sm"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium mb-1 block text-muted-foreground">Message</label>
                  <textarea
                    value={outreachMessage}
                    onChange={(e) => setOutreachMessage(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none text-sm resize-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {outreachMessage.length} characters
                      {channel === "linkedin" && outreachMessage.length > 300 && (
                        <span className="text-amber-400 ml-2">LinkedIn limit: 300</span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGenerateOutreach()}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Regenerate
                      </button>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs font-medium hover:border-primary/40 transition-colors"
                      >
                        {copiedMessage ? (
                          <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5" /> Copy</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save */}
          <div className="flex items-center justify-between p-4 glass rounded-xl">
            <div>
              <p className="text-sm font-medium">Save this lead to your CRM</p>
              <p className="text-xs text-muted-foreground">Track status, add notes, generate a proposal.</p>
            </div>
            <button
              onClick={handleSaveLead}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-500/90 transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Lead
            </button>
          </div>

          {/* Sources */}
          {sources.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Sources ({sources.length})
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {sources.slice(0, 6).map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary border border-border hover:border-primary/30 transition-colors text-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate text-muted-foreground hover:text-foreground">{s.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
