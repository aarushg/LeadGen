import { staleLeadPriorities } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StaleLeadBoardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stale Lead Prioritization Board</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep the oldest unworked opportunities visible so recovery work stays focused and timely.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {staleLeadPriorities.map((item) => (
          <Card key={item.id}>
            <CardHeader className="space-y-3">
              <CardTitle>{item.lead}</CardTitle>
              <Badge variant="secondary">{item.priority}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Age</p><p className="mt-1 text-sm">{item.age} days</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Next action</p><p className="mt-1 text-sm text-muted-foreground">{item.nextAction}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
