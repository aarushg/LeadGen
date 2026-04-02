import { db } from '@/lib/db'
import { buildChannelMarginInsights } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function ChannelMarginPage() {
  const leads = await db.leads.list()
  const rows = buildChannelMarginInsights(leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Channel Margin Reporting</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Add profitability context to performance reporting so the team can see which channels produce strong margin, not just activity.
        </p>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Add lead revenue data to generate margin reporting.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((row) => (
            <Card key={row.channel}>
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle>{row.channel}</CardTitle>
                <Badge variant={row.margin >= 0 ? 'success' : 'destructive'}>
                  {row.marginRate}% margin
                </Badge>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue</p>
                  <p className="mt-2 text-xl font-semibold">{formatCurrency(row.revenue)}</p>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Estimated cost</p>
                  <p className="mt-2 text-xl font-semibold">{formatCurrency(row.cost)}</p>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Margin</p>
                  <p className="mt-2 text-xl font-semibold">{formatCurrency(row.margin)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
