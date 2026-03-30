import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status') ?? undefined
  const leads = await db.leads.list(status)
  return NextResponse.json({ leads })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const lead = await db.leads.create(body)
  return NextResponse.json({ lead }, { status: 201 })
}
