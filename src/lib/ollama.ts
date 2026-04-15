const OLLAMA_BASE = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function ollamaChat(
  model: string,
  messages: OllamaMessage[],
  options?: { temperature?: number }
): Promise<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false, options }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Ollama error (${res.status}): ${err}`)
  }
  const data = await res.json()
  return data.message?.content ?? ''
}

export async function ollamaChatStream(
  model: string,
  messages: OllamaMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: true }),
  })
  if (!res.ok) throw new Error(`Ollama stream error (${res.status})`)
  if (!res.body) throw new Error('No response body from Ollama')
  return res.body
}

export async function listModels(): Promise<string[]> {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return (data.models ?? []).map((m: { name: string }) => m.name)
  } catch {
    return []
  }
}

export async function ollamaStatus(): Promise<{ running: boolean; models: string[] }> {
  try {
    const models = await listModels()
    return { running: true, models }
  } catch {
    return { running: false, models: [] }
  }
}
