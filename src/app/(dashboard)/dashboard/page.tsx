"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  Search,
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
  Building2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { type Lead, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from "@/types/lead";
import { type Proposal, PROPOSAL_STATUS_COLORS } from "@/types/proposal";
import { formatRelativeDate, cn } from "@/lib/utils";

export default function DashboardPage() {
  const supabase = createClient();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [{ data: leadsData }, { data: proposalsData }] = await Promise.all([
        supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("proposals")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);
      setLeads((leadsData as Lead[]) || []);
      setProposals((proposalsData as Proposal[]) || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const stats = {
    total: leads.length,
    researched: leads.filter((l) => l.status !== "new").length,
    contacted: leads.filter((l) =>
      ["contacted", "replied", "qualified", "closed_won"].includes(l.status)
    ).length,
    proposals: proposals.length,
  };

  const recentLeads = leads.slice(0, 8);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Your lead pipeline at a glance
          </p>
        </div>
        <Link
          href="/research"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:block">New Research</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Total Leads",
            value: stats.total,
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Researched",
            value: stats.researched,
            icon: Search,
            color: "text-violet-400",
            bg: "bg-violet-500/10",
          },
          {
            label: "Contacted",
            value: stats.contacted,
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Proposals",
            value: stats.proposals,
            icon: FileText,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {stat.label}
              </span>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold">
              {loading ? (
                <div className="h-8 w-12 bg-secondary animate-pulse rounded" />
              ) : (
                stat.value
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/research"
          className="glass rounded-xl p-5 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5 text-blue-400" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-semibold mb-1">Research a Lead</h3>
          <p className="text-sm text-muted-foreground">
            Enter a company or contact — get a full intelligence brief and personalized outreach in 60 seconds.
          </p>
        </Link>

        <Link
          href="/proposals/new"
          className="glass rounded-xl p-5 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5 text-violet-400" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-semibold mb-1">Generate a Proposal</h3>
          <p className="text-sm text-muted-foreground">
            Fill out a short intake form and get a complete, formatted proposal ready to send.
          </p>
        </Link>
      </div>

      {/* Recent Leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Leads</h2>
          <Link
            href="/research"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-card rounded-xl animate-pulse border border-border" />
            ))}
          </div>
        ) : recentLeads.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">No leads yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Start by researching your first lead.
            </p>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Research a lead
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/research/${lead.id}`}
                className="flex items-center gap-4 p-4 glass rounded-xl hover:border-primary/30 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {lead.full_name || lead.company}
                    </span>
                    {lead.full_name && (
                      <span className="text-xs text-muted-foreground truncate hidden sm:block">
                        · {lead.company}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeDate(lead.created_at)}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0",
                    LEAD_STATUS_COLORS[lead.status]
                  )}
                >
                  {LEAD_STATUS_LABELS[lead.status]}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 hidden sm:block" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Proposals */}
      {proposals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Proposals</h2>
            <Link
              href="/proposals"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {proposals.slice(0, 5).map((proposal) => (
              <Link
                key={proposal.id}
                href={`/proposals/${proposal.id}`}
                className="flex items-center gap-4 p-4 glass rounded-xl hover:border-primary/30 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm truncate block">
                    {proposal.client_company}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeDate(proposal.created_at)}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0",
                    PROPOSAL_STATUS_COLORS[proposal.status]
                  )}
                >
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 hidden sm:block" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
