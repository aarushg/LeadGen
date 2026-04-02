'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Scorecard = {
  company: string
  leads: number
  qualificationRate: number
  winRate: number
  revenuePerLead: number
  qualificationDelta: number
  winRateDelta: number
  revenueDelta: number
}

function formatDelta(value: number) {
  if (value > 0) return `+${value}`
  return `${value}`
}

const sortOptions = ['Revenue per lead', 'Win rate', 'Qualification rate'] as const

export function BenchmarkScorecardsWorkbench({ scorecards }: { scorecards: Scorecard[] }) {
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]>('Revenue per lead')
  const [minimumLeads, setMinimumLeads] = useState(1)

  const filtered = useMemo(() => {
    const rows = scorecards.filter((scorecard) => scorecard.leads >= minimumLeads)

    return [...rows].sort((a, b) => {
      if (sortBy === 'Win rate') return b.winRate - a.winRate || b.revenuePerLead - a.revenuePerLead
      if (sortBy === 'Qualification rate') return b.qualificationRate - a.qualificationRate || b.winRate - a.winRate
      return b.revenuePerLead - a.revenuePerLead || b.winRate - a.winRate
    })
  }, [minimumLeads, scorecards, sortBy])

  const topPerformer = filtered[0]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Benchmark controls</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {sortOptions.map((option) => (
            <Button
              key={option}
              type="button"
              variant={sortBy === option ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy(option)}
            >
              {option}
            </Button>
          ))}
          {[1, 2, 3].map((count) => (
            <Button
              key={count}
              type="button"
              variant={minimumLeads === count ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setMinimumLeads(count)}
            >
              {count}+ leads
            </Button>
          ))}
        </CardContent>
      </Card>

      {topPerformer && (
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Top performer</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-2xl font-semibold">{topPerformer.company}</p>
              <Badge variant="secondary">{sortBy}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Leading account in the current view with {topPerformer.leads} tracked leads and ${topPerformer.revenuePerLead.toLocaleString()} revenue per lead.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((scorecard) => (
          <Card key={scorecard.company}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{scorecard.company}</CardTitle>
              <Badge variant="secondary">{scorecard.leads} leads</Badge>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Qualification</p>
                <p className="mt-2 text-2xl font-semibold">{scorecard.qualificationRate}%</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDelta(scorecard.qualificationDelta)} vs avg</p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Win rate</p>
                <p className="mt-2 text-2xl font-semibold">{scorecard.winRate}%</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDelta(scorecard.winRateDelta)} vs avg</p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue / lead</p>
                <p className="mt-2 text-2xl font-semibold">${scorecard.revenuePerLead.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">${formatDelta(scorecard.revenueDelta)} vs avg</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
