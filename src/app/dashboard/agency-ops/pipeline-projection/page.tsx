import { pipelineProjections } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const confidenceVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  High: 'success',
  Medium: 'warning',
  Low: 'outline',
}

export default function PipelineProjectionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Forecasted Pipeline Projection</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Project likely lead and revenue outcomes from current momentum so teams can spot upside and risk sooner.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {pipelineProjections.map((projection) => (
          <Card key={projection.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{projection.period}</CardTitle>
              <Badge variant={confidenceVariant[projection.confidence] ?? 'secondary'}>{projection.confidence}</Badge>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Projected leads</p><p className="mt-2 text-2xl font-semibold">{projection.projectedLeads}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Projected revenue</p><p className="mt-2 text-2xl font-semibold">${projection.projectedRevenue.toLocaleString()}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
