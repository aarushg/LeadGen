import { contentGaps } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContentGapsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Competitor Content Gap Analyzer</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Surface where competitors are winning content attention so the team can fill the highest-value gaps faster.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {contentGaps.map((gap) => (
          <Card key={gap.id}>
            <CardHeader>
              <CardTitle>{gap.competitor}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Topic</p><p className="mt-1 text-sm">{gap.topic}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Opportunity</p><p className="mt-1 text-sm text-muted-foreground">{gap.opportunity}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
