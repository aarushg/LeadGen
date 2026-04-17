"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
// import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Building2,
  Globe,
  Linkedin,
  Mail,
  ChevronDown,
  FileText,
  Loader2,
  Save,
} from "lucide-react";
import { type Lead, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from "@/types/lead";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

// Supabase removed
const STATUSES = [
  "new", "researched", "contacted", "replied", "qualified", "closed_won", "closed_lost",
] as const;

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = (params as { leadId: string }).leadId;
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/leads/${leadId}`);
      if (res.ok) {
        const { lead } = await res.json();
        setLead(lead);
        setNotes(lead.notes || "");
      }
      setLoading(false);
    }
    load();
  }, [leadId]);

  async function updateStatus(status: Lead["status"]) {
    if (!lead) return;
    setStatusOpen(false);
    const res = await fetch(`/api/leads/${leadId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setLead((prev) => (prev ? { ...prev, status } : null));
      toast.success("Status updated");
    }
  }

  async function saveNotes() {
    setSavingNotes(true);
    await fetch(`/api/leads/${leadId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setSavingNotes(false);
    toast.success("Notes saved");
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Lead not found.</p>
        <Link href="/dashboard" className="text-primary text-sm hover:underline mt-2 block">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const research = lead.research_data;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      {/* Header */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">
              {lead.full_name || lead.company}
            </h1>
            {lead.full_name && (
              <p className="text-muted-foreground text-sm">{lead.company}</p>
            )}
            {lead.title && (
              <p className="text-sm text-muted-foreground">{lead.title}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-3.5 h-3.5" /> {lead.email}
                </a>
              )}
              {lead.company_website && (
                <a href={lead.company_website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Globe className="w-3.5 h-3.5" /> Website
                </a>
              )}
              {lead.linkedin_url && (
                <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                LEAD_STATUS_COLORS[lead.status]
              )}
            >
              {LEAD_STATUS_LABELS[lead.status]}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {statusOpen && (
              <div className="absolute right-0 top-full mt-1 z-10 w-40 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs font-medium hover:bg-secondary transition-colors",
                      lead.status === s && "bg-primary/10 text-primary"
                    )}
                  >
                    {LEAD_STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          Added {formatDate(lead.created_at)}
        </p>
      </div>

      {/* Research data */}
      {research && (
        <div className="glass rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold">Intelligence Brief</h2>

          {research.companySummary && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Company</h3>
              <p className="text-sm leading-relaxed">{research.companySummary}</p>
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
        </div>
      )}

      {/* Outreach message */}
      {lead.outreach_message && (
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Outreach Message</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground capitalize">
              {lead.outreach_channel} · {lead.outreach_tone}
            </span>
          </div>
          <pre className="text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground font-sans">
            {lead.outreach_message}
          </pre>
        </div>
      )}

      {/* Notes */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold mb-3">Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this lead..."
          rows={4}
          className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none text-sm resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={saveNotes}
            disabled={savingNotes}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {savingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save notes
          </button>
        </div>
      </div>

      {/* Generate Proposal */}
      <Link
        href={`/proposals/new?leadId=${lead.id}&clientCompany=${encodeURIComponent(lead.company)}`}
        className="flex items-center justify-between p-4 glass rounded-xl hover:border-primary/30 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Generate a Proposal</p>
            <p className="text-xs text-muted-foreground">Create a full proposal for {lead.company}</p>
          </div>
        </div>
        <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </Link>
    </div>
  );
}
