import { searchQueryRevenueMap } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SearchQueryRevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Query Revenue Map</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Connect search demand to downstream revenue so SEO and paid search can be judged by business value.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {searchQueryRevenueMap.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.query}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue</p><p className="mt-1 text-2xl font-semibold">Rs {item.revenue.toLocaleString('en-IN')}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Confidence</p><p className="mt-1 text-sm text-muted-foreground">{item.confidence}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
