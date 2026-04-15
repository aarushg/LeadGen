import { salesVelocityBenchmarks } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SalesVelocityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Velocity Benchmark Board</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Compare how quickly opportunities move by segment so the team can spot where sales cycles are slowing down.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {salesVelocityBenchmarks.map((row) => (
          <Card key={row.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{row.segment}</CardTitle>
                <Badge variant="secondary">{row.averageDays} days</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{row.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
