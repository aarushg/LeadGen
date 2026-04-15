import { requestCenterItems } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RequestCenterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Request Intake Center</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Centralize incoming asks from Slack, email, and meetings so nothing important gets lost between channels.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {requestCenterItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.client}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Request</p><p className="mt-1 text-sm">{item.request}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Source</p><p className="mt-1 text-sm">{item.source}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Owner</p><p className="mt-1 text-sm text-muted-foreground">{item.owner}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
