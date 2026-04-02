'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart3, Activity, Database, RefreshCw } from 'lucide-react'

type ToolAnalytics = {
  toolId: string
  lastUpdated: string
  stateSize: number
  events: number
}

type AnalyticsResponse = {
  tools: ToolAnalytics[]
  summary: {
    trackedTools: number
    totalEvents: number
    lastEventAt: string | null
  }
}

export default function ToolsAnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadAnalytics() {
    setLoading(true)
    try {
      const res = await fetch('/api/tools/analytics')
      const json = (await res.json()) as AnalyticsResponse
      setData(json)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAnalytics()
  }, [])

  const topTools = useMemo(() => (data?.tools ?? []).slice(0, 10), [data])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Tools Library Analytics</h1>
          <p className="text-muted-foreground mt-2">Compare usage and activity across all implemented tools</p>
        </div>
        <Button variant="outline" onClick={loadAnalytics} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Tracked Tools</p>
            <p className="text-2xl font-bold">{data?.summary.trackedTools ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold">{data?.summary.totalEvents ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Last Event</p>
            <p className="text-sm font-semibold">
              {data?.summary.lastEventAt ? new Date(data.summary.lastEventAt).toLocaleString() : 'No events yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top Tools by Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topTools.length === 0 ? (
            <p className="text-sm text-muted-foreground">No analytics yet. Use tools to generate events.</p>
          ) : (
            <div className="space-y-3">
              {topTools.map((tool) => (
                <div key={tool.toolId} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{tool.toolId}</p>
                      <p className="text-xs text-muted-foreground">Updated: {new Date(tool.lastUpdated).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <Activity className="h-3 w-3 mr-1" />
                        {tool.events} events
                      </Badge>
                      <Badge variant="secondary">
                        <Database className="h-3 w-3 mr-1" />
                        size {tool.stateSize}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
