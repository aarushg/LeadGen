import { expansionOpportunities } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ExpansionOpportunitiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expansion and Upsell Opportunity Tracking</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          See which clients are ready for broader service adoption based on current delivery performance and needs.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {expansionOpportunities.map((row) => (
          <Card key={row.id}>
            <CardHeader>
              <CardTitle>{row.client}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Current service</p><p className="mt-1 text-sm">{row.currentService}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Expansion path</p><p className="mt-1 text-sm">{row.expansionPath}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Reason</p><p className="mt-1 text-sm text-muted-foreground">{row.reason}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
