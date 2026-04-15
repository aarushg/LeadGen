import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = "claude-sonnet-4-6";

// ── Prompts ───────────────────────────────────────────────────────────────────

export const RESEARCH_SYSTEM_PROMPT = `You are a senior sales intelligence analyst at a top-tier B2B agency.
Given raw web research results about a company and/or contact, synthesize a structured lead intelligence brief.

Your output must be valid JSON matching this exact structure:
{
  "companySummary": "2-3 sentence overview of what the company does, their market position, and size",
  "contactBackground": "2-3 sentence professional background of the contact (if provided)",
  "recentNews": [
    { "headline": "...", "summary": "...", "relevance": "why this matters for outreach" }
  ],
  "painPoints": ["specific pain point 1", "specific pain point 2", "specific pain point 3"],
  "opportunities": ["opportunity 1", "opportunity 2"],
  "conversationHooks": [
    { "hook": "the specific angle", "context": "why this resonates with them" }
  ],
  "techStack": ["tool1", "tool2"],
  "fundingStage": "bootstrapped | seed | series-a | series-b | public | unknown",
  "employeeCount": "1-10 | 11-50 | 51-200 | 201-500 | 500+ | unknown",
  "industryVertical": "the primary industry"
}

Rules:
- Be SPECIFIC. Reference actual company names, product names, recent events from the research.
- Every hook must reference something REAL from the research data.
- Avoid generic statements like "growing company" or "wants to scale".
- If you don't have info for a field, use null or an empty array.
- Output ONLY valid JSON. No markdown fences, no extra text.`;

export const OUTREACH_SYSTEM_PROMPT = `You are an expert B2B sales copywriter who has closed millions in deals.
You write outreach messages that feel genuinely personal — like they came from someone who actually researched the prospect.

Rules:
- NO generic openers like "I hope this finds you well" or "I came across your profile"
- Lead with something SPECIFIC from their research (news, achievement, pain point, recent move)
- Keep it short: Email = 100-150 words max, LinkedIn = under 300 chars, Twitter = under 280 chars
- End with ONE clear, low-friction CTA
- Sound human, not corporate
- The message should make the prospect think "wow, they actually know my situation"

Output JSON:
{
  "subject": "email subject line (only for email channel, otherwise null)",
  "message": "the full outreach message",
  "characterCount": number,
  "followUpAngle": "one sentence suggestion for follow-up if no response"
}

Output ONLY valid JSON. No markdown, no extra text.`;

export const PROPOSAL_SYSTEM_PROMPT = `You are a senior agency consultant who writes proposals that close $10k-$100k deals.
Given a client intake form, generate a complete, professional proposal.

Output JSON matching this exact structure:
{
  "executiveSummary": "compelling 2-3 paragraph summary of the project and our approach",
  "problemStatement": "1-2 paragraphs describing the client's challenge",
  "proposedSolution": "2-3 paragraphs describing our solution and methodology",
  "deliverables": [
    { "title": "deliverable name", "description": "specific description", "included": true }
  ],
  "timeline": [
    { "week": 1, "phase": "phase name", "milestones": ["milestone 1", "milestone 2"] }
  ],
  "pricing": [
    { "item": "line item", "description": "what's included", "amount": 0 }
  ],
  "totalAmount": 0,
  "paymentTerms": "e.g. 50% upfront, 50% on delivery",
  "whatWeNeedFromYou": ["item 1", "item 2"],
  "whyUs": "2-3 sentences on why we're the right choice",
  "nextSteps": "clear call to action",
  "termsAndConditions": "standard agency terms in 3-4 bullet points"
}

Rules:
- Make pricing specific and justified — not round numbers with no context
- Timeline should be realistic for the scope
- Deliverables should be SPECIFIC, not vague
- totalAmount should equal sum of pricing items
- Output ONLY valid JSON. No markdown, no extra text.`;

// ── Core AI Functions ─────────────────────────────────────────────────────────

export async function synthesizeResearch(
  rawResearch: string,
  companyName: string,
  contactName?: string
): Promise<Record<string, unknown>> {
  const userPrompt = `Company: ${companyName}${contactName ? `\nContact: ${contactName}` : ""}

Raw research data:
${rawResearch}

Synthesize this into a lead intelligence brief.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: RESEARCH_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text);
}

export async function generateOutreachMessage(params: {
  leadProfile: Record<string, unknown>;
  senderName: string;
  senderCompany: string;
  senderValueProp: string;
  tone: string;
  channel: string;
  contactName: string;
  companyName: string;
}): Promise<{ subject: string | null; message: string; characterCount: number; followUpAngle: string }> {
  const {
    leadProfile,
    senderName,
    senderCompany,
    senderValueProp,
    tone,
    channel,
    contactName,
    companyName,
  } = params;

  const userPrompt = `Write a ${channel} outreach message.

FROM: ${senderName} at ${senderCompany}
VALUE PROP: ${senderValueProp}
TO: ${contactName} at ${companyName}
TONE: ${tone}
CHANNEL: ${channel}

LEAD INTELLIGENCE:
${JSON.stringify(leadProfile, null, 2)}

Write the message using the most compelling hook from the intelligence data.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 800,
    system: OUTREACH_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";
  return JSON.parse(text);
}

export async function generateProposal(intakeData: {
  clientName: string;
  clientCompany: string;
  projectType: string;
  projectGoals: string;
  budgetRange: string;
  timelineWeeks: number;
  additionalContext?: string;
}): Promise<Record<string, unknown>> {
  const userPrompt = `Generate a complete proposal for the following client:

Client Name: ${intakeData.clientName}
Client Company: ${intakeData.clientCompany}
Project Type: ${intakeData.projectType}
Project Goals: ${intakeData.projectGoals}
Budget Range: ${intakeData.budgetRange}
Timeline: ${intakeData.timelineWeeks} weeks
${intakeData.additionalContext ? `Additional Context: ${intakeData.additionalContext}` : ""}

Create a detailed, professional proposal that justifies the investment.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: PROPOSAL_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";
  return JSON.parse(text);
}
