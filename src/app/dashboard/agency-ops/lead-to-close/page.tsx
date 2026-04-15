import { db } from '@/lib/db'
import { buildLeadToCloseInsights } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function LeadToClosePage() {
  const leads = await db.leads.list()
  const insights = buildLeadToCloseInsights(leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lead-to-Close Time Dashboard</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Measure how quickly revenue closes by channel so your team can balance fast wins against longer-cycle opportunities.
        </p>
      </div>

      {insights.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Closed-won leads are needed to generate lead-to-close timing insights.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {insights.map((item) => (
            <Card key={item.channel}>
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle>{item.channel}</CardTitle>
                <Badge variant="secondary">{item.deals} won deals</Badge>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg days to close</p>
                  <p className="mt-2 text-2xl font-semibold">{item.avgDays}</p>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Won deals</p>
                  <p className="mt-2 text-2xl font-semibold">{item.deals}</p>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue</p>
                  <p className="mt-2 text-2xl font-semibold">{formatCurrency(item.revenue)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
