import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getRequestSession, isAdmin } from '@/lib/auth/server-session'

export async function GET(req: NextRequest) {
  const session = getRequestSession(req)
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const users = await db.users.list()
  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  const session = getRequestSession(req)
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const body = await req.json()
  const email = String(body.email ?? '').trim().toLowerCase()
  const fullName = String(body.fullName ?? '').trim()
  const role = String(body.role ?? 'nurse').trim() as 'nurse' | 'lawyer' | 'dreamer'

  if (!email || !fullName) {
    return NextResponse.json({ error: 'email and fullName are required' }, { status: 400 })
  }

  if (!['nurse', 'lawyer', 'dreamer'].includes(role)) {
    return NextResponse.json({ error: 'role must be nurse, lawyer, or dreamer' }, { status: 400 })
  }

  try {
    const user = await db.users.create({
      email,
      full_name: fullName,
      role,
      managed_by_admin_id: session.userId,
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create user'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
