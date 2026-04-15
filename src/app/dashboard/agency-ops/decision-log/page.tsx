import { clientDecisionLog } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const impactVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  High: 'destructive',
  Medium: 'warning',
  Low: 'secondary',
}

export default function DecisionLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Decision Log</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep important client choices, scope shifts, and strategic calls in one visible history so the whole team stays aligned.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent account decisions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {clientDecisionLog.map((entry) => (
            <div key={entry.id} className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{entry.client}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{entry.decision}</p>
                </div>
                <Badge variant={impactVariant[entry.impact] ?? 'secondary'}>{entry.impact} impact</Badge>
              </div>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Owner</p>
                  <p className="mt-1">{entry.owner}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</p>
                  <p className="mt-1">{entry.decidedOn}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
