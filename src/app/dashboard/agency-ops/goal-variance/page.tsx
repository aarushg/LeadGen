import { goalVarianceAlerts } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GoalVariancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Goal Variance Alerts</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep KPI misses visible before the reporting cycle ends so the team can intervene earlier.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {goalVarianceAlerts.map((alert) => (
          <Card key={alert.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{alert.client}</CardTitle>
                <Badge variant="warning">{alert.metric}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Target</p><p className="mt-1 text-sm">{alert.target}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Actual</p><p className="mt-1 text-sm">{alert.actual}</p></div>
              </div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Action</p><p className="mt-1 text-sm text-muted-foreground">{alert.action}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
