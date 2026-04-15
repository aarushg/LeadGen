import { NextResponse } from 'next/server'
import { ollamaStatus } from '@/lib/ollama'

export async function GET() {
  const status = await ollamaStatus()
  return NextResponse.json(status)
}
