import { topicDecaySignals } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TopicDecayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Topic Decay Detector</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Spot pages that are losing momentum before traffic and engagement fall too far.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {topicDecaySignals.map((item) => (
          <Card key={item.id}>
            <CardHeader className="space-y-3">
              <CardTitle>{item.topic}</CardTitle>
              <Badge variant="secondary">{item.trafficChange}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.action}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
