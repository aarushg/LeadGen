import { NextRequest, NextResponse } from 'next/server'
import { ollamaChat } from '@/lib/ollama'

export async function POST(req: NextRequest) {
  const { lead, model } = await req.json()

  if (!lead) return NextResponse.json({ error: 'lead is required' }, { status: 400 })

  const prompt = `You are a B2B sales qualification expert. Score this lead and provide a short rationale.

Lead:
- Company: ${lead.company}
- Contact: ${lead.full_name ?? 'Unknown'} (${lead.title ?? 'Unknown role'})
- Email: ${lead.email ?? 'Not provided'}
- Industry: ${lead.industry ?? 'Unknown'}
- Status: ${lead.status}
- Source: ${lead.lead_source ?? 'Unknown'}
- Notes: ${lead.notes ?? 'None'}

Respond with ONLY valid JSON (no markdown, no extra text):
{
  "score": <integer 1-10>,
  "tier": "<hot|warm|cold>",
  "reasoning": "<2-3 sentence explanation of the score>",
  "nextAction": "<one specific recommended next step>"
}`

  let text: string
  try {
    text = await ollamaChat(model ?? 'llama3', [{ role: 'user', content: prompt }])
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Ollama unreachable'
    return NextResponse.json({ error: msg }, { status: 503 })
  }

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return NextResponse.json({ error: 'Failed to parse AI response', raw: text }, { status: 500 })
    parsed = JSON.parse(match[0])
  }

  return NextResponse.json(parsed)
}
