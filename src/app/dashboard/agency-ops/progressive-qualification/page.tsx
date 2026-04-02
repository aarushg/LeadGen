'use client'

import { useMemo, useState } from 'react'
import { qualificationFormTemplates } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProgressiveQualificationPage() {
  const [selectedId, setSelectedId] = useState(qualificationFormTemplates[0]?.id ?? '')
  const [visibleFields, setVisibleFields] = useState('3')
  const template = useMemo(
    () => qualificationFormTemplates.find((item) => item.id === selectedId) ?? qualificationFormTemplates[0],
    [selectedId]
  )
  const visibleCount = Math.max(1, Number.parseInt(visibleFields, 10) || 1)
  const previewFields = template.fields.slice(0, visibleCount)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Progressive Lead Qualification Forms</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Stage form fields based on intent so agencies can collect better qualification data without killing completion rates.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader><CardTitle className="text-lg">Form planner</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {qualificationFormTemplates.map((item) => (
                <Button key={item.id} type="button" size="sm" variant={selectedId === item.id ? 'default' : 'outline'} onClick={() => setSelectedId(item.id)}>
                  {item.title}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="visible-fields">Fields shown before branching</Label>
              <Input id="visible-fields" type="number" min="1" max={String(template.fields.length)} value={visibleFields} onChange={(event) => setVisibleFields(event.target.value)} />
            </div>
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Logic</p>
              <p className="mt-2 text-sm">{template.logic}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>{template.title}</CardTitle>
            <Badge variant="secondary">{template.audience}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Visible first-step fields</p>
              <div className="mt-3 space-y-2">
                {previewFields.map((field, index) => (
                  <div key={field} className="rounded-2xl border px-4 py-3 text-sm">
                    {index + 1}. {field}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Expected lift</p>
              <p className="mt-1 text-sm text-muted-foreground">{template.expectedLift}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
