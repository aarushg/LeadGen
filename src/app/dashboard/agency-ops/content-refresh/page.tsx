import { contentRefreshOpportunities } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContentRefreshPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Refresh Opportunity Finder</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Surface existing pages that could drive more traffic or leads with faster refresh work instead of full rewrites.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {contentRefreshOpportunities.map((opportunity) => (
          <Card key={opportunity.id}>
            <CardHeader>
              <CardTitle>{opportunity.client}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Page</p><p className="mt-1 text-sm">{opportunity.page}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Issue</p><p className="mt-1 text-sm">{opportunity.issue}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Action</p><p className="mt-1 text-sm text-muted-foreground">{opportunity.action}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
