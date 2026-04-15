import { strategyRecaps } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StrategyRecapsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Monthly Strategy Recap Generator</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Package what changed, what won, and what should happen next into a cleaner monthly strategic update for clients.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {strategyRecaps.map((recap) => (
          <Card key={recap.id}>
            <CardHeader>
              <CardTitle>{recap.client}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Recap</p><p className="mt-1 text-sm">{recap.recapTitle}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Wins</p><p className="mt-1 text-sm">{recap.wins}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Next priority</p><p className="mt-1 text-sm text-muted-foreground">{recap.nextPriority}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
