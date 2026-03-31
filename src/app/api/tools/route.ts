import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { leadGenerationTools } from '@/lib/lead-tools-data'

export async function GET() {
  const tools = await db.tools.seedIfEmpty(
    leadGenerationTools.map((tool) => ({
      name: tool.name,
      type: tool.type,
      bestFor: tool.bestFor,
      keyFeatures: tool.keyFeatures,
      summary: tool.summary,
      website: tool.website,
    }))
  )

  return NextResponse.json({ tools })
}
