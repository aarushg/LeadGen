import { objectionWidgets } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ObjectionWidgetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Interactive Objection Handling Widgets</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          A planning surface for common objections that should be answered on-page before a visitor bounces or delays the decision.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {objectionWidgets.map((widget) => (
          <Card key={widget.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{widget.audience}</CardTitle>
                <Badge variant="secondary">{widget.suggestedPlacement}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Objection</p>
                <p className="mt-1 text-sm">{widget.objection}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recommended response</p>
                <p className="mt-1 text-sm text-muted-foreground">{widget.response}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
