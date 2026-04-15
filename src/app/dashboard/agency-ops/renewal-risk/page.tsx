import { db } from '@/lib/db'
import { buildRenewalRiskBriefing } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const riskVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  High: 'destructive',
  Medium: 'warning',
  Low: 'success',
}

export default async function RenewalRiskPage() {
  const leads = await db.leads.list()
  const briefing = buildRenewalRiskBriefing(leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Renewal Risk Briefing</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Surface accounts that need proactive attention based on stale activity, weak outcomes, and pipeline softness.
        </p>
      </div>

      {briefing.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Add more company and pipeline activity to generate renewal-risk insights.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {briefing.map((account) => (
            <Card key={account.company}>
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle>{account.company}</CardTitle>
                <Badge variant={riskVariant[account.risk] ?? 'secondary'}>{account.risk} risk</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Tracked leads</p>
                    <p className="mt-2 text-2xl font-semibold">{account.leadCount}</p>
                  </div>
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Won / Lost</p>
                    <p className="mt-2 text-2xl font-semibold">{account.wonCount} / {account.lostCount}</p>
                  </div>
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Days stale</p>
                    <p className="mt-2 text-2xl font-semibold">{account.staleDays}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Why this account is flagged</p>
                  <p className="mt-1 text-sm text-muted-foreground">{account.reason}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
