import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { runToolByName } from '@/lib/tool-runner'
import { getToolProfile } from '@/lib/tool-profiles'

export async function POST(request: NextRequest) {
  try {
    const { company, title, seniority } = await request.json()

    if (!company || !title) {
      return NextResponse.json(
        { error: 'Company and title are required' },
        { status: 400 }
      )
    }

    const execution = await runToolByName('AeroLeads', {
      company,
      title,
      seniority,
      searchTerm: title,
      maxResults: 8,
    })

    const results = (execution.output.records as Array<Record<string, unknown>>) ?? []
    const legacyLeads = (execution.output.leads as Array<Record<string, unknown>>) ?? []
    const discovery = execution.output.discovery ?? null

    return NextResponse.json({
      profile: getToolProfile('AeroLeads'),
      result: execution.output,
      records: results,
      results: legacyLeads.map((r: any) => ({
        id: randomUUID(),
        email: r.email || '',
        firstName: r.firstName || '',
        lastName: r.lastName || '',
        title: r.title || title,
        company: r.company || company,
        confidence: Number(r.confidence ?? 0),
        source: r.source || '',
        linkedinURL: r.linkedinURL || r.url,
      })),
      discovery,
    })
  } catch (error) {
    console.error('AeroLeads search failed:', error)
    return NextResponse.json(
      { error: 'Failed to search emails', results: [] },
      { status: 500 }
    )
  }
}
