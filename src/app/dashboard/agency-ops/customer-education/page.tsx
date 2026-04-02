import { customerEducationAssets } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CustomerEducationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customer Education Content Map</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Organize onboarding, adoption, and renewal education so clients understand value faster and stay aligned longer.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {customerEducationAssets.map((row) => (
          <Card key={row.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{row.asset}</CardTitle>
                <Badge variant="secondary">{row.stage}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Audience</p><p className="mt-1 text-sm">{row.audience}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Goal</p><p className="mt-1 text-sm text-muted-foreground">{row.goal}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
