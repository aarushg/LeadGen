import { clientRequestItems } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const priorityVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  High: 'destructive',
  Medium: 'warning',
  Low: 'outline',
}

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  New: 'outline',
  Queued: 'secondary',
  'In Progress': 'warning',
  Delivered: 'success',
}

export default function ClientRequestIntakePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Request Intake Workspace</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Centralize one-off client asks so the team can triage, assign, and deliver work without requests getting lost in Slack or email.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {clientRequestItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>{item.client}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={priorityVariant[item.priority] ?? 'secondary'}>{item.priority}</Badge>
                  <Badge variant={statusVariant[item.status] ?? 'secondary'}>{item.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{item.request}</p>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Owner</p><p className="mt-1 text-sm text-muted-foreground">{item.owner}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
