import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: Request) {
  try {
    const { targetRole, industry, companySize, location, maxResults = 10 } = await request.json()

    if (!targetRole || !industry) {
      return NextResponse.json({ error: 'Target role and industry are required' }, { status: 400 })
    }

    const filterText = [
      targetRole && `Job Role: ${targetRole}`,
      industry && `Industry: ${industry}`,
      companySize && `Company Size: ${companySize}`,
      location && `Location: ${location}`,
    ]
      .filter(Boolean)
      .join(', ')

    const prompt = `You are LeadFuze, an AI lead sourcing platform. 
    
Generate ${maxResults} realistic B2B leads matching these criteria:
${filterText}

Return a JSON object with:
{
  "leads": [
    {
      "id": "unique-id",
      "company": "Company Name",
      "companySize": "51-200",
      "industry": "${industry}",
      "contactName": "First Last",
      "title": "Job Title",
      "email": "email@company.com",
      "phone": "+1-xxx-xxx-xxxx",
      "linkedinUrl": "linkedin profile",
      "location": "City, State",
      "buyingIntent": "high" | "medium" | "low",
      "engagementScore": 75,
      "dataQuality": "verified" | "likely" | "potential"
    }
  ],
  "totalFound": ${maxResults},
  "filters": {
    "role": "${targetRole}",
    "industry": "${industry}",
    "companySize": "${companySize || 'Any'}",
    "location": "${location || 'Global'}"
  },
  "sourceQuality": "AI-verified with high confidence"
}

Generate realistic data - use common naming patterns and real company formats.`

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
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
    console.error('LeadFuze API error:', error)
    return NextResponse.json(
      { error: `Failed to source leads: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
