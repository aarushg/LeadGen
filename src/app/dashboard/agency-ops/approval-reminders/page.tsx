import { approvalReminders } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ApprovalRemindersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Auto-Reminders for Client Approvals and Missing Assets</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep launches on track by surfacing the blockers that still need client action or missing inputs.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {approvalReminders.map((row) => (
          <Card key={row.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{row.client}</CardTitle>
                <Badge variant="secondary">{row.daysOpen} days open</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Blocker</p><p className="mt-1 text-sm">{row.blocker}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Owner</p><p className="mt-1 text-sm text-muted-foreground">{row.owner}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
