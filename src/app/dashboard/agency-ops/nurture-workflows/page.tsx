import { nurtureWorkflows } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NurtureWorkflowsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lead Nurture Workflows by Funnel Stage</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Match follow-up sequences to where the buyer is in the funnel so messaging feels more relevant and timely.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {nurtureWorkflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{workflow.stage}</CardTitle>
                <Badge variant="secondary">{workflow.trigger}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {workflow.sequence.map((step) => (
                  <Badge key={step} variant="outline">{step}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{workflow.goal}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
