import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { runToolByName } from '@/lib/tool-runner'
import { getToolProfile } from '@/lib/tool-profiles'

interface RunEntry {
  id: string
  createdAt: string
  input: Record<string, unknown>
  output: Record<string, unknown>
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tool = await db.tools.get(id)

    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const input =
      body && typeof body === 'object' && !Array.isArray(body)
        ? ((body.input as Record<string, unknown>) ?? (body as Record<string, unknown>))
        : {}

    const execution = await runToolByName(tool.name, input)

    const stateRecord = await db.toolState.get(id)
    const existing =
      stateRecord?.state && typeof stateRecord.state === 'object'
        ? (stateRecord.state as { runs?: RunEntry[] })
        : {}

    const runEntry: RunEntry = {
      id: randomUUID(),
      createdAt: execution.executedAt,
      input: execution.input,
      output: execution.output,
    }

    const runs = [runEntry, ...(existing.runs ?? [])].slice(0, 20)

    await db.toolState.set(id, {
      ...existing,
      runs,
      lastResult: execution.output,
      lastExecutedAt: execution.executedAt,
    })

    await db.toolEvents.create(id, 'tool_executed', {
      runId: runEntry.id,
      source: 'tools-library',
    })

    return NextResponse.json({
      toolId: id,
      toolName: tool.name,
      profile: getToolProfile(tool.name),
      result: execution.output,
      executedAt: execution.executedAt,
    })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to execute tool: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tool = await db.tools.get(id)

  if (!tool) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
  }

  const stateRecord = await db.toolState.get(id)
  const state =
    stateRecord?.state && typeof stateRecord.state === 'object'
      ? (stateRecord.state as { runs?: RunEntry[]; lastResult?: Record<string, unknown> })
      : {}

  return NextResponse.json({
    toolId: id,
    toolName: tool.name,
    profile: getToolProfile(tool.name),
    lastResult: state.lastResult ?? null,
    runs: state.runs ?? [],
  })
}
