import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = await params
  const record = await db.toolState.get(toolId)
  return NextResponse.json({ toolId, state: record?.state ?? null, updatedAt: record?.updated_at ?? null })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ toolId: string }> }) {
  try {
    const { toolId } = await params
    const body = await request.json()
    const payload = body?.state ?? null

    const saved = await db.toolState.set(toolId, payload)
    await db.toolEvents.create(toolId, 'state_saved', {
      keys: payload && typeof payload === 'object' ? Object.keys(payload as Record<string, unknown>).length : 0,
    })

    return NextResponse.json({ toolId, state: saved.state, updatedAt: saved.updated_at })
  } catch {
    return NextResponse.json({ error: 'Failed to save tool state' }, { status: 500 })
  }
}
