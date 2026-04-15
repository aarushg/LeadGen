import { contentRoiRows } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContentRoiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content ROI Reporting Tied to Pipeline</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Show which guides, market updates, and SEO assets are influencing qualified opportunities and revenue.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {contentRoiRows.map((row) => (
          <Card key={row.id}>
            <CardHeader>
              <CardTitle>{row.asset}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Influenced leads</p><p className="mt-1 text-2xl font-semibold">{row.influencedLeads}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Opportunities</p><p className="mt-1 text-2xl font-semibold">{row.opportunities}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Estimated revenue</p><p className="mt-1 text-2xl font-semibold">Rs {row.estimatedRevenue.toLocaleString('en-IN')}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
