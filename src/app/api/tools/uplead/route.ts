import { NextResponse } from 'next/server'
import { runToolByName } from '@/lib/tool-runner'
import { getToolProfile } from '@/lib/tool-profiles'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const execution = await runToolByName('UpLead', { email })

    return NextResponse.json({
      profile: getToolProfile('UpLead'),
      result: execution.output,
      records: execution.output.records ?? [],
      discovery: execution.output.discovery ?? null,
    })
  } catch (error) {
    console.error('UpLead API error:', error)
    return NextResponse.json(
      { error: `Failed to enrich contact: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
