import { approvalQueueItems } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  Waiting: 'outline',
  'In Review': 'warning',
  Approved: 'success',
  Blocked: 'destructive',
}

export default function ApprovalQueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approval Queue</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep client approvals visible so launches are not delayed by missing sign-off on assets and pages.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {approvalQueueItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{item.client}</CardTitle>
                <Badge variant={statusVariant[item.status] ?? 'secondary'}>{item.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Asset</p><p className="mt-1 text-sm">{item.asset}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Owner</p><p className="mt-1 text-sm">{item.owner}</p></div>
              {item.blocker && <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Blocker</p><p className="mt-1 text-sm text-muted-foreground">{item.blocker}</p></div>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
