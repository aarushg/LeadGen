import { db } from '@/lib/db'
import { buildCustomerAdvocacyScores } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdvocacyScoreWorkbench } from './advocacy-score-workbench'

export default async function AdvocacyScorePage() {
  const leads = await db.leads.list()
  const rows = buildCustomerAdvocacyScores(leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customer Advocacy Score</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Identify which accounts are most ready for referral asks, testimonials, and review campaigns based on win history and channel signals.
        </p>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            More closed-won or qualified lead data is needed before advocacy scoring becomes meaningful.
          </CardContent>
        </Card>
      ) : (
        <AdvocacyScoreWorkbench rows={rows} />
      )}
    </div>
  )
}
