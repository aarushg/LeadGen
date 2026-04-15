import { heatmapInsights } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HeatmapReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Heatmap Summary and Click-Pattern Review</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Turn click behavior into clear recommendations so the team can optimize pages with more confidence.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {heatmapInsights.map((insight) => (
          <Card key={insight.id}>
            <CardHeader>
              <CardTitle>{insight.page}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Hot zone</p><p className="mt-1 text-sm">{insight.hotZone}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Missed area</p><p className="mt-1 text-sm">{insight.missedArea}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Recommendation</p><p className="mt-1 text-sm text-muted-foreground">{insight.recommendation}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
