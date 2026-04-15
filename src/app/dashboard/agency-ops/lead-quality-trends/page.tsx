import { leadQualityTrends } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LeadQualityTrendsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lead Quality Trend Reporting</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Track whether high, medium, and low-quality lead mix is improving over time.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {leadQualityTrends.map((row) => (
          <Card key={row.id}>
            <CardHeader>
              <CardTitle>{row.month}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">High</p><p className="mt-2 text-2xl font-semibold">{row.high}%</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Medium</p><p className="mt-2 text-2xl font-semibold">{row.medium}%</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Low</p><p className="mt-2 text-2xl font-semibold">{row.low}%</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
