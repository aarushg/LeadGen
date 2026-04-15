import { NextResponse } from 'next/server'
import { runToolByName } from '@/lib/tool-runner'
import { getToolProfile } from '@/lib/tool-profiles'

export async function POST(request: Request) {
  try {
    const { targetRole, industry, companySize, location, maxResults = 10 } = await request.json()

    if (!targetRole || !industry) {
      return NextResponse.json({ error: 'Target role and industry are required' }, { status: 400 })
    }

    const execution = await runToolByName('LeadFuze', {
      targetRole,
      industry,
      companySize,
      location,
      maxResults,
    })

    return NextResponse.json({
      profile: getToolProfile('LeadFuze'),
      result: execution.output,
      records: execution.output.records ?? [],
      discovery: execution.output.discovery ?? null,
    })
  } catch (error) {
    console.error('LeadFuze API error:', error)
    return NextResponse.json(
      { error: `Failed to source leads: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
