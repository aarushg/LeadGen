import { z } from "zod";

export const researchSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
});

export const outreachSchema = z.object({
  leadId: z.string().uuid().optional(),
  tone: z.enum(["professional", "casual", "direct", "warm"]),
  channel: z.enum(["email", "linkedin", "twitter"]),
  senderName: z.string().min(1, "Your name is required"),
  senderCompany: z.string().min(1, "Your company is required"),
  senderValueProp: z.string().min(1, "Value proposition is required"),
  contactName: z.string(),
  companyName: z.string(),
  researchSummary: z.record(z.unknown()),
});

export const saveLeadSchema = z.object({
  full_name: z.string().optional(),
  title: z.string().optional(),
  company: z.string().min(1, "Company is required"),
  company_website: z.string().optional(),
  linkedin_url: z.string().optional(),
  twitter_url: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  research_data: z.record(z.unknown()).optional(),
  outreach_message: z.string().optional(),
  outreach_tone: z.string().optional(),
  outreach_channel: z.string().optional(),
  status: z
    .enum([
      "new",
      "researched",
      "contacted",
      "replied",
      "qualified",
      "closed_won",
      "closed_lost",
    ])
    .optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const updateLeadSchema = saveLeadSchema.extend({
  last_contacted_at: z.string().datetime().optional(),
});

export const intakeFormSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientCompany: z.string().min(1, "Client company is required"),
  clientEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  projectType: z.enum([
    "website",
    "seo",
    "paid-ads",
    "branding",
    "social-media",
    "email-marketing",
    "content",
    "full-marketing",
    "custom",
  ]),
  projectGoals: z.string().min(20, "Please describe the goals in more detail"),
  budgetRange: z.enum([
    "under-5k",
    "5k-10k",
    "10k-25k",
    "25k-50k",
    "50k-100k",
    "100k+",
  ]),
  timelineWeeks: z.number().min(1).max(104),
  additionalContext: z.string().optional(),
  leadId: z.string().uuid().optional(),
});

export type ResearchInput = z.infer<typeof researchSchema>;
export type OutreachInput = z.infer<typeof outreachSchema>;
export type SaveLeadInput = z.infer<typeof saveLeadSchema>;
export type IntakeFormInput = z.infer<typeof intakeFormSchema>;
