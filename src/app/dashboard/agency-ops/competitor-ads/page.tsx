import { competitorAdSignals } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function CompetitorAdsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Competitor Ad Library Tracker</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep a running view of competitor messaging, offers, and positioning shifts so your paid media strategy reacts
          faster to the market.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {competitorAdSignals.map((signal) => (
          <Card key={signal.id}>
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>{signal.competitor}</CardTitle>
                <Badge variant="secondary">{signal.channel}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Creative angle</p>
                <p className="mt-1 text-sm">{signal.angle}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Offer observed</p>
                <p className="mt-1 text-sm">{signal.offer}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suggested response</p>
                <p className="mt-1 text-sm text-muted-foreground">{signal.suggestedResponse}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
