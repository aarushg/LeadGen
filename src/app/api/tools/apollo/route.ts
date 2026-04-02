import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { runToolByName } from '@/lib/tool-runner'
import { getToolProfile } from '@/lib/tool-profiles'

export async function POST(request: NextRequest) {
  try {
    const { company, searchTerm } = await request.json()

    if (!company && !searchTerm) {
      return NextResponse.json(
        { error: 'Company or search term required' },
        { status: 400 }
      )
    }

    const execution = await runToolByName('Apollo.io', { company, searchTerm, maxResults: 12 })
    const results = (execution.output.records as Array<Record<string, unknown>>) ?? []
    const legacyLeads = (execution.output.leads as Array<Record<string, unknown>>) ?? []
    const discovery = execution.output.discovery ?? null

    return NextResponse.json({
      profile: getToolProfile('Apollo.io'),
      result: execution.output,
      records: results,
      leads: legacyLeads.map((r: any) => ({
        id: randomUUID(),
        firstName: r.firstName || '',
        lastName: r.lastName || '',
        email: r.email || '',
        company: r.company || company || '',
        title: r.title || '',
        industry: r.industry || '',
        seniority: r.seniority || '',
        linkedinURL: r.linkedinURL,
        phoneNumber: r.phoneNumber,
        verified: Boolean(r.verified),
        quality: r.quality || 'potential',
      })),
      discovery,
    })
  } catch (error) {
    console.error('Apollo search failed:', error)
    return NextResponse.json(
      { error: 'Failed to search leads', leads: [] },
      { status: 500 }
    )
  }
}
