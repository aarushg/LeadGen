import { roadmapMilestones } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  Planned: 'outline',
  'In Progress': 'default',
  'At Risk': 'destructive',
  Complete: 'success',
}

export default function RoadmapMilestonesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Roadmap Milestone Tracker</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Show progress against promised roadmap milestones so account teams and clients can see delivery momentum clearly.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tracked milestones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {roadmapMilestones.map((item) => (
            <div key={item.id} className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.client}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.milestone}</p>
                </div>
                <Badge variant={statusVariant[item.status] ?? 'secondary'}>{item.status}</Badge>
              </div>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Owner</p>
                  <p className="mt-1">{item.owner}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Due date</p>
                  <p className="mt-1">{item.dueDate}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
