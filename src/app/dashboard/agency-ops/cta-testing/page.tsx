import { ctaTests } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CtaTestingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Call-to-Action Testing Workspace</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Compare CTA language and positioning so agencies can find the highest-converting next step for each funnel.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {ctaTests.map((test) => (
          <Card key={test.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{test.client}</CardTitle>
                <Badge variant="secondary">{test.targetMetric}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Control</p><p className="mt-1 text-sm">{test.control}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Variant</p><p className="mt-1 text-sm">{test.variant}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Test note</p><p className="mt-1 text-sm text-muted-foreground">{test.note}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
