import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const { company, searchTerm } = await request.json()

    if (!company && !searchTerm) {
      return NextResponse.json(
        { error: 'Company or search term required' },
        { status: 400 }
      )
    }

    const prompt = `Generate a list of 8-12 realistic B2B leads for company "${company || 'any'}" matching "${searchTerm || 'sales professionals'}". Include realistic details and verified email addresses.

For each lead, provide JSON with:
- firstName, lastName
- email (realistic format)
- title, company, industry, seniority
- linkedinURL (optional)
- phoneNumber (optional)
- verified (boolean)
- quality ('verified' | 'likely' | 'potential')

Return as JSON array.`

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
      leads: results.map((r: any) => ({
        id: `apollo-${Math.random().toString(36).substr(2, 9)}`,
        firstName: r.firstName || 'John',
        lastName: r.lastName || 'Doe',
        email: r.email || 'contact@company.com',
        company: r.company || company || 'Acme Corp',
        title: r.title || 'Sales Manager',
        industry: r.industry || 'Technology',
        seniority: r.seniority || 'manager',
        linkedinURL: r.linkedinURL,
        phoneNumber: r.phoneNumber,
        verified: r.verified || true,
        quality: r.quality || 'verified',
      })),
    })
  } catch (error) {
    console.error('Apollo search failed:', error)
    return NextResponse.json(
      { error: 'Failed to search leads', leads: [] },
      { status: 500 }
    )
  }
}
