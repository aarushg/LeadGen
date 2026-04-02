import { leadEnrichmentTasks } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const priorityVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  High: 'destructive',
  Medium: 'warning',
  Low: 'outline',
}

export default function LeadEnrichmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lead Enrichment Workflow Queue</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep enrichment visible before handoff so sales gets better context on company fit, stakeholders, and channel setup.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {leadEnrichmentTasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{task.client}</CardTitle>
              <Badge variant={priorityVariant[task.priority] ?? 'secondary'}>{task.priority}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Enrichment step</p><p className="mt-1 text-sm">{task.step}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Source</p><p className="mt-1 text-sm">{task.source}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Next action</p><p className="mt-1 text-sm text-muted-foreground">{task.nextAction}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
