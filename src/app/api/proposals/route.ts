import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const proposals = await db.proposals.list()
  return NextResponse.json({ proposals })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const proposal = await db.proposals.create(body)
  return NextResponse.json({ proposal }, { status: 201 })
}
