import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const prompt = `You are a B2B data enrichment service like UpLead. 
    
Enrich this email address with realistic professional information: "${email}"

Return a JSON object with:
{
  "email": "${email}",
  "confidence": 95,
  "person": {
    "firstName": "First name",
    "lastName": "Last name",
    "title": "Job title",
    "seniority": "Level (Executive/Manager/Individual Contributor)",
    "linkedinUrl": "LinkedIn profile URL if available"
  },
  "company": {
    "name": "Company name",
    "domain": "company domain",
    "industry": "Industry",
    "size": "Company size range",
    "location": "Location",
    "website": "Company website",
    "linkedinUrl": "LinkedIn company URL"
  },
  "verification": {
    "emailValid": true,
    "webSignals": 3,
    "sources": ["LinkedIn", "Company website", "Email signature"]
  },
  "enrichmentLevel": "complete",
  "lastUpdated": "2026-03-31"
}

Be realistic - if the email looks like it could be from a real company, generate realistic data.`

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from response')
    }

    const result = JSON.parse(jsonMatch[0])

    return NextResponse.json({ result })
  } catch (error) {
    console.error('UpLead API error:', error)
    return NextResponse.json(
      { error: `Failed to enrich contact: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
