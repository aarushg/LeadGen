import { db } from '@/lib/db'
import { buildConversionLagAnalysis } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ConversionLagPage() {
  const leads = await db.leads.list()
  const rows = buildConversionLagAnalysis(leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Conversion Lag Analysis by Campaign</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          See which campaigns convert slowly so budget decisions do not punish sources that need a longer runway.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((row) => (
          <Card key={row.campaign}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{row.campaign}</CardTitle>
              <Badge variant={row.averageLagDays >= 20 ? 'warning' : 'success'}>{row.averageLagDays} day lag</Badge>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Leads</p><p className="mt-2 text-2xl font-semibold">{row.leads}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Won</p><p className="mt-2 text-2xl font-semibold">{row.won}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Avg lag</p><p className="mt-2 text-2xl font-semibold">{row.averageLagDays}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
