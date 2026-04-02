'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeftRight, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

interface BridgeMapping {
  id: string
  source: string
  destination: string
  trigger: string
  syncedLeads: number
  status: 'active' | 'paused'
}

interface MappingForm {
  source: string
  destination: string
  trigger: string
}

const TOOL_ID = 'leadsbridge'

export default function LeadsBridgePage() {
  const [mappings, setMappings] = useState<BridgeMapping[]>([])
  const [form, setForm] = useState<MappingForm>({ source: '', destination: '', trigger: 'new_lead' })
  const [filter, setFilter] = useState('')

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ mappings: BridgeMapping[] }>(TOOL_ID)
      if (!cancelled && state?.mappings) {
        setMappings(state.mappings)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { mappings })
  }, [mappings])

  function createMapping() {
    if (!form.source.trim() || !form.destination.trim()) {
      toast.error('Source and destination are required')
      return
    }

    const mapping: BridgeMapping = {
      id: `map-${Date.now()}`,
      source: form.source.trim(),
      destination: form.destination.trim(),
      trigger: form.trigger,
      syncedLeads: 0,
      status: 'active',
    }

    setMappings([mapping, ...mappings])
    setForm({ source: '', destination: '', trigger: 'new_lead' })
    void trackToolEvent(TOOL_ID, 'mapping_created')
    toast.success('Lead sync mapping created')
  }

  function runSync(id: string) {
    setMappings(
      mappings.map(mapping =>
        mapping.id === id
          ? { ...mapping, syncedLeads: mapping.syncedLeads + Math.floor(Math.random() * 8) + 1 }
          : mapping
      )
    )
    void trackToolEvent(TOOL_ID, 'sync_executed')
    toast.success('Sync run completed')
  }

  function toggleStatus(id: string) {
    setMappings(
      mappings.map(mapping =>
        mapping.id === id
          ? { ...mapping, status: mapping.status === 'active' ? 'paused' : 'active' }
          : mapping
      )
    )
    void trackToolEvent(TOOL_ID, 'mapping_toggled')
  }

  function removeMapping(id: string) {
    setMappings(mappings.filter(mapping => mapping.id !== id))
    void trackToolEvent(TOOL_ID, 'mapping_deleted')
    toast.success('Mapping removed')
  }

  const filteredMappings = useMemo(() => {
    const normalized = filter.toLowerCase().trim()
    if (!normalized) return mappings
    return mappings.filter(mapping =>
      [mapping.source, mapping.destination, mapping.trigger, mapping.status].some(field =>
        field.toLowerCase().includes(normalized)
      )
    )
  }, [mappings, filter])

  const totalSyncedLeads = mappings.reduce((sum, mapping) => sum + mapping.syncedLeads, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">LeadsBridge - Lead Sync Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Create real-time lead routing between ad networks, forms, and CRM destinations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Mappings</p><p className="text-2xl font-bold">{mappings.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold">{mappings.filter(m => m.status === 'active').length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Leads Synced</p><p className="text-2xl font-bold">{totalSyncedLeads}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Create Mapping</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Source</Label>
              <Input placeholder="Meta Lead Ads" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} />
            </div>
            <div>
              <Label>Destination</Label>
              <Input placeholder="HubSpot" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
            </div>
            <div>
              <Label>Trigger</Label>
              <select className="w-full px-3 py-2 border rounded-md" value={form.trigger} onChange={e => setForm({ ...form, trigger: e.target.value })}>
                <option value="new_lead">new_lead</option>
                <option value="qualified_lead">qualified_lead</option>
                <option value="status_changed">status_changed</option>
              </select>
            </div>
          </div>
          <Button onClick={createMapping} className="w-full"><Plus className="h-4 w-4 mr-2" />Add Mapping</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><ArrowLeftRight className="h-5 w-5" />Sync Mappings</span>
            <Input className="w-64" placeholder="Filter mappings" value={filter} onChange={e => setFilter(e.target.value)} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredMappings.length === 0 && <p className="text-sm text-muted-foreground">No mappings created yet.</p>}
          {filteredMappings.map(mapping => (
            <div key={mapping.id} className="border rounded-lg p-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{mapping.source} to {mapping.destination}</p>
                <p className="text-sm text-muted-foreground">Trigger: {mapping.trigger}</p>
                <div className="flex gap-2 mt-2">
                  <Badge>{mapping.status}</Badge>
                  <Badge variant="outline">Synced: {mapping.syncedLeads}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => runSync(mapping.id)} disabled={mapping.status !== 'active'}>Run Sync</Button>
                <Button size="sm" variant="outline" onClick={() => toggleStatus(mapping.id)}>{mapping.status === 'active' ? 'Pause' : 'Resume'}</Button>
                <Button size="sm" variant="destructive" onClick={() => removeMapping(mapping.id)}>
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
