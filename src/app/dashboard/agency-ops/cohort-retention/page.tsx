import { db } from '@/lib/db'
import { buildCohortRetentionReport } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function CohortRetentionPage() {
  const leads = await db.leads.list()
  const rows = buildCohortRetentionReport(leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Cohort Retention Reporting</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Compare how client cohorts perform over time so retention trends are easier to spot by start month and engagement depth.
        </p>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            More client activity is needed to generate cohort retention insights.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((row) => (
            <Card key={row.cohort}>
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle>Cohort {row.cohort}</CardTitle>
                <Badge variant="secondary">{row.retentionRate}% retained</Badge>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Companies</p>
                  <p className="mt-2 text-2xl font-semibold">{row.companies}</p>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Active</p>
                  <p className="mt-2 text-2xl font-semibold">{row.active}</p>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Won deals</p>
                  <p className="mt-2 text-2xl font-semibold">{row.won}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
