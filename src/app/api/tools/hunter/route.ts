import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: Request) {
  try {
    const { domain, firstName, lastName } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    const prompt = `You are an email finding assistant like Hunter.io. 
    
Find likely email addresses for the domain "${domain}".
${firstName ? `First name: ${firstName}` : ''}
${lastName ? `Last name: ${lastName}` : ''}

Return a JSON object with:
{
  "emails": [
    {
      "email": "email@domain.com",
      "confidence": 95,
      "source": "LinkedIn profile" or "Company website" or "Email patterns" etc,
      "pattern": "first.last@domain" or other pattern if identifiable
    }
  ],
  "patterns": ["Common patterns found (e.g., first.last@, firstname.lastname@, etc)"],
  "confidence": "Overall confidence score 0-100"
}

Generate 3-5 realistic email possibilities based on common email patterns for the domain.`

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
    console.error('Hunter API error:', error)
    return NextResponse.json(
      { error: `Failed to find emails: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
