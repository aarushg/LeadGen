import { db } from '@/lib/db'
import { buildBudgetReallocationRecommendations } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function BudgetReallocationPage() {
  const leads = await db.leads.list()
  const rows = buildBudgetReallocationRecommendations(leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Budget Reallocation Recommendations</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Show where budget should increase, hold, or pull back based on win rate and revenue outcome by channel.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((row) => (
          <Card key={row.channel}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{row.channel}</CardTitle>
              <Badge variant={row.winRate >= 20 ? 'success' : row.winRate >= 10 ? 'warning' : 'destructive'}>
                {row.winRate}% win rate
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Leads</p><p className="mt-1 text-2xl font-semibold">{row.leads}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue</p><p className="mt-1 text-2xl font-semibold">${row.revenue.toLocaleString()}</p></div>
              </div>
              <p className="text-sm text-muted-foreground">{row.recommendation}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
