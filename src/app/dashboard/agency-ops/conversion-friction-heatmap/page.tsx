import { conversionFrictionHeatmap } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ConversionFrictionHeatmapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Conversion Friction Heatmap</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Identify the page steps and sections creating hesitation so the funnel gets smoother fast.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {conversionFrictionHeatmap.map((item) => (
          <Card key={item.id}>
            <CardHeader className="space-y-3">
              <CardTitle>{item.step}</CardTitle>
              <Badge variant="secondary">{item.friction}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
