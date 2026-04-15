import { benchmarkAlerts } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BenchmarkAlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Portfolio Benchmark Anomaly Alerts</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Flag accounts that are falling outside the healthy range so teams know where to intervene first.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {benchmarkAlerts.map((alert) => (
          <Card key={alert.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{alert.client}</CardTitle>
                <Badge variant="warning">{alert.metric}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Variance</p><p className="mt-1 text-sm">{alert.variance}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Action</p><p className="mt-1 text-sm text-muted-foreground">{alert.action}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
