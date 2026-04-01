import { NextResponse } from 'next/server'
import { toolImplementations } from '@/lib/tool-implementations'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Find the implementation by tool name (match from toolImplementations)
  const implementation = Object.values(toolImplementations).find(impl => impl.id === id)
  
  if (!implementation) {
    return NextResponse.json({ error: 'Tool implementation not found' }, { status: 404 })
  }

  return NextResponse.json({ implementation })
}
