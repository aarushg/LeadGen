import { lostDealReasons } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LostDealAnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lost-Deal Reason Analysis</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Surface why opportunities are being lost so marketing, sales, and offer strategy can respond to the real blockers.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {lostDealReasons.map((reason) => (
          <Card key={reason.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{reason.reason}</CardTitle>
              <Badge variant="warning">{reason.count} deals</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{reason.recommendation}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
