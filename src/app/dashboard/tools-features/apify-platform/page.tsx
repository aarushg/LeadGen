'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Rocket, Plus, Play, Clock3, Database, ShieldCheck, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

type ActorMode = 'standard' | 'standby' | 'scheduled' | 'webhook'
type ProxyGroup = 'datacenter' | 'residential' | 'google-serp'
type RunStatus = 'queued' | 'running' | 'succeeded'

interface ActorDefinition {
  id: string
  name: string
  mode: ActorMode
  startUrls: string[]
  maxResults: number
  proxyGroup: ProxyGroup
  cron: string
  createdAt: string
}

interface ActorRun {
  id: string
  actorId: string
  actorName: string
  status: RunStatus
  startedAt: string
  recordsExtracted: number
  datasetId: string
}

const TOOL_ID = 'leadgenscrape'

const defaultForm = {
  name: '',
  mode: 'standard' as ActorMode,
  startUrls: 'https://example.com',
  maxResults: '100',
  proxyGroup: 'residential' as ProxyGroup,
  cron: '0 6 * * *',
}

export default function LeadGenScrapePage() {
  const [actors, setActors] = useState<ActorDefinition[]>([])
  const [runs, setRuns] = useState<ActorRun[]>([])
  const [query, setQuery] = useState('')
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ actors: ActorDefinition[]; runs: ActorRun[] }>(TOOL_ID)
      if (!cancelled) {
        setActors(state?.actors ?? [])
        setRuns(state?.runs ?? [])
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { actors, runs })
  }, [actors, runs])

  function createActor() {
    if (!form.name.trim()) {
      toast.error('Actor name is required')
      return
    }

    const urls = form.startUrls
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean)

    if (urls.length === 0) {
      toast.error('Add at least one start URL')
      return
    }

    const max = Number(form.maxResults)
    const maxResults = Number.isFinite(max) && max > 0 ? Math.round(max) : 100

    const actor: ActorDefinition = {
      id: `actor-${Date.now()}`,
      name: form.name.trim(),
      mode: form.mode,
      startUrls: urls,
      maxResults,
      proxyGroup: form.proxyGroup,
      cron: form.mode === 'scheduled' ? form.cron.trim() || '0 6 * * *' : '',
      createdAt: new Date().toISOString(),
    }

    setActors((prev) => [actor, ...prev])
    setForm(defaultForm)
    void trackToolEvent(TOOL_ID, 'actor_created', {
      mode: actor.mode,
      proxyGroup: actor.proxyGroup,
      urlCount: actor.startUrls.length,
    })
    toast.success('Actor blueprint saved')
  }

  function runActor(actor: ActorDefinition) {
    const runId = `run-${Date.now()}`
    const run: ActorRun = {
      id: runId,
      actorId: actor.id,
      actorName: actor.name,
      status: 'running',
      startedAt: new Date().toISOString(),
      recordsExtracted: 0,
      datasetId: `dataset-${Math.random().toString(36).slice(2, 10)}`,
    }

    setRuns((prev) => [run, ...prev])
    void trackToolEvent(TOOL_ID, 'actor_run_started', { actorName: actor.name, mode: actor.mode })
    toast.success(`Started run for ${actor.name}`)

    setTimeout(() => {
      const recordsExtracted = Math.max(1, Math.min(actor.maxResults, Math.floor(Math.random() * actor.maxResults) + 1))
      setRuns((prev) =>
        prev.map((item) =>
          item.id === runId
            ? {
                ...item,
                status: 'succeeded',
                recordsExtracted,
              }
            : item
        )
      )
      void trackToolEvent(TOOL_ID, 'actor_run_succeeded', { actorName: actor.name, recordsExtracted })
    }, 900)
  }

  function removeActor(id: string) {
    setActors((prev) => prev.filter((actor) => actor.id !== id))
    void trackToolEvent(TOOL_ID, 'actor_deleted')
    toast.success('Actor removed')
  }

  const visibleActors = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    if (!normalized) return actors
    return actors.filter((actor) =>
      [actor.name, actor.mode, actor.proxyGroup, actor.cron].some((value) => value.toLowerCase().includes(normalized))
    )
  }, [actors, query])

  const successfulRuns = runs.filter((run) => run.status === 'succeeded').length
  const successRate = runs.length > 0 ? Math.round((successfulRuns / runs.length) * 100) : 0
  const extractedRecords = runs.reduce((sum, run) => sum + run.recordsExtracted, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">LeadGenScrape - Actor Workflow Studio</h1>
        <p className="text-muted-foreground mt-2">
          Plan actors, run extraction jobs, and track dataset output for lead generation pipelines.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Actors</p><p className="text-2xl font-bold">{actors.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Runs</p><p className="text-2xl font-bold">{runs.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Success Rate</p><p className="text-2xl font-bold">{successRate}%</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Records Extracted</p><p className="text-2xl font-bold">{extractedRecords}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Create Actor Blueprint
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Actor Name</Label>
              <Input
                placeholder="Google Maps Lead Scraper"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label>Mode</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.mode}
                onChange={(e) => setForm((prev) => ({ ...prev, mode: e.target.value as ActorMode }))}
              >
                <option value="standard">standard</option>
                <option value="standby">standby</option>
                <option value="scheduled">scheduled</option>
                <option value="webhook">webhook</option>
              </select>
            </div>

            <div>
              <Label>Max Results</Label>
              <Input
                type="number"
                min={1}
                value={form.maxResults}
                onChange={(e) => setForm((prev) => ({ ...prev, maxResults: e.target.value }))}
              />
            </div>

            <div>
              <Label>Proxy Group</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.proxyGroup}
                onChange={(e) => setForm((prev) => ({ ...prev, proxyGroup: e.target.value as ProxyGroup }))}
              >
                <option value="residential">residential</option>
                <option value="datacenter">datacenter</option>
                <option value="google-serp">google-serp</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Start URLs (one per line)</Label>
            <Textarea
              rows={4}
              value={form.startUrls}
              onChange={(e) => setForm((prev) => ({ ...prev, startUrls: e.target.value }))}
              placeholder={'https://example.com\nhttps://example.com/pricing'}
            />
          </div>

          {form.mode === 'scheduled' && (
            <div>
              <Label>Cron Schedule</Label>
              <Input
                value={form.cron}
                onChange={(e) => setForm((prev) => ({ ...prev, cron: e.target.value }))}
                placeholder="0 6 * * *"
              />
            </div>
          )}

          <Button onClick={createActor} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Save Actor Blueprint
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2"><Database className="h-5 w-5" />Actor Registry</span>
            <Input className="w-64" placeholder="Filter actors" value={query} onChange={(e) => setQuery(e.target.value)} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleActors.length === 0 && <p className="text-sm text-muted-foreground">No actors created yet.</p>}
          {visibleActors.map((actor) => (
            <div key={actor.id} className="border rounded-lg p-4 flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="font-semibold">{actor.name}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge>{actor.mode}</Badge>
                  <Badge variant="outline"><ShieldCheck className="h-3.5 w-3.5 mr-1" />{actor.proxyGroup}</Badge>
                  <Badge variant="outline">URLs: {actor.startUrls.length}</Badge>
                  <Badge variant="outline">Max: {actor.maxResults}</Badge>
                  {actor.mode === 'scheduled' && <Badge variant="secondary"><Clock3 className="h-3.5 w-3.5 mr-1" />{actor.cron}</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => runActor(actor)}>
                  <Play className="h-4 w-4 mr-1" />
                  Run
                </Button>
                <Button size="sm" variant="destructive" onClick={() => removeActor(actor.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Runs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {runs.length === 0 && <p className="text-sm text-muted-foreground">No runs yet.</p>}
          {runs.map((run) => (
            <div key={run.id} className="border rounded-lg p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{run.actorName}</p>
                <p className="text-sm text-muted-foreground">Dataset: {run.datasetId}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={run.status === 'succeeded' ? 'default' : 'secondary'}>{run.status}</Badge>
                <Badge variant="outline">Records: {run.recordsExtracted}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
