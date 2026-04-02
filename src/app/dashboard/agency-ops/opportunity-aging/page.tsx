import { opportunityAgingRows } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function OpportunityAgingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Opportunity Aging Heatmap</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep pipeline decay visible by showing which deal stages are drifting beyond healthy timing windows.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {opportunityAgingRows.map((row) => (
          <Card key={row.id}>
            <CardHeader>
              <CardTitle>{row.stage}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Healthy</p><p className="mt-2 text-2xl font-semibold">{row.healthyDays}d</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Aging</p><p className="mt-2 text-2xl font-semibold">{row.agingDays}d</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">At risk</p><p className="mt-2 text-2xl font-semibold">{row.atRiskCount}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
