import { db } from '@/lib/db'
import { buildForecastAccuracyReport } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ForecastAccuracyPage() {
  const leads = await db.leads.list()
  const rows = buildForecastAccuracyReport(leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Forecast Accuracy Reporting</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Compare forecasted lead and revenue goals against actual performance so agencies can spot drift earlier.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((row) => (
          <Card key={row.period}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{row.period}</CardTitle>
              <Badge variant={row.revenueVariance >= 0 ? 'success' : 'warning'}>
                {row.revenueVariance >= 0 ? 'On or above plan' : 'Under plan'}
              </Badge>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Lead variance</p>
                <p className="mt-2 text-2xl font-semibold">{row.leadVariance >= 0 ? '+' : ''}{row.leadVariance}</p>
                <p className="mt-1 text-xs text-muted-foreground">{row.actualLeads} actual vs {row.targetLeads} target</p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue variance</p>
                <p className="mt-2 text-2xl font-semibold">${row.revenueVariance.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">${row.actualRevenue.toLocaleString()} actual vs ${row.targetRevenue.toLocaleString()} target</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
