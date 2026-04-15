import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getRequestSession } from '@/lib/auth/server-session'

export async function GET(req: NextRequest) {
  const session = getRequestSession(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clients = await db.clients.list()

  if (session.role === 'admin') {
    return NextResponse.json({ clients })
  }

  const visible = clients.filter((client) =>
    client.assigned_user_ids.includes(session.userId)
  )

  return NextResponse.json({ clients: visible })
}
