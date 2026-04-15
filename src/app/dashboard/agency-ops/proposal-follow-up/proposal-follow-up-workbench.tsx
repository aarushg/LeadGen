'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ProposalFollowUpSequence } from '@/lib/agency-ops-data'

type ProposalFollowUpWorkbenchProps = {
  insight: {
    total: number
    active: number
    wonFromProposals: number
    closeRate: number
    staleEstimate: number
  }
  sequences: ProposalFollowUpSequence[]
}

export function ProposalFollowUpWorkbench({ insight, sequences }: ProposalFollowUpWorkbenchProps) {
  const [selectedId, setSelectedId] = useState(sequences[0]?.id ?? '')
  const [averageDealValue, setAverageDealValue] = useState('8500')
  const [staleRecoveryRate, setStaleRecoveryRate] = useState('20')

  const selected = useMemo(
    () => sequences.find((sequence) => sequence.id === selectedId) ?? sequences[0],
    [selectedId, sequences]
  )

  const dealValue = Number.parseInt(averageDealValue, 10) || 0
  const recoveryRate = (Number.parseFloat(staleRecoveryRate) || 0) / 100
  const recoveredDeals = Math.round(insight.staleEstimate * recoveryRate)
  const recoveredRevenue = recoveredDeals * dealValue

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Proposals</p><p className="mt-2 text-2xl font-semibold">{insight.total}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Active</p><p className="mt-2 text-2xl font-semibold">{insight.active}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Won</p><p className="mt-2 text-2xl font-semibold">{insight.wonFromProposals}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Close rate</p><p className="mt-2 text-2xl font-semibold">{insight.closeRate}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Likely stale</p><p className="mt-2 text-2xl font-semibold">{insight.staleEstimate}</p></CardContent></Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sequence planner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {sequences.map((sequence) => (
                <Button
                  key={sequence.id}
                  type="button"
                  variant={selectedId === sequence.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedId(sequence.id)}
                >
                  {sequence.sequence}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="average-deal-value">Average deal value</Label>
              <Input
                id="average-deal-value"
                type="number"
                min="0"
                value={averageDealValue}
                onChange={(event) => setAverageDealValue(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stale-recovery-rate">Expected stale recovery rate (%)</Label>
              <Input
                id="stale-recovery-rate"
                type="number"
                min="0"
                value={staleRecoveryRate}
                onChange={(event) => setStaleRecoveryRate(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Recovered deals</p>
                <p className="mt-2 text-3xl font-semibold">{recoveredDeals}</p>
                <p className="mt-1 text-sm text-muted-foreground">If this sequence reactivates a share of stale proposals.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Recovered revenue</p>
                <p className="mt-2 text-3xl font-semibold">${recoveredRevenue.toLocaleString()}</p>
                <p className="mt-1 text-sm text-muted-foreground">A quick estimate of upside from consistent follow-up.</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{selected?.sequence}</CardTitle>
                <Badge variant="secondary">{selected?.timing}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trigger</p>
                <p className="mt-1 text-sm">{selected?.trigger}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Channel mix</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected?.channelMix.map((step) => (
                    <Badge key={step} variant="outline">{step}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Goal</p>
                <p className="mt-1 text-sm text-muted-foreground">{selected?.goal}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
