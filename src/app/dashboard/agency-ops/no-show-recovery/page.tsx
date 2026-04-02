import { noShowRecoveryFlows } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NoShowRecoveryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">No-Show Recovery Automations</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Recover booked meetings after a no-show with sequences designed to save momentum without sounding pushy.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {noShowRecoveryFlows.map((flow) => (
          <Card key={flow.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{flow.trigger}</CardTitle>
                <Badge variant="secondary">Recovery</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {flow.sequence.map((step) => (
                  <Badge key={step} variant="outline">{step}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{flow.goal}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
