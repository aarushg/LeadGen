import { NextRequest } from 'next/server'
import { ollamaChatStream } from '@/lib/ollama'

export async function POST(req: NextRequest) {
  const { model, messages } = await req.json()

  let stream: ReadableStream<Uint8Array>
  try {
    stream = await ollamaChatStream(model ?? 'llama3', messages)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Ollama unreachable'
    return new Response(JSON.stringify({ error: msg }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const decoder = new TextDecoder()
  const encoder = new TextEncoder()

  // Transform Ollama's ndjson stream → plain text token stream
  const transformed = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      const text = decoder.decode(chunk, { stream: true })
      for (const line of text.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed) continue
        try {
          const json = JSON.parse(trimmed)
          const token: string | undefined = json.message?.content
          if (token) controller.enqueue(encoder.encode(token))
        } catch {
          // partial chunk — ignore
        }
      }
    },
  })

  return new Response(stream.pipeThrough(transformed), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
    },
  })
}
