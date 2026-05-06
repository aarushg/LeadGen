import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { toolImplementations } from '@/lib/tool-implementations'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const tool = await db.tools.get(id)
  if (!tool) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
  }

  const implementation = toolImplementations[tool.name]
  
  if (!implementation) {
    return NextResponse.json({ error: 'Tool implementation not found' }, { status: 404 })
  }

  return NextResponse.json({ implementation })
}
