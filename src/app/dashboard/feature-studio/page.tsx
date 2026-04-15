'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { featureStudioItems } from '@/lib/feature-studio-data'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

type Stage = 'idea' | 'building' | 'launched'

type FeatureState = {
  stage: Stage
  owner: string
  client: string
  notes: string
  enabled: boolean
}

type StudioState = {
  items: Record<string, FeatureState>
}

const TOOL_ID = 'feature-studio-100'

function createDefaultState(): StudioState {
  const items: Record<string, FeatureState> = {}
  for (const feature of featureStudioItems) {
    items[feature.id] = {
      stage: 'idea',
      owner: '',
      client: '',
      notes: '',
      enabled: false,
    }
  }
  return { items }
}

export default function FeatureStudioPage() {
  const [state, setState] = useState<StudioState>(createDefaultState)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stageFilter, setStageFilter] = useState<'all' | Stage>('all')
  const [savingAll, setSavingAll] = useState(false)

  useEffect(() => {
    async function hydrate() {
      const saved = await loadToolState<StudioState>(TOOL_ID)
      if (!saved?.items) return

      const base = createDefaultState()
      setState({ items: { ...base.items, ...saved.items } })
    }

    hydrate()
  }, [])

  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(featureStudioItems.map((item) => item.category)))]
  }, [])

  const filtered = useMemo(() => {
    return featureStudioItems.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false

      const itemState = state.items[item.id]
      if (stageFilter !== 'all' && itemState?.stage !== stageFilter) return false

      const haystack = `${item.title} ${item.description} ${item.category}`.toLowerCase()
      return haystack.includes(query.toLowerCase())
    })
  }, [categoryFilter, query, stageFilter, state.items])

  const progress = useMemo(() => {
    const values = Object.values(state.items)
    const launched = values.filter((item) => item.stage === 'launched').length
    const building = values.filter((item) => item.stage === 'building').length
    const enabled = values.filter((item) => item.enabled).length
    return { launched, building, enabled, total: featureStudioItems.length }
  }, [state.items])

  function updateItem(id: string, patch: Partial<FeatureState>) {
    setState((prev) => ({
      items: {
        ...prev.items,
        [id]: {
          ...prev.items[id],
          ...patch,
        },
      },
    }))
  }

  async function saveAll() {
    setSavingAll(true)
    try {
      await saveToolState(TOOL_ID, state)
      await trackToolEvent(TOOL_ID, 'feature_studio_saved', {
        launched: progress.launched,
        building: progress.building,
        enabled: progress.enabled,
      })
      toast.success('Feature Studio state saved')
    } catch {
      toast.error('Could not save Feature Studio state')
    } finally {
      setSavingAll(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Feature Studio</h1>
          <p className="text-muted-foreground">100 implemented feature modules with editable ownership, stage, and client notes.</p>
        </div>
        <Button onClick={saveAll} disabled={savingAll}>
          <Save className="h-4 w-4" />
          {savingAll ? 'Saving...' : 'Save All'}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total Features</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{progress.total}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Launched</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{progress.launched}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Building</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{progress.building}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Enabled</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{progress.enabled}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 md:grid-cols-3">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search features" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={(value) => setStageFilter(value as 'all' | Stage)}>
              <SelectTrigger><SelectValue placeholder="Stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">all</SelectItem>
                <SelectItem value="idea">idea</SelectItem>
                <SelectItem value="building">building</SelectItem>
                <SelectItem value="launched">launched</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((feature) => {
          const itemState = state.items[feature.id]
          return (
            <Card key={feature.id}>
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <Badge variant={itemState.stage === 'launched' ? 'success' : itemState.stage === 'building' ? 'warning' : 'secondary'}>
                    {itemState.stage}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{feature.id}</span>
                  <span>•</span>
                  <span>{feature.category}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Stage</Label>
                    <Select value={itemState.stage} onValueChange={(value) => updateItem(feature.id, { stage: value as Stage })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idea">idea</SelectItem>
                        <SelectItem value="building">building</SelectItem>
                        <SelectItem value="launched">launched</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Enabled</Label>
                    <Button
                      type="button"
                      variant={itemState.enabled ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => updateItem(feature.id, { enabled: !itemState.enabled })}
                    >
                      {itemState.enabled ? (
                        <><CheckCircle2 className="h-4 w-4" /> Enabled</>
                      ) : (
                        'Enable'
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Owner</Label>
                    <Input
                      value={itemState.owner}
                      onChange={(e) => updateItem(feature.id, { owner: e.target.value })}
                      placeholder="Owner name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Input
                      value={itemState.client}
                      onChange={(e) => updateItem(feature.id, { client: e.target.value })}
                      placeholder="Client account"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Implementation Notes</Label>
                  <Textarea
                    value={itemState.notes}
                    onChange={(e) => updateItem(feature.id, { notes: e.target.value })}
                    rows={3}
                    placeholder="Add implementation context, constraints, and next steps."
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
