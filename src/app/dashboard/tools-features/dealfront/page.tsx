'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Eye, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

interface IntentSignal {
  id: string
  company: string
  topic: string
  intentScore: number
  region: string
  status: 'new' | 'reviewed' | 'prioritized'
}

const TOOL_ID = 'dealfront'

export default function DealfrontPage() {
  const [signals, setSignals] = useState<IntentSignal[]>([])
  const [company, setCompany] = useState('')
  const [topic, setTopic] = useState('')
  const [region, setRegion] = useState('North America')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ signals: IntentSignal[] }>(TOOL_ID)
      if (!cancelled && state?.signals) {
        setSignals(state.signals)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { signals })
  }, [signals])

  function createSignal() {
    if (!company.trim() || !topic.trim()) {
      toast.error('Company and topic are required')
      return
    }

    const signal: IntentSignal = {
      id: `signal-${Date.now()}`,
      company: company.trim(),
      topic: topic.trim(),
      region,
      intentScore: Math.floor(Math.random() * 40) + 60,
      status: 'new',
    }

    setSignals([signal, ...signals])
    setCompany('')
    setTopic('')
    void trackToolEvent(TOOL_ID, 'intent_signal_created', { score: signal.intentScore })
    toast.success('Intent signal captured')
  }

  function promoteSignal(id: string) {
    setSignals(
      signals.map(signal => {
        if (signal.id !== id) return signal
        const next = signal.status === 'new' ? 'reviewed' : 'prioritized'
        void trackToolEvent(TOOL_ID, 'intent_signal_updated', { from: signal.status, to: next })
        return { ...signal, status: next }
      })
    )
  }

  function removeSignal(id: string) {
    setSignals(signals.filter(signal => signal.id !== id))
    void trackToolEvent(TOOL_ID, 'intent_signal_deleted')
    toast.success('Intent signal removed')
  }

  const visibleSignals = useMemo(() => {
    const normalized = search.toLowerCase().trim()
    if (!normalized) return signals
    return signals.filter(signal =>
      [signal.company, signal.topic, signal.region, signal.status].some(value =>
        value.toLowerCase().includes(normalized)
      )
    )
  }, [signals, search])

  const prioritized = signals.filter(signal => signal.status === 'prioritized').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dealfront - Intent Intelligence</h1>
        <p className="text-muted-foreground mt-2">
          Track account-level buying intent signals and prioritize high-conversion opportunities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Signals</p><p className="text-2xl font-bold">{signals.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Prioritized</p><p className="text-2xl font-bold">{prioritized}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Avg. Intent Score</p><p className="text-2xl font-bold">{signals.length ? Math.round(signals.reduce((sum, signal) => sum + signal.intentScore, 0) / signals.length) : 0}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Capture Intent Signal</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Company</Label>
              <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Arcadia Security" />
            </div>
            <div>
              <Label>Topic</Label>
              <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="pipeline automation" />
            </div>
            <div>
              <Label>Region</Label>
              <select className="w-full px-3 py-2 border rounded-md" value={region} onChange={e => setRegion(e.target.value)}>
                <option>North America</option>
                <option>EMEA</option>
                <option>APAC</option>
                <option>LATAM</option>
              </select>
            </div>
          </div>
          <Button onClick={createSignal} className="w-full"><Plus className="h-4 w-4 mr-2" />Add Signal</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Eye className="h-5 w-5" />Intent Watchlist</span>
            <Input className="w-64" placeholder="Search signals" value={search} onChange={e => setSearch(e.target.value)} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleSignals.length === 0 && <p className="text-sm text-muted-foreground">No intent signals yet.</p>}
          {visibleSignals.map(signal => (
            <div key={signal.id} className="border rounded-lg p-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{signal.company}</p>
                <p className="text-sm text-muted-foreground">Topic: {signal.topic} ({signal.region})</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">Intent {signal.intentScore}</Badge>
                  <Badge>{signal.status}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => promoteSignal(signal.id)} disabled={signal.status === 'prioritized'}>
                  Promote
                </Button>
                <Button size="sm" variant="destructive" onClick={() => removeSignal(signal.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
