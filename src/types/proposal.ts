export type ProposalStatus = "draft" | "sent" | "accepted" | "rejected";

export type ProjectType =
  | "website"
  | "seo"
  | "paid-ads"
  | "branding"
  | "social-media"
  | "email-marketing"
  | "content"
  | "full-marketing"
  | "custom";

export type BudgetRange =
  | "under-5k"
  | "5k-10k"
  | "10k-25k"
  | "25k-50k"
  | "50k-100k"
  | "100k+";

export interface ProposalDeliverable {
  title: string;
  description: string;
  included: boolean;
}

export interface ProposalTimelineWeek {
  week: number;
  phase: string;
  milestones: string[];
}

export interface ProposalPricingItem {
  item: string;
  description: string;
  amount: number;
}

export interface ProposalContent {
  executiveSummary: string;
  problemStatement: string;
  proposedSolution: string;
  deliverables: ProposalDeliverable[];
  timeline: ProposalTimelineWeek[];
  pricing: ProposalPricingItem[];
  totalAmount: number;
  paymentTerms: string;
  whatWeNeedFromYou: string[];
  whyUs: string;
  nextSteps: string;
  termsAndConditions: string;
}

export interface Proposal {
  id: string;
  user_id: string;
  lead_id: string | null;
  client_name: string;
  client_company: string;
  client_email: string | null;
  project_type: ProjectType;
  project_goals: string;
  budget_range: BudgetRange;
  timeline_weeks: number;
  additional_context: string | null;
  content: ProposalContent;
  status: ProposalStatus;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  website: "Website Design & Development",
  seo: "SEO & Content Marketing",
  "paid-ads": "Paid Advertising (PPC)",
  branding: "Brand Identity & Design",
  "social-media": "Social Media Management",
  "email-marketing": "Email Marketing",
  content: "Content Creation",
  "full-marketing": "Full Marketing Suite",
  custom: "Custom Project",
};

export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  "under-5k": "Under $5,000",
  "5k-10k": "$5,000 – $10,000",
  "10k-25k": "$10,000 – $25,000",
  "25k-50k": "$25,000 – $50,000",
  "50k-100k": "$50,000 – $100,000",
  "100k+": "$100,000+",
};

export const PROPOSAL_STATUS_COLORS: Record<ProposalStatus, string> = {
  draft: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  sent: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  accepted: "bg-green-500/20 text-green-300 border-green-500/30",
  rejected: "bg-red-500/20 text-red-300 border-red-500/30",
};
