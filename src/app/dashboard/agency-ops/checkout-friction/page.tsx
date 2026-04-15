import { checkoutFrictionItems } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CheckoutFrictionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Checkout Friction Detector</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Spot the points in the booking or checkout experience where warm leads are losing momentum.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {checkoutFrictionItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.step}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Friction</p><p className="mt-1 text-sm">{item.friction}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Impact</p><p className="mt-1 text-sm text-muted-foreground">{item.impact}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
