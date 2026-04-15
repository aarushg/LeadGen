import { db } from '@/lib/db'
import { buildPipelineSlaSnapshot } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function PipelineSlaPage() {
  const leads = await db.leads.list()
  const rows = buildPipelineSlaSnapshot(leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pipeline SLA Tracking</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep response-time accountability visible so new and qualified leads do not sit untouched too long.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((row) => (
          <Card key={row.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{row.company}</CardTitle>
              <Badge variant={row.breached ? 'destructive' : 'success'}>
                {row.breached ? 'Breached' : 'Within SLA'}
              </Badge>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p><p className="mt-1 text-sm">{row.status}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Hours waiting</p><p className="mt-1 text-2xl font-semibold">{row.hoursSinceUpdate}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">SLA</p><p className="mt-1 text-sm">{row.slaHours}h target</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
