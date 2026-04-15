import { db } from '@/lib/db'
import { buildExpansionPlaybook } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function ExpansionPlaybookPage() {
  const leads = await db.leads.list()
  const rows = buildExpansionPlaybook(leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expansion Playbook Recommender</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Identify which clients are most ready for an upsell, cross-sell, or channel expansion motion based on pipeline and win patterns.
        </p>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            More lead and company activity is needed to generate expansion recommendations.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((row) => (
            <Card key={row.company}>
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle>{row.company}</CardTitle>
                <Badge variant="secondary">{row.wonCount} wins</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Won deals</p>
                    <p className="mt-2 text-2xl font-semibold">{row.wonCount}</p>
                  </div>
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Qualified opportunities</p>
                    <p className="mt-2 text-2xl font-semibold">{row.qualifiedCount}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recommended motion</p>
                  <p className="mt-1 text-sm text-muted-foreground">{row.recommendedMotion}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
