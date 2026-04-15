import { successPlans } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  'On Track': 'success',
  Watch: 'warning',
  'At Risk': 'destructive',
}

export default function SuccessPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Success Plans Tied to Revenue Targets</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Tie account strategy to revenue-linked milestones so client success is measurable and easier to defend.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {successPlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{plan.client}</CardTitle>
                <Badge variant={statusVariant[plan.status] ?? 'secondary'}>{plan.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue target</p><p className="mt-1 text-sm">{plan.revenueTarget}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Milestone</p><p className="mt-1 text-sm">{plan.milestone}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Owner</p><p className="mt-1 text-sm text-muted-foreground">{plan.owner}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
