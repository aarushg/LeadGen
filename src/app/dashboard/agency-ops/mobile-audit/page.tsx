import { mobileAuditItems } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MobileAuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mobile Conversion Audit Checklist</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Review the mobile issues most likely to reduce clicks, trust, and form completion before they drag down conversion rate.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {mobileAuditItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.area}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Issue</p><p className="mt-1 text-sm">{item.issue}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Impact</p><p className="mt-1 text-sm text-muted-foreground">{item.impact}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
