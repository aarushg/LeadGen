"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Send,
  CheckCircle2,
  DollarSign,
  Calendar,
  Clock,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { type Proposal, PROPOSAL_STATUS_COLORS, PROJECT_TYPE_LABELS } from "@/types/proposal";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProposalDetailPage() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const router = useRouter();
  const supabase = createClient();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusOpen, setStatusOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", proposalId)
        .single();
      setProposal(data as Proposal);
      setLoading(false);
    }
    load();
  }, [proposalId]);

  async function updateStatus(status: Proposal["status"]) {
    setStatusOpen(false);
    await supabase.from("proposals").update({ status, ...(status === "sent" ? { sent_at: new Date().toISOString() } : {}) }).eq("id", proposalId);
    setProposal((prev) => prev ? { ...prev, status } : null);
    toast.success(`Marked as ${status}`);
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Proposal not found.</p>
        <Link href="/proposals" className="text-primary text-sm hover:underline mt-2 block">Back to proposals</Link>
      </div>
    );
  }

  const content = proposal.content;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Back + Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/proposals" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Proposals
        </Link>

        <div className="flex items-center gap-2">
          {/* Status */}
          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border",
                PROPOSAL_STATUS_COLORS[proposal.status]
              )}
            >
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {statusOpen && (
              <div className="absolute right-0 top-full mt-1 z-10 w-36 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                {(["draft", "sent", "accepted", "rejected"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs font-medium hover:bg-secondary transition-colors capitalize",
                      proposal.status === s && "bg-primary/10 text-primary"
                    )}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => { updateStatus("sent"); toast.success("Marked as sent"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Mark Sent</span>
          </button>
        </div>
      </div>

      {/* Proposal Header */}
      <div className="glass rounded-2xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs font-mono text-primary mb-2 uppercase tracking-widest">Proposal</div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              {proposal.client_company}
            </h1>
            <p className="text-muted-foreground">
              Prepared for {proposal.client_name}
              {proposal.client_email && ` · ${proposal.client_email}`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {proposal.project_type && PROJECT_TYPE_LABELS[proposal.project_type]}
              {" · "}
              {formatDate(proposal.created_at)}
            </p>
          </div>
          <div className="text-right">
            {content?.totalAmount > 0 && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Total Investment</div>
                <div className="text-3xl font-bold text-emerald-400">
                  ${content.totalAmount.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      {content?.executiveSummary && (
        <Section title="Executive Summary">
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{content.executiveSummary}</p>
        </Section>
      )}

      {/* Problem Statement */}
      {content?.problemStatement && (
        <Section title="The Challenge">
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{content.problemStatement}</p>
        </Section>
      )}

      {/* Proposed Solution */}
      {content?.proposedSolution && (
        <Section title="Our Solution">
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{content.proposedSolution}</p>
        </Section>
      )}

      {/* Deliverables */}
      {content?.deliverables?.length > 0 && (
        <Section title="Deliverables">
          <div className="space-y-2">
            {content.deliverables.map((d, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary border border-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{d.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Timeline */}
      {content?.timeline?.length > 0 && (
        <Section title="Timeline">
          <div className="space-y-3">
            {content.timeline.map((t, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                    {t.week}
                  </div>
                  {i < content.timeline.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-1.5 mb-0" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-semibold">{t.phase}</p>
                  <ul className="mt-1 space-y-0.5">
                    {t.milestones?.map((m, j) => (
                      <li key={j} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Pricing */}
      {content?.pricing?.length > 0 && (
        <Section title="Investment">
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Item</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Description</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {content.pricing.map((p, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{p.item}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">{p.description}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-400">
                      ${p.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-secondary">
                  <td colSpan={2} className="px-4 py-3 font-bold">Total</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400 text-lg">
                    ${content.totalAmount?.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {content.paymentTerms && (
            <p className="text-xs text-muted-foreground mt-2">
              Payment terms: {content.paymentTerms}
            </p>
          )}
        </Section>
      )}

      {/* What we need */}
      {content?.whatWeNeedFromYou?.length > 0 && (
        <Section title="What We Need From You">
          <ul className="space-y-1.5">
            {content.whatWeNeedFromYou.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Why Us */}
      {content?.whyUs && (
        <Section title="Why Us">
          <p className="text-sm leading-relaxed text-muted-foreground">{content.whyUs}</p>
        </Section>
      )}

      {/* Next Steps */}
      {content?.nextSteps && (
        <div className="glass rounded-2xl p-6 bg-primary/5 border-primary/20">
          <h2 className="font-semibold mb-2">Next Steps</h2>
          <p className="text-sm leading-relaxed">{content.nextSteps}</p>
        </div>
      )}

      {/* Terms */}
      {content?.termsAndConditions && (
        <Section title="Terms & Conditions">
          <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">{content.termsAndConditions}</p>
        </Section>
      )}

      {/* Footer spacer */}
      <div className="h-8" />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}
