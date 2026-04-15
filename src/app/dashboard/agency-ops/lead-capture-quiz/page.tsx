'use client'

import { useMemo, useState } from 'react'
import { leadCaptureQuizTemplates } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function LeadCaptureQuizPage() {
  const [selectedId, setSelectedId] = useState(leadCaptureQuizTemplates[0]?.id ?? '')
  const [quizName, setQuizName] = useState('Growth qualification quiz')
  const [cta, setCta] = useState('Book your strategy call')
  const [customStep, setCustomStep] = useState('')
  const [customSteps, setCustomSteps] = useState<string[]>([])

  const template = useMemo(
    () => leadCaptureQuizTemplates.find((item) => item.id === selectedId) ?? leadCaptureQuizTemplates[0],
    [selectedId]
  )

  const steps = [...(template?.steps ?? []), ...customSteps]
  const completionRate = Math.min(95, 48 + steps.length * 6)
  const qualificationDepth = Math.min(100, 55 + customSteps.length * 10 + (template?.steps.length ?? 0) * 4)

  function addCustomStep() {
    const normalized = customStep.trim()
    if (!normalized) return
    setCustomSteps((current) => [...current, normalized])
    setCustomStep('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Multi-Step Lead Capture Quiz</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Build qualification-first lead capture flows that ask better questions before sales gets involved.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quiz builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Template</Label>
              <div className="flex flex-wrap gap-2">
                {leadCaptureQuizTemplates.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    variant={selectedId === item.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedId(item.id)}
                  >
                    {item.title}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quiz-name">Quiz name</Label>
              <Input id="quiz-name" value={quizName} onChange={(event) => setQuizName(event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quiz-cta">Final CTA</Label>
              <Input id="quiz-cta" value={cta} onChange={(event) => setCta(event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-step">Add qualification step</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-step"
                  value={customStep}
                  onChange={(event) => setCustomStep(event.target.value)}
                  placeholder="Example: Current monthly ad spend"
                />
                <Button type="button" onClick={addCustomStep}>Add</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Qualification goal</Label>
              <Textarea value={template?.qualificationGoal ?? ''} readOnly className="min-h-[96px]" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Projected completion lift</p>
                <p className="mt-2 text-3xl font-semibold">{completionRate}%</p>
                <p className="mt-1 text-sm text-muted-foreground">More structured quizzes usually outperform long one-shot forms.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Qualification depth</p>
                <p className="mt-2 text-3xl font-semibold">{qualificationDepth}%</p>
                <p className="mt-1 text-sm text-muted-foreground">Use this to judge how much useful sales context the quiz captures.</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>{quizName}</CardTitle>
                <Badge variant="secondary">{template?.audience}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suggested steps</p>
                <div className="mt-3 space-y-2">
                  {steps.map((step, index) => (
                    <div key={`${step}-${index}`} className="flex items-center justify-between rounded-2xl border bg-muted/30 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </div>
                      {index >= (template?.steps.length ?? 0) && <Badge variant="outline">Custom</Badge>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Expected outcome</p>
                <p className="mt-2 text-sm text-emerald-900">{template?.outcome}</p>
                <p className="mt-3 text-sm font-medium">{cta}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
