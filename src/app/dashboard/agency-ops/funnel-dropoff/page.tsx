import { funnelDropoffSteps } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FunnelDropoffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Funnel Drop-Off Analysis</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Find the biggest points of friction in the conversion flow so agencies know exactly where to focus CRO work.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {funnelDropoffSteps.map((step) => (
          <Card key={step.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{step.step}</CardTitle>
              <Badge variant={step.conversionRate >= 20 ? 'secondary' : step.conversionRate >= 8 ? 'warning' : 'destructive'}>
                {step.conversionRate}%
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Visitors</p><p className="mt-1 text-2xl font-semibold">{step.visitors}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Main issue</p><p className="mt-1 text-sm text-muted-foreground">{step.issue}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
