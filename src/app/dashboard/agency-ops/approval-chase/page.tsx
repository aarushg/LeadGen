import { approvalChaseTasks } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ApprovalChasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approval Chase Automation</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep launch blockers visible and automate the reminders that keep work moving.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {approvalChaseTasks.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.client}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Blocker</p><p className="mt-1 text-sm">{item.blocker}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Owner</p><p className="mt-1 text-sm text-muted-foreground">{item.owner}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Next reminder</p><p className="mt-1 text-sm text-muted-foreground">{item.nextReminder}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
