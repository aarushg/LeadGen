import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getRequestSession } from '@/lib/auth/server-session'
import { canAccessLead } from '@/lib/auth/access'

export async function GET(req: NextRequest) {
  const session = getRequestSession(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const status = req.nextUrl.searchParams.get('status') ?? undefined
  const clientId = req.nextUrl.searchParams.get('clientId') ?? undefined

  const leads = await db.leads.list(status)
  const clients = await db.clients.list()
  const assignedClientIds = new Set(
    clients
      .filter((c) => c.assigned_user_ids.includes(session.userId))
      .map((c) => c.id)
  )

  const visibleLeads = leads.filter((lead) => canAccessLead(session, lead, assignedClientIds))
  const filteredByClient = clientId
    ? visibleLeads.filter((lead) => lead.client_id === clientId)
    : visibleLeads

  return NextResponse.json({ leads: filteredByClient })
}

export async function POST(req: NextRequest) {
  const session = getRequestSession(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const requestedClientId = typeof body.client_id === 'string' ? body.client_id : undefined

  if (requestedClientId) {
    const client = await db.clients.get(requestedClientId)
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const canUseClient = session.role === 'admin' || client.assigned_user_ids.includes(session.userId)
    if (!canUseClient) {
      return NextResponse.json({ error: 'Forbidden for this client' }, { status: 403 })
    }
  }

  const lead = await db.leads.create({
    ...body,
    owner_user_id: session.userId,
    client_id: requestedClientId,
  })
  return NextResponse.json({ lead }, { status: 201 })
}
