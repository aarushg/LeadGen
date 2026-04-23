'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Trash2, ChevronDown, Sparkles, Loader2, Copy, Check,
  RefreshCw, Search, FileText, Mail, ExternalLink, Phone, Globe,
  MapPin, Star, Wand2,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const SKILL_SHORTCUTS = [
  { id: 'cold-email', label: 'Cold Email' },
  { id: 'seo-audit', label: 'SEO Audit' },
  { id: 'competitor-analysis', label: 'Competitor Analysis' },
  { id: 'marketing-ideas', label: 'Marketing Ideas' },
]

type LeadStatus = 'new' | 'researched' | 'contacted' | 'replied' | 'qualified' | 'closed_won' | 'closed_lost'

interface Lead {
  id: string
  company: string
  fullName: string | null
  email: string | null
  phone: string | null
  companyWebsite: string | null
  city: string | null
  state: string | null
  notes: string | null
  outreachMessage: string | null
  status: LeadStatus
  createdAt: string
}

const STATUS_OPTIONS: LeadStatus[] = ['new', 'researched', 'contacted', 'replied', 'qualified', 'closed_won', 'closed_lost']

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'bg-secondary text-muted-foreground',
  researched: 'bg-blue-500/15 text-blue-400',
  contacted: 'bg-amber-500/15 text-amber-400',
  replied: 'bg-purple-500/15 text-purple-400',
  qualified: 'bg-emerald-500/15 text-emerald-400',
  closed_won: 'bg-emerald-600/20 text-emerald-300',
  closed_lost: 'bg-destructive/15 text-destructive',
}

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusOpen, setStatusOpen] = useState(false)

  // Outreach draft state
  const [drafting, setDrafting] = useState(false)
  const [draft, setDraft] = useState('')
  const [channel, setChannel] = useState<'email' | 'linkedin' | 'twitter'>('email')
  const [tone, setTone] = useState<'professional' | 'casual' | 'direct' | 'warm'>('professional')
  const [copied, setCopied] = useState(false)

  async function fetchLeads() {
    setLoading(true)
    const url = filter === 'all' ? '/api/leads' : `/api/leads?status=${filter}`
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      setLeads(data.leads ?? [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchLeads() }, [filter])

  const visible = leads.filter(l =>
    !search ||
    l.company.toLowerCase().includes(search.toLowerCase()) ||
    (l.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (l.city ?? '').toLowerCase().includes(search.toLowerCase())
  )

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

  async function draftOutreach() {
    if (!selected) return
    setDrafting(true)
    setDraft('')
    try {
      const res = await fetch('/api/skills/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillId: 'cold-email',
          messages: [{
            role: 'user',
            content: `Write a ${tone} outreach ${channel === 'email' ? 'email' : channel + ' message'} for this lead:

Company: ${selected.company}
${selected.fullName ? `Contact: ${selected.fullName}` : ''}
${selected.email ? `Email: ${selected.email}` : ''}
${selected.city || selected.state ? `Location: ${[selected.city, selected.state].filter(Boolean).join(', ')}` : ''}
${selected.notes ? `Context: ${selected.notes}` : ''}

Write the outreach message now. Be concise and specific.`,
          }],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDraft(data.message)
      // Save outreach message back to the lead
      await fetch(`/api/leads/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outreachMessage: data.message }),
      })
    } catch {
      toast.error('Failed to draft outreach')
    } finally {
      setDrafting(false)
    }
  }

  async function copyDraft() {
    await navigator.clipboard.writeText(draft)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard')
  }

  function openResearch(lead: Lead) {
    const params = new URLSearchParams({
      company: lead.company,
      ...(lead.companyWebsite ? { website: lead.companyWebsite } : {}),
      ...(lead.fullName ? { contactName: lead.fullName } : {}),
      ...(lead.email ? { email: lead.email } : {}),
    })
    router.push(`/research?${params.toString()}`)
  }

  function openProposal(lead: Lead) {
    const params = new URLSearchParams({
      clientCompany: lead.company,
      ...(lead.fullName ? { clientName: lead.fullName } : {}),
      ...(lead.email ? { clientEmail: lead.email } : {}),
    })
    router.push(`/proposals/new?${params.toString()}`)
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Lead list */}
      <div className={cn('flex flex-col border-r border-border', selected ? 'hidden md:flex md:w-80 lg:w-96 flex-shrink-0' : 'flex-1')}>
        {/* Header */}
        <div className="px-4 py-4 border-b border-border space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">CRM</h1>
            <span className="text-xs text-muted-foreground">{visible.length} leads</span>
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60"
          />
          <div className="flex gap-1.5 flex-wrap">
            {(['all', ...STATUS_OPTIONS] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                )}
              >
                {f === 'all' ? 'All' : f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : visible.length === 0 ? (
            <div className="text-center py-16 px-4">
              <p className="text-muted-foreground text-sm">No leads found.</p>
              <p className="text-xs text-muted-foreground mt-1">Import leads from the sidebar to get started.</p>
            </div>
          ) : (
            visible.map(lead => (
              <button
                key={lead.id}
                onClick={() => { setSelected(lead); setDraft(''); setStatusOpen(false) }}
                className={cn(
                  'w-full text-left px-4 py-3 border-b border-border/50 hover:bg-secondary/50 transition-colors',
                  selected?.id === lead.id && 'bg-primary/5 border-l-2 border-l-primary'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{lead.company}</p>
                    {lead.fullName && <p className="text-xs text-muted-foreground truncate">{lead.fullName}</p>}
                    {(lead.city || lead.state) && (
                      <p className="text-xs text-muted-foreground truncate">
                        {[lead.city, lead.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0', STATUS_STYLES[lead.status])}>
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Lead detail panel */}
      {selected ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Detail header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelected(null)}
                className="md:hidden p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
              >
                ←
              </button>
              <div>
                <h2 className="font-bold">{selected.company}</h2>
                {selected.fullName && <p className="text-sm text-muted-foreground">{selected.fullName}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Status picker */}
              <div className="relative">
                <button
                  onClick={() => setStatusOpen(!statusOpen)}
                  className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium', STATUS_STYLES[selected.status])}
                >
                  {selected.status.replace('_', ' ')}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {statusOpen && (
                  <div className="absolute right-0 top-8 z-10 w-40 bg-card border border-border rounded-xl shadow-lg py-1 overflow-hidden">
                    {STATUS_OPTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => { updateStatus(selected.id, s); setStatusOpen(false) }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors capitalize"
                      >
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteLead(selected.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detail content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Contact info */}
            <div className="glass rounded-xl p-4 space-y-2.5">
              {selected.email && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a href={`mailto:${selected.email}`} className="text-primary hover:underline truncate">{selected.email}</a>
                </div>
              )}
              {selected.phone && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{selected.phone}</span>
                </div>
              )}
              {selected.companyWebsite && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a href={selected.companyWebsite.startsWith('http') ? selected.companyWebsite : `https://${selected.companyWebsite}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-primary hover:underline truncate flex items-center gap-1">
                    {selected.companyWebsite}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {(selected.city || selected.state) && (
                <div className="flex items-center gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{[selected.city, selected.state].filter(Boolean).join(', ')}</span>
                </div>
              )}
            </div>

            {/* Notes */}
            {selected.notes && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Notes</p>
                <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/50 rounded-xl p-3">
                  {selected.notes}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => openResearch(selected)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Search className="w-4 h-4" />
                Research Lead
              </button>
              <button
                onClick={() => openProposal(selected)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:border-primary/40 hover:bg-secondary/50 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Generate Proposal
              </button>
            </div>

            {/* Use with Marketing Skills */}
            <div className="glass rounded-xl p-4 space-y-2.5">
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-primary" />
                Use with Marketing Skills
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SKILL_SHORTCUTS.map(skill => {
                  const params = new URLSearchParams({
                    prefill: `Company: ${selected.company}${selected.companyWebsite ? `\nWebsite: ${selected.companyWebsite}` : ''}${selected.email ? `\nEmail: ${selected.email}` : ''}${selected.notes ? `\nContext: ${selected.notes}` : ''}`,
                  })
                  return (
                    <Link
                      key={skill.id}
                      href={`/skills/${skill.id}?${params.toString()}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/40 hover:bg-secondary/50 text-xs font-medium transition-colors"
                    >
                      <Wand2 className="w-3 h-3 text-muted-foreground" />
                      {skill.label}
                    </Link>
                  )
                })}
              </div>
              <Link
                href="/skills"
                className="text-xs text-primary hover:underline"
              >
                Browse all 8 skills →
              </Link>
            </div>

            {/* AI Outreach drafting */}
            <div className="glass rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                Draft Outreach with Claude
              </p>

              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Channel:</span>
                  {(['email', 'linkedin', 'twitter'] as const).map(ch => (
                    <button key={ch} onClick={() => setChannel(ch)}
                      className={cn('px-2 py-0.5 rounded-full border text-xs capitalize transition-colors',
                        channel === ch ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'
                      )}>
                      {ch}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Tone:</span>
                  {(['professional', 'casual', 'direct', 'warm'] as const).map(tn => (
                    <button key={tn} onClick={() => setTone(tn)}
                      className={cn('px-2 py-0.5 rounded-full border text-xs capitalize transition-colors',
                        tone === tn ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'
                      )}>
                      {tn}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={draftOutreach}
                disabled={drafting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-primary/40 transition-colors disabled:opacity-60"
              >
                {drafting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Drafting...</>
                  : draft
                    ? <><RefreshCw className="w-4 h-4" /> Redraft</>
                    : <><Sparkles className="w-4 h-4" /> Draft message</>
                }
              </button>

              {draft && (
                <div className="relative">
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed bg-secondary/60 rounded-lg p-3 pr-8">
                    {draft}
                  </pre>
                  <button
                    onClick={copyDraft}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Saved outreach message */}
            {selected.outreachMessage && !draft && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Saved Outreach</p>
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed bg-secondary/50 rounded-xl p-3">
                  {selected.outreachMessage}
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-center p-8">
          <div>
            <Star className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Select a lead to view details</p>
          </div>
        </div>
      )}
    </div>
  )
}
