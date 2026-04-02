import { db } from '@/lib/db'
import { buildClientBenchmarkScorecards } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BenchmarkScorecardsWorkbench } from './benchmark-scorecards-workbench'

export default async function BenchmarkScorecardsPage() {
  const leads = await db.leads.list()
  const scorecards = buildClientBenchmarkScorecards(leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Benchmark Scorecards</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Show each client how qualification, win rate, and revenue per lead compare against the rest of the portfolio.
        </p>
      </div>

      {scorecards.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            More lead data is needed before benchmark scorecards can be generated.
          </CardContent>
        </Card>
      ) : (
        <BenchmarkScorecardsWorkbench scorecards={scorecards} />
      )}
    </div>
  )
}
