import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const { company, title, seniority } = await request.json()

    if (!company || !title) {
      return NextResponse.json(
        { error: 'Company and title are required' },
        { status: 400 }
      )
    }

    const prompt = `Generate a list of 5-8 realistic B2B professional email addresses for people with the job title "${title}" at company "${company}". 
    
For each email, provide:
- Email address (realistic format)
- First name
- Last name
- Job title
- Company name
- Confidence score (70-100)
- Source (e.g., "Corporate Directory", "LinkedIn", "Business Registration")

Return as JSON array with properties: email, firstName, lastName, title, company, confidence (number), source, linkedinURL (optional).

Make the data realistic and believable.`

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

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    const results = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    return NextResponse.json({
      results: results.map((r: any) => ({
        id: `aerolead-${Math.random().toString(36).substr(2, 9)}`,
        email: r.email || '',
        firstName: r.firstName || '',
        lastName: r.lastName || '',
        title: r.title || title,
        company: r.company || company,
        confidence: r.confidence || 85,
        source: r.source || 'Database Match',
        linkedinURL: r.linkedinURL,
      })),
    })
  } catch (error) {
    console.error('AeroLeads search failed:', error)
    return NextResponse.json(
      { error: 'Failed to search emails', results: [] },
      { status: 500 }
    )
  }
}
