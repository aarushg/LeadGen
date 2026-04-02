'use client'

import { useMemo, useState } from 'react'
import { sharedGrowthRoadmapItems } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  Planned: 'outline',
  'In Progress': 'warning',
  Blocked: 'destructive',
  Complete: 'success',
}

const statusFilters = ['All', 'Planned', 'In Progress', 'Blocked', 'Complete'] as const

export default function SharedRoadmapPage() {
  const [status, setStatus] = useState<(typeof statusFilters)[number]>('All')

  const filteredItems = useMemo(
    () => sharedGrowthRoadmapItems.filter((item) => status === 'All' || item.status === status),
    [status]
  )

  const summary = useMemo(() => {
    const total = filteredItems.length
    const blocked = filteredItems.filter((item) => item.status === 'Blocked').length
    const inProgress = filteredItems.filter((item) => item.status === 'In Progress').length
    return { total, blocked, inProgress }
  }, [filteredItems])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shared Growth Roadmap</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep agencies and clients aligned on what is shipping next, who owns it, and how each milestone connects to growth outcomes.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Visible roadmap items</p><p className="mt-2 text-3xl font-semibold">{summary.total}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">In progress</p><p className="mt-2 text-3xl font-semibold">{summary.inProgress}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Blocked</p><p className="mt-2 text-3xl font-semibold">{summary.blocked}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter roadmap</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {statusFilters.map((item) => (
            <Button
              key={item}
              type="button"
              variant={status === item ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatus(item)}
            >
              {item}
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{item.client}</CardTitle>
              <Badge variant={statusVariant[item.status] ?? 'secondary'}>{item.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quarter</p>
                <p className="mt-1 text-sm">{item.quarter}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Priority</p>
                <p className="mt-1 text-sm">{item.priority}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Owner</p>
                  <p className="mt-1 text-sm">{item.owner}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Success metric</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.successMetric}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
