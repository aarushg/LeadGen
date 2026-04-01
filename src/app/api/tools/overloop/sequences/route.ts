import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomUUID } from 'crypto'

export interface EmailSequence {
  id: string
  name: string
  description: string
  steps: EmailStep[]
  status: 'draft' | 'active' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface EmailStep {
  id: string
  order: number
  subject: string
  body: string
  delayDays: number
  type: 'email' | 'wait' | 'condition'
}

const TOOL_ID = 'overloop'

export async function GET() {
  const saved = await db.toolState.get(TOOL_ID)
  const sequences = ((saved?.state as { sequences?: EmailSequence[] } | undefined)?.sequences ?? [])
  return NextResponse.json({ sequences })
}

export async function POST(request: Request) {
  try {
    const { name, description, steps } = await request.json()

    if (!name || !steps || steps.length === 0) {
      return NextResponse.json({ error: 'Name and steps are required' }, { status: 400 })
    }

    const sequence: EmailSequence = {
      id: randomUUID(),
      name,
      description,
      steps: steps.map((step: Omit<EmailStep, 'id'>, idx: number) => ({
        ...step,
        id: randomUUID(),
        order: idx + 1,
      })),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const saved = await db.toolState.get(TOOL_ID)
    const sequences = ((saved?.state as { sequences?: EmailSequence[] } | undefined)?.sequences ?? [])
    const next = [...sequences, sequence]
    await db.toolState.set(TOOL_ID, { sequences: next })
    await db.toolEvents.create(TOOL_ID, 'sequence_created', { sequenceId: sequence.id })

    return NextResponse.json({ sequence })
  } catch (error) {
    console.error('Sequence creation error:', error)
    return NextResponse.json(
      { error: `Failed to create sequence: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
