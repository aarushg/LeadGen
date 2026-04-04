'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Printer, Bot, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const schema = z.object({
  clientName: z.string().min(1, 'Required'),
  clientCompany: z.string().min(1, 'Required'),
  clientEmail: z.string().email().optional().or(z.literal('')),
  projectType: z.string().min(1, 'Required'),
  projectGoals: z.string().min(10, 'Please describe the project goals'),
  budgetRange: z.string().min(1, 'Required'),
  timelineWeeks: z.string().min(1, 'Required'),
  additionalContext: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface ProposalContent {
  executiveSummary: string
  scopeOfWork: string[]
  deliverables: string[]
  timeline: Array<{ week: string; milestone: string }>
  pricing: Array<{ item: string; price: string }>
  terms: string
  callToAction: string
}

export default function NewProposalPage() {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [proposal, setProposal] = useState<ProposalContent | null>(null)
  const [formSnapshot, setFormSnapshot] = useState<FormData | null>(null)
  const [aiProvider, setAiProvider] = useState<'claude' | 'ollama'>('claude')
  const [ollamaModels, setOllamaModels] = useState<string[]>([])
  const [ollamaModel, setOllamaModel] = useState('')
  const [usedProvider, setUsedProvider] = useState('')

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

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setGenerating(true)
    setProposal(null)
    setFormSnapshot(data)
    try {
      const res = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, aiProvider, ollamaModel }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Generation failed')
      }
      const { content, aiProvider: ap } = await res.json()
      setProposal(content)
      setUsedProvider(ap ?? aiProvider)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate proposal')
    } finally {
      setGenerating(false)
    }
  }

  async function saveProposal() {
    if (!proposal || !formSnapshot) return
    setSaving(true)
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: formSnapshot.clientName,
          client_company: formSnapshot.clientCompany,
          client_email: formSnapshot.clientEmail || null,
          project_type: formSnapshot.projectType,
          project_goals: formSnapshot.projectGoals,
          budget_range: formSnapshot.budgetRange,
          additional_context: formSnapshot.additionalContext || null,
          content: proposal,
          status: 'draft',
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast.success('Proposal saved')
      router.push('/proposals')
    } catch {
      toast.error('Failed to save proposal')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold">New Proposal</h1>
          <p className="text-muted-foreground">Fill in the client details to generate a complete proposal</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name *</Label>
                    <Input id="clientName" {...register('clientName')} placeholder="John Smith" />
                    {errors.clientName && <p className="text-xs text-destructive">{errors.clientName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientCompany">Company *</Label>
                    <Input id="clientCompany" {...register('clientCompany')} placeholder="Acme Corp" />
                    {errors.clientCompany && <p className="text-xs text-destructive">{errors.clientCompany.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input id="clientEmail" type="email" {...register('clientEmail')} placeholder="john@acme.com" />
                </div>

                <div className="space-y-2">
                  <Label>Project Type *</Label>
                  <Select onValueChange={v => setValue('projectType', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Design">Web Design</SelectItem>
                      <SelectItem value="SEO">SEO</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Paid Ads">Paid Ads</SelectItem>
                      <SelectItem value="Full Marketing">Full Marketing</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.projectType && <p className="text-xs text-destructive">{errors.projectType.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectGoals">Project Goals *</Label>
                  <Textarea
                    id="projectGoals"
                    {...register('projectGoals')}
                    placeholder="What does the client want to achieve? Be specific."
                    rows={3}
                  />
                  {errors.projectGoals && <p className="text-xs text-destructive">{errors.projectGoals.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Budget Range *</Label>
                    <Select onValueChange={v => setValue('budgetRange', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under $1,000">Under $1,000</SelectItem>
                        <SelectItem value="$1,000–$5,000">$1,000–$5,000</SelectItem>
                        <SelectItem value="$5,000–$10,000">$5,000–$10,000</SelectItem>
                        <SelectItem value="$10,000–$25,000">$10,000–$25,000</SelectItem>
                        <SelectItem value="$25,000+">$25,000+</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.budgetRange && <p className="text-xs text-destructive">{errors.budgetRange.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Timeline *</Label>
                    <Select onValueChange={v => setValue('timelineWeeks', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2 weeks">2 weeks</SelectItem>
                        <SelectItem value="1 month">1 month</SelectItem>
                        <SelectItem value="2 months">2 months</SelectItem>
                        <SelectItem value="3 months">3 months</SelectItem>
                        <SelectItem value="6 months">6 months</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.timelineWeeks && <p className="text-xs text-destructive">{errors.timelineWeeks.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalContext">Additional Context</Label>
                  <Textarea
                    id="additionalContext"
                    {...register('additionalContext')}
                    placeholder="Any other relevant details..."
                    rows={2}
                  />
                </div>

                {/* AI Provider */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">AI Engine</label>
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

                <Button type="submit" className="w-full" disabled={generating}>
                  {generating ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                  ) : 'Generate Proposal'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview */}
          <div>
            {generating && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                  <p className="font-medium">Generating proposal...</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {aiProvider === 'ollama' ? `Local AI (${ollamaModel}) is writing your proposal` : 'Claude is writing your proposal'}
                  </p>
                </CardContent>
              </Card>
            )}

            {proposal && !generating && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-base">Proposal Preview</CardTitle>
                    <div className="flex items-center gap-2">
                      {usedProvider && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {usedProvider === 'ollama' ? <Bot className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                          {usedProvider === 'ollama' ? `Local AI (${ollamaModel})` : 'Claude'}
                        </span>
                      )}
                      <Button size="sm" variant="outline" onClick={() => window.print()}>
                        <Printer className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 text-sm">
                    <div>
                      <h3 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">Executive Summary</h3>
                      <p>{proposal.executiveSummary}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">Scope of Work</h3>
                      <ul className="space-y-1">
                        {proposal.scopeOfWork.map((item, i) => (
                          <li key={i} className="flex gap-2"><span className="text-primary">•</span>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">Deliverables</h3>
                      <ul className="space-y-1">
                        {proposal.deliverables.map((item, i) => (
                          <li key={i} className="flex gap-2"><span className="text-primary">✓</span>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">Timeline</h3>
                      <div className="space-y-2">
                        {proposal.timeline.map((t, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="font-medium text-primary shrink-0">{t.week}</span>
                            <span>{t.milestone}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">Investment</h3>
                      <div className="space-y-1">
                        {proposal.pricing.map((p, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{p.item}</span>
                            <span className="font-medium">{p.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-2">Terms</h3>
                      <p className="text-muted-foreground">{proposal.terms}</p>
                    </div>
                    <div className="rounded-md bg-primary/5 border border-primary/20 p-3">
                      <p className="font-medium text-primary">{proposal.callToAction}</p>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full" onClick={saveProposal} disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Proposal</>}
                </Button>
              </div>
            )}

            {!proposal && !generating && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                    <span className="text-lg">📄</span>
                  </div>
                  <p className="text-muted-foreground">Your generated proposal will appear here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
    </div>
  )
}
