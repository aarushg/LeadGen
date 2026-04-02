'use client'

import { useMemo, useState } from 'react'
import { offerTestScenarios } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function OfferTestingPage() {
  const [selectedId, setSelectedId] = useState(offerTestScenarios[0]?.id ?? '')
  const [baseline, setBaseline] = useState('11')
  const [lift, setLift] = useState('14')
  const scenario = useMemo(() => offerTestScenarios.find((item) => item.id === selectedId) ?? offerTestScenarios[0], [selectedId])
  const winnerRate = ((Number.parseFloat(baseline) || 0) * (1 + (Number.parseFloat(lift) || 0) / 100)).toFixed(1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Offer Testing Dashboard</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Compare hooks, guarantees, audits, and packaging angles so agencies can see which offer framing wins the right buyers.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader><CardTitle className="text-lg">Test controls</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {offerTestScenarios.map((item) => (
                <Button key={item.id} type="button" size="sm" variant={selectedId === item.id ? 'default' : 'outline'} onClick={() => setSelectedId(item.id)}>
                  {item.client}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="baseline-rate">Baseline conversion rate (%)</Label>
              <Input id="baseline-rate" type="number" min="0" value={baseline} onChange={(event) => setBaseline(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected-lift">Expected winner lift (%)</Label>
              <Input id="expected-lift" type="number" min="0" value={lift} onChange={(event) => setLift(event.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>{scenario.experiment}</CardTitle>
            <Badge variant="secondary">{scenario.targetMetric}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {scenario.variants.map((variant) => (
                <Badge key={variant} variant="outline">{variant}</Badge>
              ))}
            </div>
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Projected winner rate</p>
              <p className="mt-2 text-3xl font-semibold">{winnerRate}%</p>
            </div>
            <p className="text-sm text-muted-foreground">{scenario.note}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
