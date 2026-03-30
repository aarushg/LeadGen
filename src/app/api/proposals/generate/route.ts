import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const {
    clientName,
    clientCompany,
    clientEmail,
    projectType,
    projectGoals,
    budgetRange,
    timelineWeeks,
    additionalContext,
  } = await req.json()

  if (!clientName || !clientCompany || !projectType || !projectGoals) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const prompt = `You are an expert marketing agency proposal writer. Generate a complete, professional proposal.

CLIENT DETAILS:
- Name: ${clientName}
- Company: ${clientCompany}${clientEmail ? `\n- Email: ${clientEmail}` : ''}
- Project Type: ${projectType}
- Goals: ${projectGoals}
- Budget: ${budgetRange}
- Timeline: ${timelineWeeks}${additionalContext ? `\n- Additional context: ${additionalContext}` : ''}

Generate a JSON response with this exact structure:
{
  "executiveSummary": "2-3 paragraph executive summary tailored to their specific goals and company",
  "scopeOfWork": ["detailed scope item 1", "detailed scope item 2", "scope item 3", "scope item 4", "scope item 5"],
  "deliverables": ["deliverable 1", "deliverable 2", "deliverable 3", "deliverable 4"],
  "timeline": [
    { "week": "Week 1-2", "milestone": "milestone description" },
    { "week": "Week 3-4", "milestone": "milestone description" }
  ],
  "pricing": [
    { "item": "line item name", "price": "$X,XXX" },
    { "item": "another item", "price": "$X,XXX" },
    { "item": "Total Investment", "price": "$XX,XXX" }
  ],
  "terms": "Payment terms, revision policy, and key contract terms in 2-3 sentences",
  "callToAction": "Compelling closing statement and next step instruction"
}

Make the timeline appropriate for ${timelineWeeks}. Make pricing realistic for a ${projectType} project with ${budgetRange} budget.
IMPORTANT: Return ONLY the JSON object, no markdown, no extra text.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  let content
  try {
    content = JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    content = JSON.parse(match[0])
  }

  return NextResponse.json({ content })
}
