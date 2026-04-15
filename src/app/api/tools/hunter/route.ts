import { NextResponse } from 'next/server'
import { runToolByName } from '@/lib/tool-runner'
import { getToolProfile } from '@/lib/tool-profiles'

export async function POST(request: Request) {
  try {
    const { domain, firstName, lastName } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    const execution = await runToolByName('Hunter', { domain, firstName, lastName })

    return NextResponse.json({
      profile: getToolProfile('Hunter'),
      result: execution.output,
      records: execution.output.records ?? [],
      discovery: execution.output.discovery ?? null,
    })
  } catch (error) {
    console.error('Hunter API error:', error)
    return NextResponse.json(
      { error: `Failed to find emails: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
