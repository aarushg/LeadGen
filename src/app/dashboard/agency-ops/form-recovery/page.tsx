import { formRecoveryFlows } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FormRecoveryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Form Abandonment Recovery Workflows</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Recover incomplete submissions with lighter follow-up steps before the lead disappears completely.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {formRecoveryFlows.map((flow) => (
          <Card key={flow.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{flow.trigger}</CardTitle>
                <Badge variant="secondary">{flow.delay}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Recovery step</p><p className="mt-1 text-sm">{flow.recoveryStep}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Goal</p><p className="mt-1 text-sm text-muted-foreground">{flow.goal}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
