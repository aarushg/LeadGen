import { revenuePerLeadRows } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RevenuePerLeadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revenue per Lead by Campaign</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Compare campaigns by revenue quality instead of just raw lead volume so budget decisions get smarter.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {revenuePerLeadRows.map((row) => (
          <Card key={row.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{row.campaign}</CardTitle>
                <Badge variant="success">INR {row.revenuePerLead.toLocaleString()}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Leads</p><p className="mt-1 text-sm">{row.leads}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Note</p><p className="mt-1 text-sm text-muted-foreground">{row.note}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
