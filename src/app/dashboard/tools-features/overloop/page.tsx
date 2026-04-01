'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Plus, X, Loader, Send } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

interface EmailStep {
  id?: string
  order?: number
  subject: string
  body: string
  delayDays: number
  type: 'email' | 'wait'
}

interface Sequence {
  id: string
  name: string
  description: string
  steps: EmailStep[]
  status: 'draft' | 'active' | 'completed'
}

export default function OverloopPage() {
  const TOOL_ID = 'overloop'
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState<EmailStep[]>([
    { subject: '', body: '', delayDays: 0, type: 'email' },
  ])
  const [editingSequence, setEditingSequence] = useState<Sequence | null>(null)

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ sequences: Sequence[] }>(TOOL_ID)
      if (!cancelled && state?.sequences) {
        setSequences(state.sequences)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { sequences })
  }, [sequences])

  async function handleCreateSequence() {
    if (!name.trim() || steps.length === 0) {
      toast.error('Please enter sequence name and at least one email')
      return
    }

    setLoading(true)
    try {
      const now = new Date().toISOString()
      const sequence: Sequence = {
        id: `seq-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        status: 'draft',
        steps: steps
          .filter(s => s.subject.trim())
          .map((step, idx) => ({
            ...step,
            id: `step-${Date.now()}-${idx}`,
            order: idx + 1,
          })),
      }

      setSequences([...sequences, sequence])
      setName('')
      setDescription('')
      setSteps([{ subject: '', body: '', delayDays: 0, type: 'email' }])
      void trackToolEvent(TOOL_ID, 'sequence_created')
      toast.success('Sequence created successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create sequence')
    } finally {
      setLoading(false)
    }
  }

  function addStep() {
    setSteps([...steps, { subject: '', body: '', delayDays: 0, type: 'email' }])
  }

  function removeStep(idx: number) {
    setSteps(steps.filter((_, i) => i !== idx))
  }

  function updateStep(idx: number, updates: Partial<EmailStep>) {
    const newSteps = [...steps]
    newSteps[idx] = { ...newSteps[idx], ...updates }
    setSteps(newSteps)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Overloop - Email Sequences</h1>
        <p className="text-muted-foreground mt-2">Create and manage automated email sequences for outreach</p>
      </div>

      {/* Create Sequence */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Sequence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="seq-name">Sequence Name *</Label>
              <Input
                id="seq-name"
                placeholder="e.g., Initial Outreach"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="seq-desc">Description</Label>
              <Input
                id="seq-desc"
                placeholder="e.g., 5-step cold email sequence"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Email Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Email Steps</h3>
              <Button variant="outline" size="sm" onClick={addStep}>
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>

            {steps.map((step, idx) => (
              <Card key={idx} className="bg-muted/50">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Email {idx + 1}</p>
                    {steps.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(idx)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs">Delay (days)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={step.delayDays}
                      onChange={e => updateStep(idx, { delayDays: parseInt(e.target.value) })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Subject</Label>
                    <Input
                      value={step.subject}
                      onChange={e => updateStep(idx, { subject: e.target.value })}
                      placeholder="Email subject line"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Message Body</Label>
                    <Textarea
                      value={step.body}
                      onChange={e => updateStep(idx, { body: e.target.value })}
                      placeholder="Write your email message here..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button onClick={handleCreateSequence} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Create Sequence
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Sequences List */}
      {sequences.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Sequences ({sequences.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sequences.map(seq => (
                <div key={seq.id} className="border rounded-lg p-4 hover:bg-muted/50 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{seq.name}</h4>
                        <Badge variant={seq.status === 'active' ? 'default' : 'secondary'}>
                          {seq.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{seq.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{seq.steps.length} emails</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {sequences.length === 0 && name === '' && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <p className="text-muted-foreground">No sequences created yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create your first email sequence above</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
