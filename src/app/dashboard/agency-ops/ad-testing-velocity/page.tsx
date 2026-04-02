import { buildAdTestingVelocity } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AdTestingVelocityPage() {
  const rows = buildAdTestingVelocity()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ad Testing Velocity Tracker</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Measure whether enough new concepts are reaching market each month to keep learning loops healthy across paid accounts.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((row) => (
          <Card key={row.month}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{row.month}</CardTitle>
              <Badge variant={row.launchedTests >= row.target ? 'success' : 'warning'}>
                {row.launchedTests}/{row.target} tests
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Launched tests</p>
                  <p className="mt-2 text-2xl font-semibold">{row.launchedTests}</p>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Target</p>
                  <p className="mt-2 text-2xl font-semibold">{row.target}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{row.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
