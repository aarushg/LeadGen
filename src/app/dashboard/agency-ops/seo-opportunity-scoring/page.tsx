import { seoOpportunities } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const intentVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  High: 'success',
  Medium: 'warning',
  Low: 'outline',
}

export default function SeoOpportunityScoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO Opportunity Scoring Model</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Rank organic opportunities by business value so content effort goes toward pages most likely to influence pipeline.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {seoOpportunities.map((opportunity) => (
          <Card key={opportunity.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{opportunity.client}</CardTitle>
                <Badge variant={intentVariant[opportunity.intent] ?? 'secondary'}>{opportunity.intent} intent</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Page</p><p className="mt-1 text-sm">{opportunity.page}</p></div>
              <div className="rounded-2xl border bg-muted/30 p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Opportunity score</p><p className="mt-2 text-3xl font-semibold">{opportunity.score}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Recommended action</p><p className="mt-1 text-sm text-muted-foreground">{opportunity.action}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
