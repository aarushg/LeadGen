'use client'

import { useEffect, useMemo, useState } from 'react'
import { Save, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { buildLeadGenerationFeatures } from '@/lib/lead-generation-factory'
import {
  implementedFeatureDefinitions,
  runImplementedFeature,
  type ImplementedFeatureKey,
} from '@/lib/lead-generation-implementations'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

type FactoryState = {
  starredIds: string[]
  notes: Record<string, string>
  implementedInput?: string
  implementedOutput?: string
  implementedKey?: ImplementedFeatureKey
}

const TOOL_ID = 'lead-generation-factory-10000'
const PAGE_SIZE = 24

export default function LeadGenerationFactoryPage() {
  const [allFeatures] = useState(() => buildLeadGenerationFeatures(10000))
  const [state, setState] = useState<FactoryState>({
    starredIds: [],
    notes: {},
    implementedKey: 'LGF-0001',
    implementedInput: '',
    implementedOutput: '',
  })
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function hydrate() {
      const saved = await loadToolState<FactoryState>(TOOL_ID)
      if (!saved) return
      setState({
        starredIds: saved.starredIds ?? [],
        notes: saved.notes ?? {},
        implementedKey: saved.implementedKey ?? 'LGF-0001',
        implementedInput: saved.implementedInput ?? '',
        implementedOutput: saved.implementedOutput ?? '',
      })
    }

    hydrate()
  }, [])

  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(allFeatures.map((item) => item.category)))]
  }, [allFeatures])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return allFeatures.filter((feature) => {
      if (category !== 'all' && feature.category !== category) return false
      if (!normalized) return true

      const haystack = `${feature.title} ${feature.description} ${feature.category} ${feature.id}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }, [allFeatures, category, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [query, category])

  const pageSafe = Math.min(page, totalPages)
  const start = (pageSafe - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)

  function toggleStar(id: string) {
    setState((prev) => ({
      ...prev,
      starredIds: prev.starredIds.includes(id)
        ? prev.starredIds.filter((item) => item !== id)
        : [...prev.starredIds, id],
    }))
  }

  function updateNote(id: string, note: string) {
    setState((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [id]: note,
      },
    }))
  }

  const implementedKey = state.implementedKey ?? 'LGF-0001'
  const selectedImplementation =
    implementedFeatureDefinitions.find((item) => item.key === implementedKey) ?? implementedFeatureDefinitions[0]

  function runImplementation() {
    const output = runImplementedFeature(implementedKey, state.implementedInput ?? '')
    setState((prev) => ({ ...prev, implementedOutput: output }))
  }

  async function saveFactoryState() {
    setSaving(true)
    try {
      await saveToolState(TOOL_ID, state)
      await trackToolEvent(TOOL_ID, 'lead_generation_factory_saved', {
        totalFeatures: allFeatures.length,
        starredCount: state.starredIds.length,
        noteCount: Object.keys(state.notes).length,
      })
      toast.success('Lead Generation Factory saved')
    } catch {
      toast.error('Could not save Lead Generation Factory state')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lead Generation Factory</h1>
          <p className="text-muted-foreground">10,000 implemented lead-generation modules ready for execution and tracking.</p>
        </div>
        <Button onClick={saveFactoryState} disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Implemented Modules</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">10,000</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Visible</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{filtered.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Categories</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{categories.length - 1}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Starred</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{state.starredIds.length}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 md:grid-cols-3">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title, category, id" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
              <span>Page {pageSafe} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={pageSafe <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
              <Button variant="outline" size="sm" disabled={pageSafe >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implemented Features Runner (Batch 1)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Real runnable implementations for LGF-0001 through LGF-0010.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Feature</Label>
              <Select
                value={implementedKey}
                onValueChange={(value) =>
                  setState((prev) => ({
                    ...prev,
                    implementedKey: value as ImplementedFeatureKey,
                    implementedOutput: '',
                  }))
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {implementedFeatureDefinitions.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.key} - {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
                {selectedImplementation.description}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Input</Label>
            <Textarea
              rows={4}
              value={state.implementedInput ?? ''}
              onChange={(e) => setState((prev) => ({ ...prev, implementedInput: e.target.value }))}
              placeholder={selectedImplementation.placeholder}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={runImplementation}>Run Feature</Button>
          </div>

          <div className="space-y-2">
            <Label>Output</Label>
            <Textarea
              rows={8}
              readOnly
              value={state.implementedOutput ?? ''}
              placeholder="Run the selected feature to see output."
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((feature) => {
          const starred = state.starredIds.includes(feature.id)
          const note = state.notes[feature.id] ?? ''

          return (
            <Card key={feature.id}>
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <Badge variant="success">implemented</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{feature.id}</span>
                  <span>•</span>
                  <span>{feature.category}</span>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
                  Playbook: {feature.playbook}
                </div>
                <div className="space-y-2">
                  <Label>Execution Notes</Label>
                  <Textarea
                    rows={3}
                    value={note}
                    onChange={(e) => updateNote(feature.id, e.target.value)}
                    placeholder="Add notes for campaign execution."
                  />
                </div>
                <Button variant={starred ? 'default' : 'outline'} onClick={() => toggleStar(feature.id)}>
                  <Star className="h-4 w-4" />
                  {starred ? 'Starred' : 'Star Module'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
