import { offerPackagingOptions } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function OfferPackagingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Offer Packaging Comparison Workspace</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Compare packaging options so the team can present the right model for each buyer and delivery situation.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {offerPackagingOptions.map((option) => (
          <Card key={option.id}>
            <CardHeader>
              <CardTitle>{option.packageName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Positioning</p><p className="mt-1 text-sm">{option.positioning}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Ideal for</p><p className="mt-1 text-sm text-muted-foreground">{option.idealFor}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
