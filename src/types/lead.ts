export type LeadStatus =
  | "new"
  | "researched"
  | "contacted"
  | "replied"
  | "qualified"
  | "closed_won"
  | "closed_lost";

export interface Lead {
  id: string;
  user_id: string;
  full_name: string | null;
  title: string | null;
  company: string;
  company_website: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  email: string | null;
  research_data: LeadResearchData | null;
  outreach_message: string | null;
  outreach_tone: string | null;
  outreach_channel: string | null;
  status: LeadStatus;
  tags: string[];
  notes: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadResearchData {
  companySummary: string;
  contactBackground: string;
  recentNews: NewsItem[];
  painPoints: string[];
  opportunities: string[];
  conversationHooks: ConversationHook[];
  techStack: string[];
  fundingStage: string;
  employeeCount: string;
  industryVertical: string;
  sources?: ResearchSource[];
}

export interface NewsItem {
  headline: string;
  summary: string;
  relevance: string;
}

export interface ConversationHook {
  hook: string;
  context: string;
}

export interface ResearchSource {
  title: string;
  url: string;
  content: string;
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  researched: "Researched",
  contacted: "Contacted",
  replied: "Replied",
  qualified: "Qualified",
  closed_won: "Won",
  closed_lost: "Lost",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  researched: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  contacted: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  replied: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  qualified: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  closed_won: "bg-green-500/20 text-green-300 border-green-500/30",
  closed_lost: "bg-red-500/20 text-red-300 border-red-500/30",
};
