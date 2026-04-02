import { reactivationTasks } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReactivationQueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reactivation Queue for Stale Leads</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Turn old pipeline into a visible recovery workflow so agencies can revive dormant opportunities instead of ignoring them.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {reactivationTasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{task.company}</CardTitle>
                <Badge variant="warning">{task.staleDays} days stale</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Reason</p><p className="mt-1 text-sm">{task.reason}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Next step</p><p className="mt-1 text-sm text-muted-foreground">{task.nextStep}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
