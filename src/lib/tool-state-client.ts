export async function loadToolState<T>(toolId: string): Promise<T | null> {
  const res = await fetch(`/api/tools/state/${encodeURIComponent(toolId)}`)
  if (!res.ok) return null
  const data = await res.json()
  return (data?.state as T | null) ?? null
}

export async function saveToolState<T>(toolId: string, state: T): Promise<void> {
  await fetch(`/api/tools/state/${encodeURIComponent(toolId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  })
}

export async function trackToolEvent(
  toolId: string,
  eventType: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await fetch('/api/tools/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toolId, eventType, metadata }),
  })
}
