import { pageSpeedOpportunities } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PageSpeedOpportunitiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Page Speed Opportunity Scanner</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Highlight speed issues that are likely to affect conversion so teams know where performance work matters most.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {pageSpeedOpportunities.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.page}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Issue</p><p className="mt-1 text-sm">{item.issue}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Expected impact</p><p className="mt-1 text-sm text-muted-foreground">{item.expectedImpact}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
