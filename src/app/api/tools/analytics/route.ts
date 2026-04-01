import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function getNumericMetric(state: unknown): number {
  if (!state || typeof state !== 'object') return 0
  const values = Object.values(state as Record<string, unknown>)
  let sum = 0

  for (const value of values) {
    if (Array.isArray(value)) {
      sum += value.length
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      sum += value
    }
  }

  return sum
}

export async function GET() {
  const [states, events] = await Promise.all([db.toolState.list(), db.toolEvents.list()])

  const eventCountByTool = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.tool_id] = (acc[event.tool_id] ?? 0) + 1
    return acc
  }, {})

  const metrics = states
    .map((state) => ({
      toolId: state.tool_id,
      lastUpdated: state.updated_at,
      stateSize: getNumericMetric(state.state),
      events: eventCountByTool[state.tool_id] ?? 0,
    }))
    .sort((a, b) => b.events - a.events)

  return NextResponse.json({
    tools: metrics,
    summary: {
      trackedTools: states.length,
      totalEvents: events.length,
      lastEventAt: events[0]?.created_at ?? null,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const toolId = String(body?.toolId || '').trim()
    const eventType = String(body?.eventType || '').trim()

    if (!toolId || !eventType) {
      return NextResponse.json({ error: 'toolId and eventType are required' }, { status: 400 })
    }

    const event = await db.toolEvents.create(toolId, eventType, body?.metadata)
    return NextResponse.json({ event })
  } catch {
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}
