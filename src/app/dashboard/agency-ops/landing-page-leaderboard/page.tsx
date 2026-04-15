import { landingPageLeaderboardRows } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPageLeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Landing Page Leaderboard</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Rank pages by conversion performance so the team knows which pages deserve more traffic and which need CRO work.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {landingPageLeaderboardRows.map((row) => (
          <Card key={row.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{row.page}</CardTitle>
                <Badge variant="success">{row.conversionRate}%</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Primary source</p><p className="mt-1 text-sm">{row.primarySource}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Note</p><p className="mt-1 text-sm text-muted-foreground">{row.note}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
