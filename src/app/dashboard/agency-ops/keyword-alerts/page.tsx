import { keywordAlerts } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function KeywordAlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Underperforming Keyword Alerts</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Flag wasted spend on poor-fit or low-intent keywords before they drag down paid search efficiency.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {keywordAlerts.map((alert) => (
          <Card key={alert.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{alert.keyword}</CardTitle>
                <Badge variant="warning">{alert.spend}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Campaign</p><p className="mt-1 text-sm">{alert.campaign}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Issue</p><p className="mt-1 text-sm text-muted-foreground">{alert.issue}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
