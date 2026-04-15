import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getRequestSession, isAdmin } from '@/lib/auth/server-session'

export async function GET(req: NextRequest) {
  const session = getRequestSession(req)
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const clients = await db.clients.list()
  return NextResponse.json({ clients })
}

export async function POST(req: NextRequest) {
  const session = getRequestSession(req)
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const body = await req.json()
  const name = String(body.name ?? '').trim()
  const assignedUserIds = Array.isArray(body.assignedUserIds)
    ? body.assignedUserIds.map((v: unknown) => String(v)).filter(Boolean)
    : []

  if (!name) {
    return NextResponse.json({ error: 'Client name is required' }, { status: 400 })
  }

  const client = await db.clients.create({
    name,
    owner_admin_id: session.userId,
    assigned_user_ids: assignedUserIds,
  })

  return NextResponse.json({ client }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = getRequestSession(req)
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const body = await req.json()
  const clientId = String(body.clientId ?? '').trim()
  const assignedUserIds = Array.isArray(body.assignedUserIds)
    ? body.assignedUserIds.map((v: unknown) => String(v)).filter(Boolean)
    : []

  if (!clientId) {
    return NextResponse.json({ error: 'clientId is required' }, { status: 400 })
  }

  const updated = await db.clients.assignUsers(clientId, assignedUserIds)
  if (!updated) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  return NextResponse.json({ client: updated })
}
