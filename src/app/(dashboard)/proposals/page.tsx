"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Plus,
  ChevronRight,
  Loader2,
  DollarSign,
} from "lucide-react";
import { type Proposal, PROPOSAL_STATUS_COLORS, PROJECT_TYPE_LABELS, BUDGET_RANGE_LABELS } from "@/types/proposal";
import { formatRelativeDate, cn } from "@/lib/utils";

export default function ProposalsPage() {
  const supabase = createClient();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("proposals")
        .select("*")
        .order("created_at", { ascending: false });
      setProposals((data as Proposal[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Proposals</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Generate and manage client proposals
          </p>
        </div>
        <Link
          href="/proposals/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:block">New Proposal</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">No proposals yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Fill out a client intake form and let AI generate a full proposal.
          </p>
          <Link
            href="/proposals/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create first proposal
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((proposal) => (
            <Link
              key={proposal.id}
              href={`/proposals/${proposal.id}`}
              className="flex items-center gap-4 p-4 glass rounded-xl hover:border-primary/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-violet-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate">
                    {proposal.client_company}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    · {proposal.client_name}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {proposal.project_type ? PROJECT_TYPE_LABELS[proposal.project_type] : "Custom"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeDate(proposal.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {proposal.content?.totalAmount > 0 && (
                  <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold hidden sm:flex">
                    <DollarSign className="w-3.5 h-3.5" />
                    {proposal.content.totalAmount.toLocaleString()}
                  </div>
                )}
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full border font-medium",
                    PROPOSAL_STATUS_COLORS[proposal.status]
                  )}
                >
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors hidden sm:block" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
