import { chatQualificationFlows } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ChatQualificationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chat-Based Qualification Flows</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Qualify high-intent visitors conversationally before pushing them into a full form or sales handoff.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {chatQualificationFlows.map((flow) => (
          <Card key={flow.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{flow.audience}</CardTitle>
                <Badge variant="secondary">Chat flow</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Opening prompt</p><p className="mt-1 text-sm">{flow.openingPrompt}</p></div>
              <div className="flex flex-wrap gap-2">
                {flow.qualificationChecks.map((check) => (
                  <Badge key={check} variant="outline">{check}</Badge>
                ))}
              </div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Routing logic</p><p className="mt-1 text-sm text-muted-foreground">{flow.route}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
