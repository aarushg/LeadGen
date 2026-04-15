'use client'

import { useMemo, useState } from 'react'
import { pricingSensitivityTests } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PricingSensitivityPage() {
  const [selectedId, setSelectedId] = useState(pricingSensitivityTests[0]?.id ?? '')
  const [baselineRate, setBaselineRate] = useState('12')
  const [variantLift, setVariantLift] = useState('18')
  const [monthlyVolume, setMonthlyVolume] = useState('150')

  const test = useMemo(
    () => pricingSensitivityTests.find((item) => item.id === selectedId) ?? pricingSensitivityTests[0],
    [selectedId]
  )

  const baseRate = (Number.parseFloat(baselineRate) || 0) / 100
  const lift = (Number.parseFloat(variantLift) || 0) / 100
  const volume = Number.parseInt(monthlyVolume, 10) || 0
  const baselineConversions = Math.round(volume * baseRate)
  const projectedConversions = Math.round(volume * baseRate * (1 + lift))
  const incrementalWins = Math.max(0, projectedConversions - baselineConversions)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pricing Sensitivity Tests</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Compare pricing presentation, packaging, and offer framing so agencies can improve conversion quality without defaulting to discounts.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scenario planner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {pricingSensitivityTests.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant={selectedId === item.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedId(item.id)}
                >
                  {item.client}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseline-rate">Current conversion rate (%)</Label>
              <Input id="baseline-rate" type="number" min="0" value={baselineRate} onChange={(event) => setBaselineRate(event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variant-lift">Expected lift from better pricing presentation (%)</Label>
              <Input id="variant-lift" type="number" min="0" value={variantLift} onChange={(event) => setVariantLift(event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly-volume">Monthly sessions or visitors</Label>
              <Input id="monthly-volume" type="number" min="0" value={monthlyVolume} onChange={(event) => setMonthlyVolume(event.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Baseline conversions</p><p className="mt-2 text-3xl font-semibold">{baselineConversions}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Projected conversions</p><p className="mt-2 text-3xl font-semibold">{projectedConversions}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Incremental wins</p><p className="mt-2 text-3xl font-semibold">{incrementalWins}</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{test?.client}</CardTitle>
                <Badge variant="secondary">{test?.successMetric}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Audience</p>
                <p className="mt-1 text-sm">{test?.audience}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Test focus</p>
                <p className="mt-1 text-sm">{test?.testFocus}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Variants</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {test?.variants.map((variant) => (
                    <Badge key={variant} variant="outline">{variant}</Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Recommended read</p>
                <p className="mt-2 text-sm text-amber-900">{test?.recommendedRead}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
