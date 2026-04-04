'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, Save, Copy, Check, Bot, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface ResearchResult {
  brief: {
    background: string
    painPoints: string[]
    recentMoves: string[]
    contactProfile?: string
  }
  outreachMessage: string
  sources: Array<{ title: string; url: string }>
  aiProvider?: string
}

export default function ResearchPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    company: '',
    website: '',
    contactName: '',
    contactTitle: '',
    linkedinUrl: '',
    leadSource: '',
    acquisitionChannel: '',
    campaignName: '',
    adSetName: '',
    leadQuality: 'medium',
    estimatedRevenue: '',
    tone: 'professional',
    channel: 'email',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResearchResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [aiProvider, setAiProvider] = useState<'claude' | 'ollama'>('claude')
  const [ollamaModels, setOllamaModels] = useState<string[]>([])
  const [ollamaModel, setOllamaModel] = useState('')

  useEffect(() => {
    fetch('/api/ollama/status')
      .then(r => r.json())
      .then(data => {
        if (data.running && data.models?.length) {
          setOllamaModels(data.models)
          setOllamaModel(data.models[0])
        }
      })
      .catch(() => {})
  }, [])

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.company.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, aiProvider, ollamaModel }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Research failed')
      }
      const data = await res.json()
      setResult(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function saveLead() {
    if (!result) return
    setSaving(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company: form.company,
            company_website: form.website,
            full_name: form.contactName,
            title: form.contactTitle,
            linkedin_url: form.linkedinUrl,
            lead_source: form.leadSource || undefined,
            acquisition_channel: form.acquisitionChannel || undefined,
            campaign_name: form.campaignName || undefined,
            ad_set_name: form.adSetName || undefined,
            lead_quality: form.leadQuality || undefined,
            estimated_revenue: form.estimatedRevenue ? Number(form.estimatedRevenue) : undefined,
            outreach_message: result.outreachMessage,
            outreach_tone: form.tone,
            outreach_channel: form.channel,
          research_data: result.brief,
          status: 'researched',
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast.success('Lead saved to CRM')
      router.push('/dashboard/leads')
    } catch {
      toast.error('Failed to save lead')
    } finally {
      setSaving(false)
    }
  }

  async function copyMessage() {
    if (!result?.outreachMessage) return
    await navigator.clipboard.writeText(result.outreachMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Lead Research</h1>
          <p className="text-muted-foreground">AI-powered company research and personalized outreach</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Research Target</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    placeholder="Acme Corp"
                    value={form.company}
                    onChange={e => set('company', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input
                    id="website"
                    placeholder="https://acme.com"
                    value={form.website}
                    onChange={e => set('website', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      placeholder="Jane Smith"
                      value={form.contactName}
                      onChange={e => set('contactName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactTitle">Title</Label>
                    <Input
                      id="contactTitle"
                      placeholder="CEO"
                      value={form.contactTitle}
                      onChange={e => set('contactTitle', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input
                    id="linkedinUrl"
                    placeholder="https://linkedin.com/in/..."
                    value={form.linkedinUrl}
                    onChange={e => set('linkedinUrl', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="leadSource">Lead Source</Label>
                    <Input
                      id="leadSource"
                      placeholder="Google Ads"
                      value={form.leadSource}
                      onChange={e => set('leadSource', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acquisitionChannel">Acquisition Channel</Label>
                    <Input
                      id="acquisitionChannel"
                      placeholder="Paid Search"
                      value={form.acquisitionChannel}
                      onChange={e => set('acquisitionChannel', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="campaignName">Campaign Name</Label>
                    <Input
                      id="campaignName"
                      placeholder="Spring Demand Gen"
                      value={form.campaignName}
                      onChange={e => set('campaignName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adSetName">Ad Set / Ad Group</Label>
                    <Input
                      id="adSetName"
                      placeholder="CMO Lookalike"
                      value={form.adSetName}
                      onChange={e => set('adSetName', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Lead Quality</Label>
                    <Select value={form.leadQuality} onValueChange={v => set('leadQuality', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedRevenue">Estimated Revenue</Label>
                    <Input
                      id="estimatedRevenue"
                      type="number"
                      min="0"
                      step="100"
                      placeholder="5000"
                      value={form.estimatedRevenue}
                      onChange={e => set('estimatedRevenue', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select value={form.tone} onValueChange={v => set('tone', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="direct">Direct</SelectItem>
                        <SelectItem value="warm">Warm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Channel</Label>
                    <Select value={form.channel} onValueChange={v => set('channel', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* AI Provider selector */}
                <div className="space-y-2">
                  <Label>AI Engine</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAiProvider('claude')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                        aiProvider === 'claude'
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:bg-accent'
                      )}
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Claude
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiProvider('ollama')}
                      disabled={ollamaModels.length === 0}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
                        aiProvider === 'ollama'
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:bg-accent'
                      )}
                    >
                      <Bot className="h-3.5 w-3.5" /> Local AI
                    </button>
                  </div>
                  {aiProvider === 'ollama' && ollamaModels.length > 0 && (
                    <Select value={ollamaModel} onValueChange={setOllamaModel}>
                      <SelectTrigger className="text-xs h-8">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {ollamaModels.map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {ollamaModels.length === 0 && (
                    <p className="text-xs text-muted-foreground">Start Ollama to enable local AI</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading || !form.company.trim()}>
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Researching...</>
                  ) : (
                    <><Search className="h-4 w-4" /> Research & Generate Outreach</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            {loading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                  <p className="font-medium">Researching {form.company}...</p>
                  <p className="text-sm text-muted-foreground mt-1">Searching the web + generating insights</p>
                </CardContent>
              </Card>
            )}

            {result && !loading && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Intelligence Brief</CardTitle>
                    {result.aiProvider && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {result.aiProvider === 'ollama' ? <Bot className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                        {result.aiProvider === 'ollama' ? `Local AI (${ollamaModel})` : 'Claude'}
                      </span>
                    )}
                  </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">Background</p>
                      <p>{result.brief.background}</p>
                    </div>
                    <div>
                      <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">Pain Points</p>
                      <ul className="space-y-1">
                        {result.brief.painPoints.map((p, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">Recent Moves</p>
                      <ul className="space-y-1">
                        {result.brief.recentMoves.map((m, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {result.brief.contactProfile && (
                      <div>
                        <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">Contact Profile</p>
                        <p>{result.brief.contactProfile}</p>
                      </div>
                    )}
                    {result.sources.length > 0 && (
                      <div>
                        <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">Sources</p>
                        <ul className="space-y-1">
                          {result.sources.slice(0, 3).map((s, i) => (
                            <li key={i}>
                              <a href={s.url} target="_blank" rel="noopener noreferrer"
                                className="text-primary hover:underline truncate block">{s.title}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Outreach Message</CardTitle>
                    <Button size="sm" variant="ghost" onClick={copyMessage}>
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap bg-muted rounded-md p-3">
                      {result.outreachMessage}
                    </p>
                  </CardContent>
                </Card>

                <Button className="w-full" onClick={saveLead} disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Lead to CRM</>}
                </Button>
              </>
            )}

            {!result && !loading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">Fill in the form and click Research to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
    </div>
  )
}
