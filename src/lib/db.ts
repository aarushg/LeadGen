import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

const DATA_DIR = join(process.cwd(), 'data')
const DB_FILE = join(DATA_DIR, 'db.json')

export type LeadStatus = 'new' | 'researched' | 'contacted' | 'replied' | 'qualified' | 'closed_won' | 'closed_lost'

export interface Lead {
  id: string
  full_name?: string
  company: string
  title?: string
  email?: string
  website?: string
  industry?: string
  status: LeadStatus
  notes?: string
  outreach_message?: string
  research_data?: string
  created_at: string
  updated_at: string
}

export interface Proposal {
  id: string
  lead_id?: string
  content: object
  status: string
  created_at: string
  updated_at: string
}

export interface Tool {
  id: string
  name: string
  type: string
  bestFor: string
  keyFeatures: string[]
  summary: string
  website?: string
  created_at: string
  updated_at: string
}

export interface ToolState {
  tool_id: string
  state: unknown
  updated_at: string
}

export interface ToolEvent {
  id: string
  tool_id: string
  event_type: string
  metadata?: Record<string, unknown>
  created_at: string
}

interface DBData {
  leads: Lead[]
  proposals: Proposal[]
  tools: Tool[]
  tool_states: ToolState[]
  tool_events: ToolEvent[]
}

// Serialise concurrent writes so the file is never clobbered
let writeQueue: Promise<void> = Promise.resolve()

async function read(): Promise<DBData> {
  try {
    const raw = await readFile(DB_FILE, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<DBData>
    return {
      leads: parsed.leads ?? [],
      proposals: parsed.proposals ?? [],
      tools: parsed.tools ?? [],
      tool_states: parsed.tool_states ?? [],
      tool_events: parsed.tool_events ?? [],
    }
  } catch {
    return { leads: [], proposals: [], tools: [], tool_states: [], tool_events: [] }
  }
}

function enqueueWrite(data: DBData): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    await mkdir(DATA_DIR, { recursive: true })
    await writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
  })
  return writeQueue
}

export const db = {
  leads: {
    async list(status?: string): Promise<Lead[]> {
      const { leads } = await read()
      const sorted = [...leads].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      return status ? sorted.filter(l => l.status === status) : sorted
    },

    async get(id: string): Promise<Lead | null> {
      const { leads } = await read()
      return leads.find(l => l.id === id) ?? null
    },

    async create(data: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
      const state = await read()
      const now = new Date().toISOString()
      const lead: Lead = { ...data, id: randomUUID(), created_at: now, updated_at: now }
      state.leads.push(lead)
      await enqueueWrite(state)
      return lead
    },

    async update(id: string, data: Partial<Omit<Lead, 'id' | 'created_at'>>): Promise<Lead | null> {
      const state = await read()
      const idx = state.leads.findIndex(l => l.id === id)
      if (idx === -1) return null
      state.leads[idx] = { ...state.leads[idx], ...data, updated_at: new Date().toISOString() }
      await enqueueWrite(state)
      return state.leads[idx]
    },

    async delete(id: string): Promise<boolean> {
      const state = await read()
      const before = state.leads.length
      state.leads = state.leads.filter(l => l.id !== id)
      if (state.leads.length === before) return false
      await enqueueWrite(state)
      return true
    },
  },

  proposals: {
    async list(): Promise<Proposal[]> {
      const { proposals } = await read()
      return [...proposals].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    },

    async get(id: string): Promise<Proposal | null> {
      const { proposals } = await read()
      return proposals.find(p => p.id === id) ?? null
    },

    async create(data: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>): Promise<Proposal> {
      const state = await read()
      const now = new Date().toISOString()
      const proposal: Proposal = { ...data, id: randomUUID(), created_at: now, updated_at: now }
      state.proposals.push(proposal)
      await enqueueWrite(state)
      return proposal
    },

    async update(id: string, data: Partial<Omit<Proposal, 'id' | 'created_at'>>): Promise<Proposal | null> {
      const state = await read()
      const idx = state.proposals.findIndex(p => p.id === id)
      if (idx === -1) return null
      state.proposals[idx] = { ...state.proposals[idx], ...data, updated_at: new Date().toISOString() }
      await enqueueWrite(state)
      return state.proposals[idx]
    },

    async delete(id: string): Promise<boolean> {
      const state = await read()
      const before = state.proposals.length
      state.proposals = state.proposals.filter(p => p.id !== id)
      if (state.proposals.length === before) return false
      await enqueueWrite(state)
      return true
    },
  },

  tools: {
    async list(): Promise<Tool[]> {
      const { tools } = await read()
      return [...tools].sort((a, b) => a.name.localeCompare(b.name))
    },

    async get(id: string): Promise<Tool | null> {
      const { tools } = await read()
      return tools.find(t => t.id === id) ?? null
    },

    async create(data: Omit<Tool, 'id' | 'created_at' | 'updated_at'>): Promise<Tool> {
      const state = await read()
      const now = new Date().toISOString()
      const tool: Tool = { ...data, id: randomUUID(), created_at: now, updated_at: now }
      state.tools.push(tool)
      await enqueueWrite(state)
      return tool
    },

    async seedIfEmpty(data: Array<Omit<Tool, 'id' | 'created_at' | 'updated_at'>>): Promise<Tool[]> {
      const state = await read()
      if (state.tools.length > 0) {
        return [...state.tools].sort((a, b) => a.name.localeCompare(b.name))
      }

      const now = new Date().toISOString()
      state.tools = data.map(item => ({
        ...item,
        id: randomUUID(),
        created_at: now,
        updated_at: now,
      }))

      await enqueueWrite(state)
      return [...state.tools].sort((a, b) => a.name.localeCompare(b.name))
    },
  },

  toolState: {
    async get(toolId: string): Promise<ToolState | null> {
      const { tool_states } = await read()
      return tool_states.find(s => s.tool_id === toolId) ?? null
    },

    async set(toolId: string, payload: unknown): Promise<ToolState> {
      const state = await read()
      const now = new Date().toISOString()
      const idx = state.tool_states.findIndex(s => s.tool_id === toolId)
      const entry: ToolState = {
        tool_id: toolId,
        state: payload,
        updated_at: now,
      }

      if (idx === -1) {
        state.tool_states.push(entry)
      } else {
        state.tool_states[idx] = entry
      }

      await enqueueWrite(state)
      return entry
    },

    async list(): Promise<ToolState[]> {
      const { tool_states } = await read()
      return [...tool_states].sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    },
  },

  toolEvents: {
    async create(toolId: string, eventType: string, metadata?: Record<string, unknown>): Promise<ToolEvent> {
      const state = await read()
      const event: ToolEvent = {
        id: randomUUID(),
        tool_id: toolId,
        event_type: eventType,
        metadata,
        created_at: new Date().toISOString(),
      }

      state.tool_events.push(event)
      await enqueueWrite(state)
      return event
    },

    async list(toolId?: string): Promise<ToolEvent[]> {
      const { tool_events } = await read()
      const filtered = toolId ? tool_events.filter(e => e.tool_id === toolId) : tool_events
      return [...filtered].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    },
  },
}
