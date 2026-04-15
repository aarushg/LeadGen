import { messageMatchScores } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MessageMatchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Landing Page to Ad-Message Match Scoring</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Spot where ad promise and landing page experience are drifting apart so paid traffic converts more consistently.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {messageMatchScores.map((row) => (
          <Card key={row.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{row.campaign}</CardTitle>
                <Badge variant={row.score >= 80 ? 'success' : row.score >= 65 ? 'warning' : 'destructive'}>{row.score}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Landing page</p><p className="mt-1 text-sm">{row.landingPage}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Gap</p><p className="mt-1 text-sm text-muted-foreground">{row.gap}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
