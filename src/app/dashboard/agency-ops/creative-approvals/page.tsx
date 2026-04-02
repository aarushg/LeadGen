import { creativeApprovalQueue } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  Drafting: 'outline',
  'In Review': 'default',
  'Needs Revisions': 'warning',
  Approved: 'success',
}

export default function CreativeApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Creative Concept Approval Workflow</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Track which concepts are drafting, under review, blocked by revisions, or fully approved so launches keep moving.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {creativeApprovalQueue.map((item) => (
          <Card key={item.id}>
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>{item.campaign}</CardTitle>
                <Badge variant={statusVariant[item.status] ?? 'secondary'}>{item.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.client}</p>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Asset type</p>
                <p className="mt-1 text-sm">{item.assetType}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Owner</p>
                <p className="mt-1 text-sm">{item.owner}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Due date</p>
                <p className="mt-1 text-sm">{item.dueDate}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
