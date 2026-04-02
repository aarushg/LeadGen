import { db } from '@/lib/db'
import { buildLeadScoringSnapshot, leadScoringRules } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const tierVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  Hot: 'success',
  Warm: 'warning',
  Cold: 'outline',
}

export default async function LeadScoringPage() {
  const leads = await db.leads.list()
  const rows = buildLeadScoringSnapshot(leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lead Scoring Rules Engine</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Prioritize the leads most likely to close using fit, status, revenue, and freshness signals.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader><CardTitle className="text-lg">Scoring rules</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {leadScoringRules.map((rule) => (
              <div key={rule.id} className="rounded-2xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{rule.rule}</p>
                  <Badge variant={rule.points > 0 ? 'success' : 'destructive'}>{rule.points > 0 ? `+${rule.points}` : rule.points}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{rule.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {rows.map((row) => (
            <Card key={row.id}>
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle>{row.company}</CardTitle>
                <Badge variant={tierVariant[row.tier] ?? 'secondary'}>{row.tier}</Badge>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-4">
                <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Score</p><p className="mt-2 text-2xl font-semibold">{row.score}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Channel</p><p className="mt-2 text-sm">{row.channel}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p><p className="mt-2 text-sm">{row.status}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue</p><p className="mt-2 text-sm">${row.estimatedRevenue.toLocaleString()}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
