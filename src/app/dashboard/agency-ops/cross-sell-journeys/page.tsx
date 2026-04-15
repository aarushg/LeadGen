import { crossSellJourneys } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CrossSellJourneysPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cross-Sell and Upsell Journey Builder</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Plan expansion motions based on account maturity so agencies can grow revenue from existing relationships.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {crossSellJourneys.map((journey) => (
          <Card key={journey.id}>
            <CardHeader>
              <CardTitle>{journey.client}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Current service</p><p className="mt-1 text-sm">{journey.currentService}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Next offer</p><p className="mt-1 text-sm">{journey.nextOffer}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Trigger</p><p className="mt-1 text-sm text-muted-foreground">{journey.trigger}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
