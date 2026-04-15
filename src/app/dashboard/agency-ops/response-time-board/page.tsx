import { responseTimeRows } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResponseTimeBoardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Response-Time Performance Board</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Track first-response speed across lead sources so high-intent inquiries do not cool off before sales reaches out.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {responseTimeRows.map((row) => (
          <Card key={row.id}>
            <CardHeader>
              <CardTitle>{row.channel}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Avg. minutes</p><p className="mt-2 text-2xl font-semibold">{row.avgMinutes}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">SLA target</p><p className="mt-2 text-2xl font-semibold">{row.slaTargetMinutes}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Missed rate</p><p className="mt-2 text-2xl font-semibold">{row.missedRate}%</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
