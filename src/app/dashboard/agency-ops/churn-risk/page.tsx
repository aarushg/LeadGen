import { churnRiskItems } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const riskVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  High: 'destructive',
  Medium: 'warning',
  Low: 'success',
}

export default function ChurnRiskPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Churn-Risk Dashboard for Subscription Clients</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Spot at-risk accounts early so teams can intervene before renewal discussions turn into churn conversations.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {churnRiskItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{item.client}</CardTitle>
                <Badge variant={riskVariant[item.risk] ?? 'secondary'}>{item.risk}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Signal</p><p className="mt-1 text-sm">{item.signal}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Recommendation</p><p className="mt-1 text-sm text-muted-foreground">{item.recommendation}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
