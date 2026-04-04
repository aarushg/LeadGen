'use client'

import { useEffect, useState } from 'react'
import { Trash2, ChevronDown, Sparkles, Loader2, Copy, Check, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatRelativeDate } from '@/lib/utils'

type LeadStatus = 'new' | 'researched' | 'contacted' | 'replied' | 'qualified' | 'closed_won' | 'closed_lost'

interface Lead {
  id: string
  full_name: string | null
  company: string
  title: string | null
  email: string | null
  status: LeadStatus
  notes: string | null
  outreach_message: string | null
  lead_source?: string | null
  acquisition_channel?: string | null
  campaign_name?: string | null
  ad_set_name?: string | null
  lead_quality?: 'high' | 'medium' | 'low' | null
  estimated_revenue?: number | null
  created_at: string
  industry?: string | null
}

interface LeadScore {
  score: number
  tier: 'hot' | 'warm' | 'cold'
  reasoning: string
  nextAction: string
}

const STATUS_OPTIONS: LeadStatus[] = ['new', 'researched', 'contacted', 'replied', 'qualified', 'closed_won', 'closed_lost']

const STATUS_VARIANT: Record<LeadStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  new: 'secondary',
  researched: 'outline',
  contacted: 'default',
  replied: 'success',
  qualified: 'warning',
  closed_won: 'success',
  closed_lost: 'destructive',
}

const TIER_COLORS: Record<string, string> = {
  hot: 'text-red-600 bg-red-50 border-red-200',
  warm: 'text-orange-600 bg-orange-50 border-orange-200',
  cold: 'text-blue-600 bg-blue-50 border-blue-200',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)

  // AI state
  const [ollamaModel, setOllamaModel] = useState<string>('')
  const [scoring, setScoring] = useState(false)
  const [score, setScore] = useState<LeadScore | null>(null)
  const [draftingOutreach, setDraftingOutreach] = useState(false)
  const [draftedMessage, setDraftedMessage] = useState('')
  const [outreachChannel, setOutreachChannel] = useState<'email' | 'linkedin' | 'twitter'>('email')
  const [outreachTone, setOutreachTone] = useState<'professional' | 'casual' | 'direct' | 'warm'>('professional')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/ollama/status')
      .then(r => r.json())
      .then(data => { if (data.models?.length) setOllamaModel(data.models[0]) })
      .catch(() => {})
  }, [])

  async function fetchLeads() {
    const url = filter === 'all' ? '/api/leads' : `/api/leads?status=${filter}`
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      setLeads(data.leads ?? [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchLeads() }, [filter])

  function openLead(lead: Lead) {
    setSelected(lead)
    setScore(null)
    setDraftedMessage('')
  }

  async function updateStatus(id: string, status: LeadStatus) {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
      toast.success('Status updated')
    }
  }

  async function deleteLead(id: string) {
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setLeads(prev => prev.filter(l => l.id !== id))
      setSelected(null)
      toast.success('Lead deleted')
    }
  }

  async function scoreLead() {
    if (!selected || !ollamaModel) return
    setScoring(true)
    setScore(null)
    try {
      const res = await fetch('/api/ollama/score-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: selected, model: ollamaModel }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? 'Scoring failed'); return }
      setScore(data)
    } catch {
      toast.error('Could not reach Ollama')
    } finally {
      setScoring(false)
    }
  }

  async function draftOutreach() {
    if (!selected || !ollamaModel) return
    setDraftingOutreach(true)
    setDraftedMessage('')
    try {
      const res = await fetch('/api/ollama/draft-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: selected, channel: outreachChannel, tone: outreachTone, model: ollamaModel }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? 'Draft failed'); return }
      setDraftedMessage(data.message)
    } catch {
      toast.error('Could not reach Ollama')
    } finally {
      setDraftingOutreach(false)
    }
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filters: Array<LeadStatus | 'all'> = ['all', ...STATUS_OPTIONS]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CRM</h1>
        <p className="text-muted-foreground">Manage your lead pipeline</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads {leads.length > 0 && `(${leads.length})`}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Loading...</p>
          ) : leads.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No leads found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Company</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Added</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leads.map(lead => (
                    <tr
                      key={lead.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => openLead(lead)}
                    >
                      <td className="py-3 pr-4 font-medium">{lead.full_name || '—'}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{lead.company}</td>
                      <td className="py-3 pr-4" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1">
                              <Badge variant={STATUS_VARIANT[lead.status]}>
                                {lead.status.replace('_', ' ')}
                              </Badge>
                              <ChevronDown className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {STATUS_OPTIONS.map(s => (
                              <DropdownMenuItem key={s} onClick={() => updateStatus(lead.id, s)}>
                                {s.replace('_', ' ')}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground hidden sm:table-cell">
                        {formatRelativeDate(lead.created_at)}
                      </td>
                      <td className="py-3" onClick={e => e.stopPropagation()}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteLead(lead.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead detail dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selected.full_name || selected.company}</DialogTitle>
              <DialogDescription>{selected.title} — {selected.company}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              {/* Basic info */}
              <div className="grid grid-cols-2 gap-2">
                {selected.email && (
                  <div><span className="font-medium">Email: </span>{selected.email}</div>
                )}
                <div>
                  <span className="font-medium">Status: </span>
                  <Badge variant={STATUS_VARIANT[selected.status]}>{selected.status.replace('_', ' ')}</Badge>
                </div>
              </div>

              {selected.outreach_message && (
                <div>
                  <p className="font-medium mb-1">Outreach message:</p>
                  <p className="text-muted-foreground whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
                    {selected.outreach_message}
                  </p>
                </div>
              )}
              {selected.notes && (
                <div>
                  <p className="font-medium mb-1">Notes:</p>
                  <p className="text-muted-foreground">{selected.notes}</p>
                </div>
              )}
              {(selected.lead_source || selected.acquisition_channel || selected.campaign_name || selected.ad_set_name) && (
                <div className="space-y-1">
                  <p className="font-medium">Campaign tracking</p>
                  {selected.lead_source && <div><span className="font-medium">Lead source: </span>{selected.lead_source}</div>}
                  {selected.acquisition_channel && <div><span className="font-medium">Channel: </span>{selected.acquisition_channel}</div>}
                  {selected.campaign_name && <div><span className="font-medium">Campaign: </span>{selected.campaign_name}</div>}
                  {selected.ad_set_name && <div><span className="font-medium">Ad set: </span>{selected.ad_set_name}</div>}
                  {selected.lead_quality && <div><span className="font-medium">Lead quality: </span>{selected.lead_quality}</div>}
                  {typeof selected.estimated_revenue === 'number' && (
                    <div><span className="font-medium">Estimated revenue: </span>${selected.estimated_revenue.toLocaleString()}</div>
                  )}
                </div>
              )}

              {/* AI Lead Scoring */}
              {ollamaModel && (
                <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <p className="font-medium flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-primary" />
                      AI Lead Score
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={scoreLead}
                      disabled={scoring}
                      className="gap-1.5 h-7"
                    >
                      {scoring ? (
                        <><Loader2 className="h-3 w-3 animate-spin" /> Scoring...</>
                      ) : score ? (
                        <><RefreshCw className="h-3 w-3" /> Re-score</>
                      ) : (
                        <><Sparkles className="h-3 w-3" /> Score lead</>
                      )}
                    </Button>
                  </div>

                  {score && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-2xl font-bold">{score.score}</span>
                          <span className="text-muted-foreground text-xs">/10</span>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${TIER_COLORS[score.tier] ?? ''}`}>
                          {score.tier}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{score.reasoning}</p>
                      <div className="rounded-md bg-primary/5 border border-primary/10 px-3 py-2">
                        <p className="text-xs font-medium text-primary">Recommended next step</p>
                        <p className="text-xs mt-0.5">{score.nextAction}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI Outreach Drafting */}
              {ollamaModel && (
                <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                  <p className="font-medium flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Draft Outreach with AI
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-muted-foreground">Channel:</span>
                      {(['email', 'linkedin', 'twitter'] as const).map(ch => (
                        <button
                          key={ch}
                          onClick={() => setOutreachChannel(ch)}
                          className={`px-2 py-0.5 rounded-full border text-xs capitalize transition-colors ${outreachChannel === ch ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-muted-foreground">Tone:</span>
                      {(['professional', 'casual', 'direct', 'warm'] as const).map(tn => (
                        <button
                          key={tn}
                          onClick={() => setOutreachTone(tn)}
                          className={`px-2 py-0.5 rounded-full border text-xs capitalize transition-colors ${outreachTone === tn ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}`}
                        >
                          {tn}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={draftOutreach}
                    disabled={draftingOutreach}
                    className="gap-1.5 h-7"
                  >
                    {draftingOutreach ? (
                      <><Loader2 className="h-3 w-3 animate-spin" /> Drafting...</>
                    ) : draftedMessage ? (
                      <><RefreshCw className="h-3 w-3" /> Redraft</>
                    ) : (
                      <><Sparkles className="h-3 w-3" /> Draft message</>
                    )}
                  </Button>
                  {draftedMessage && (
                    <div className="relative">
                      <p className="text-xs whitespace-pre-wrap rounded-md bg-background border p-3 pr-8 leading-relaxed">
                        {draftedMessage}
                      </p>
                      <button
                        onClick={() => copyText(draftedMessage)}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!ollamaModel && (
                <p className="text-xs text-muted-foreground border rounded-lg p-3 bg-muted/30">
                  Start Ollama locally to enable AI lead scoring and outreach drafting.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteLead(selected.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
