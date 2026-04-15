'use client'

import { useMemo, useState } from 'react'
import { rescueBanners } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RescueBannersPage() {
  const [selectedId, setSelectedId] = useState(rescueBanners[0]?.id ?? '')
  const [traffic, setTraffic] = useState('2200')
  const banner = useMemo(() => rescueBanners.find((item) => item.id === selectedId) ?? rescueBanners[0], [selectedId])
  const recoveries = Math.round((Number.parseInt(traffic, 10) || 0) * 0.025)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">On-Page Rescue Banner System</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Recover distracted visitors with lighter-weight banners that fire before a full exit-intent popup is needed.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader><CardTitle className="text-lg">Banner setup</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {rescueBanners.map((item) => (
                <Button key={item.id} type="button" size="sm" variant={selectedId === item.id ? 'default' : 'outline'} onClick={() => setSelectedId(item.id)}>
                  {item.page}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="traffic">Monthly page visitors</Label>
              <Input id="traffic" type="number" min="0" value={traffic} onChange={(event) => setTraffic(event.target.value)} />
            </div>
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Projected rescues</p>
              <p className="mt-2 text-3xl font-semibold">{recoveries}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>{banner.page}</CardTitle>
            <Badge variant="secondary">{banner.audience}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border bg-amber-50 p-4">
              <p className="text-sm">{banner.message}</p>
              <p className="mt-3 text-sm font-medium">{banner.cta}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trigger</p>
              <p className="mt-1 text-sm">{banner.trigger}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
