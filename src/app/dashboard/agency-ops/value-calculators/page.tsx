import { valueCalculatorScenarios } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ValueCalculatorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Value Calculator Widgets</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Frame ROI in plain language so prospects can visualize revenue lift, efficiency gains, or retention impact before talking to sales.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {valueCalculatorScenarios.map((scenario) => (
          <Card key={scenario.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{scenario.audience}</CardTitle>
                <Badge variant="secondary">{scenario.metric}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Baseline</p>
                <p className="mt-1 text-sm">{scenario.baseline}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Projected uplift</p>
                <p className="mt-1 text-sm">{scenario.uplift}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pitch angle</p>
                <p className="mt-1 text-sm text-muted-foreground">{scenario.pitch}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
