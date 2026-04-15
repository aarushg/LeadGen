import { offlineConversionImportRows } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function OfflineConversionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Offline Conversion Import Tracking</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Bring offline wins back into reporting so paid optimization can reflect real site visits, deals, and booked revenue.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {offlineConversionImportRows.map((row) => (
          <Card key={row.id}>
            <CardHeader>
              <CardTitle>{row.source}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Matched</p><p className="mt-2 text-2xl font-semibold">{row.matchedConversions}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Match rate</p><p className="mt-2 text-2xl font-semibold">{row.matchRate}%</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue</p><p className="mt-2 text-2xl font-semibold">Rs {row.revenue.toLocaleString('en-IN')}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
