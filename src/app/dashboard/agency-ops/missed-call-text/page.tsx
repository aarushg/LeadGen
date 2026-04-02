import { missedCallAutomations } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MissedCallTextPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Missed-Call Text-Back Automation</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Recover inbound phone demand automatically when someone calls and the team misses it.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {missedCallAutomations.map((automation) => (
          <Card key={automation.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{automation.client}</CardTitle>
                <Badge variant="secondary">Auto-reply</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Trigger</p><p className="mt-1 text-sm">{automation.trigger}</p></div>
              <div className="rounded-2xl border bg-muted/30 p-4"><p className="text-sm">{automation.textReply}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Fallback</p><p className="mt-1 text-sm text-muted-foreground">{automation.fallback}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
