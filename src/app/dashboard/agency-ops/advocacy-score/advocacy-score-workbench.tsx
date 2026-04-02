'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type AdvocacyRow = {
  company: string
  score: number
  tier: string
  won: number
  referrals: number
  qualified: number
  avgRevenue: number
  play: string
}

const tierVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  High: 'success',
  Medium: 'warning',
  Low: 'outline',
}

const tiers = ['All', 'High', 'Medium', 'Low'] as const

export function AdvocacyScoreWorkbench({ rows }: { rows: AdvocacyRow[] }) {
  const [selectedTier, setSelectedTier] = useState<(typeof tiers)[number]>('All')

  const filtered = useMemo(
    () => rows.filter((row) => selectedTier === 'All' || row.tier === selectedTier),
    [rows, selectedTier]
  )

  const summary = useMemo(() => {
    return {
      high: filtered.filter((row) => row.tier === 'High').length,
      medium: filtered.filter((row) => row.tier === 'Medium').length,
      low: filtered.filter((row) => row.tier === 'Low').length,
    }
  }, [filtered])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Advocacy filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {tiers.map((tier) => (
            <Button
              key={tier}
              type="button"
              variant={selectedTier === tier ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTier(tier)}
            >
              {tier}
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">High advocacy</p><p className="mt-2 text-3xl font-semibold">{summary.high}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Medium advocacy</p><p className="mt-2 text-3xl font-semibold">{summary.medium}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Low advocacy</p><p className="mt-2 text-3xl font-semibold">{summary.low}</p></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((row) => (
          <Card key={row.company}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{row.company}</CardTitle>
              <Badge variant={tierVariant[row.tier] ?? 'secondary'}>{row.tier} advocacy</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Score</p>
                  <p className="mt-2 text-2xl font-semibold">{row.score}</p>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Won</p>
                  <p className="mt-2 text-2xl font-semibold">{row.won}</p>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Referrals</p>
                  <p className="mt-2 text-2xl font-semibold">{row.referrals}</p>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg revenue</p>
                  <p className="mt-2 text-2xl font-semibold">${row.avgRevenue.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recommended play</p>
                <p className="mt-1 text-sm text-muted-foreground">{row.play}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
