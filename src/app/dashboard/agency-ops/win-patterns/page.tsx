import { winPatterns } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function WinPatternsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Win-Pattern Analysis</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          See which industry, channel, and offer combinations are closing best so the team knows what to scale.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {winPatterns.map((pattern) => (
          <Card key={pattern.id}>
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>{pattern.industry}</CardTitle>
                <Badge variant="secondary">{pattern.channel}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Offer</p><p className="mt-1 text-sm">{pattern.offer}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Observed pattern</p><p className="mt-1 text-sm text-muted-foreground">{pattern.pattern}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
