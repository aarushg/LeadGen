'use client'

import { useMemo, useState } from 'react'
import { schedulingWidgetScenarios } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DynamicSchedulingPage() {
  const [selectedId, setSelectedId] = useState(schedulingWidgetScenarios[0]?.id ?? '')
  const [leadVolume, setLeadVolume] = useState('120')
  const scenario = useMemo(
    () => schedulingWidgetScenarios.find((item) => item.id === selectedId) ?? schedulingWidgetScenarios[0],
    [selectedId]
  )
  const projectedBookings = Math.round((Number.parseInt(leadVolume, 10) || 0) * 0.32)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dynamic Scheduling Widget</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Route different types of leads into the right booking flow so sales calls match buyer intent and urgency.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader><CardTitle className="text-lg">Scheduling planner</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {schedulingWidgetScenarios.map((item) => (
                <Button key={item.id} size="sm" type="button" variant={selectedId === item.id ? 'default' : 'outline'} onClick={() => setSelectedId(item.id)}>
                  {item.audience}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-volume">Monthly qualified visitors</Label>
              <Input id="lead-volume" type="number" min="0" value={leadVolume} onChange={(event) => setLeadVolume(event.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>{scenario.audience}</CardTitle>
            <Badge variant="secondary">{scenario.calendarType}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Routing</p><p className="mt-1 text-sm">{scenario.routing}</p></div>
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Projected bookings</p>
              <p className="mt-2 text-3xl font-semibold">{projectedBookings}</p>
            </div>
            <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Expected outcome</p><p className="mt-1 text-sm text-muted-foreground">{scenario.expectedOutcome}</p></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
