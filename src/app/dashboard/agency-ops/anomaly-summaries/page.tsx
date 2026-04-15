import { anomalySummaries } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnomalySummariesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client-Ready Anomaly Summary Generator</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Turn sudden performance changes into simple explanations clients can understand quickly.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {anomalySummaries.map((item) => (
          <Card key={item.id}>
            <CardHeader className="space-y-3">
              <CardTitle>{item.account}</CardTitle>
              <Badge variant="secondary">{item.change}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.narrative}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
