import { audienceOverlapInsights } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AudienceOverlapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audience Overlap Analyzer</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Spot audience cannibalization across campaigns so paid media budget is not wasted on duplicated reach.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {audienceOverlapInsights.map((insight) => (
          <Card key={insight.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{insight.audienceA}</CardTitle>
                <Badge variant={insight.overlapRate >= 35 ? 'warning' : 'secondary'}>{insight.overlapRate}% overlap</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Compared against</p><p className="mt-1 text-sm">{insight.audienceB}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Recommended action</p><p className="mt-1 text-sm text-muted-foreground">{insight.action}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
