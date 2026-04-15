import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getRequestSession } from '@/lib/auth/server-session'
import { canAccessLead } from '@/lib/auth/access'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getRequestSession(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const current = await db.leads.get(id)
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const clients = await db.clients.list()
  const assignedClientIds = new Set(
    clients
      .filter((c) => c.assigned_user_ids.includes(session.userId))
      .map((c) => c.id)
  )

  if (!canAccessLead(session, current, assignedClientIds)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (typeof body.client_id === 'string') {
    const client = await db.clients.get(body.client_id)
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const canUseClient = session.role === 'admin' || client.assigned_user_ids.includes(session.userId)
    if (!canUseClient) {
      return NextResponse.json({ error: 'Forbidden for this client' }, { status: 403 })
    }
  }

  const lead = await db.leads.update(id, body)
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ lead })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getRequestSession(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const current = await db.leads.get(id)
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const clients = await db.clients.list()
  const assignedClientIds = new Set(
    clients
      .filter((c) => c.assigned_user_ids.includes(session.userId))
      .map((c) => c.id)
  )

  if (!canAccessLead(session, current, assignedClientIds)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const deleted = await db.leads.delete(id)
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return new NextResponse(null, { status: 204 })
}
