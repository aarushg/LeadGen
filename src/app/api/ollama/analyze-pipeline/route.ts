import { NextRequest, NextResponse } from 'next/server'
import { ollamaChat } from '@/lib/ollama'

export async function POST(req: NextRequest) {
  const { leads, model, mode } = await req.json()

  if (!leads?.length) return NextResponse.json({ error: 'No leads provided' }, { status: 400 })

  const summary = leads.map((l: {
    company: string
    status: string
    lead_quality?: string
    estimated_revenue?: number
    acquisition_channel?: string
    notes?: string
  }) =>
    `- ${l.company} | status: ${l.status} | quality: ${l.lead_quality ?? 'unknown'} | revenue: $${l.estimated_revenue ?? 0} | channel: ${l.acquisition_channel ?? 'unknown'}${l.notes ? ` | notes: ${l.notes.slice(0, 80)}` : ''}`
  ).join('\n')

  let prompt: string

  if (mode === 'scoring') {
    prompt = `You are a sales strategy expert. Analyze this lead pipeline and provide actionable insights.

PIPELINE (${leads.length} leads):
${summary}

Respond with ONLY valid JSON (no markdown):
{
  "topInsight": "The single most important observation about this pipeline in 1-2 sentences",
  "bottleneck": "Where leads are getting stuck and why",
  "quickWins": ["specific action 1", "specific action 2", "specific action 3"],
  "riskLeads": ["company name that needs attention", "another at-risk company"],
  "channelRecommendation": "Which acquisition channel is performing best and what to do with that insight"
}`
  } else {
    prompt = `You are a B2B revenue analyst. Summarize this sales pipeline for a weekly review.

PIPELINE (${leads.length} leads):
${summary}

Write a concise 3-4 sentence executive summary covering: overall pipeline health, biggest opportunity, and the one thing the team should focus on this week. Be specific about company names and numbers. Plain text, no JSON, no bullet points.`
  }

  let text: string
  try {
    text = await ollamaChat(model ?? 'llama3', [{ role: 'user', content: prompt }])
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Ollama unreachable'
    return NextResponse.json({ error: msg }, { status: 503 })
  }

  if (mode === 'scoring') {
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      const match = text.match(/\{[\s\S]*\}/)
      if (!match) return NextResponse.json({ error: 'Failed to parse response', raw: text }, { status: 500 })
      parsed = JSON.parse(match[0])
    }
    return NextResponse.json(parsed)
  }

  return NextResponse.json({ summary: text.trim() })
}
