import { NextRequest, NextResponse } from 'next/server'
import { ollamaChat } from '@/lib/ollama'

export async function POST(req: NextRequest) {
  const { lead, channel, tone, model } = await req.json()

  if (!lead) return NextResponse.json({ error: 'lead is required' }, { status: 400 })

  const ch = channel ?? 'email'
  const tn = tone ?? 'professional'

  const prompt = `Write a personalized ${ch} outreach message for this lead.

Lead:
- Company: ${lead.company}
- Contact: ${lead.full_name ?? 'Unknown'} (${lead.title ?? 'Unknown role'})
- Industry: ${lead.industry ?? 'Not specified'}
- Notes: ${lead.notes ?? 'None'}
- Existing outreach: ${lead.outreach_message ? 'Already has a message — write a fresh follow-up angle' : 'No prior outreach'}

Tone: ${tn}
Channel: ${ch}

Rules:
- Do NOT open with "I hope this finds you well" or any generic opener
- Reference something specific to their company or role
- Keep it under 150 words
- End with a single, low-friction CTA
- Return ONLY the message text, no subject line, no labels, no quotes`

  let message: string
  try {
    message = await ollamaChat(model ?? 'llama3', [{ role: 'user', content: prompt }])
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Ollama unreachable'
    return NextResponse.json({ error: msg }, { status: 503 })
  }

  return NextResponse.json({ message: message.trim() })
}
