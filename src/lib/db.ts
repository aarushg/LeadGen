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

interface DBData {
  leads: Lead[]
  proposals: Proposal[]
}

// Serialise concurrent writes so the file is never clobbered
let writeQueue: Promise<void> = Promise.resolve()

async function read(): Promise<DBData> {
  try {
    const raw = await readFile(DB_FILE, 'utf-8')
    return JSON.parse(raw) as DBData
  } catch {
    return { leads: [], proposals: [] }
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
}
