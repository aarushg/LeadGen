import { leadRoutingRules } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const priorityVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  High: 'destructive',
  Medium: 'warning',
  Low: 'outline',
}

export default function LeadRoutingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Instant Lead Routing</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Route hot leads to the right rep or workflow immediately so qualified demand does not stall in a generic queue.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {leadRoutingRules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{rule.routeTo}</CardTitle>
              <Badge variant={priorityVariant[rule.priority] ?? 'secondary'}>{rule.priority}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Trigger</p><p className="mt-1 text-sm">{rule.trigger}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">SLA</p><p className="mt-1 text-sm text-muted-foreground">{rule.sla}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
