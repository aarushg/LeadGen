import { attributionCaptureRules } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AttributionCapturePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Referral Source and UTM Auto-Capture</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Preserve source and campaign context at every key touchpoint so attribution stays useful as leads move through the funnel.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {attributionCaptureRules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{rule.touchpoint}</CardTitle>
                <Badge variant="secondary">Capture rule</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {rule.dataPoints.map((point) => (
                  <Badge key={point} variant="outline">{point}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{rule.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
