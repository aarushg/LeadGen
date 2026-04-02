import { ctaConsistencyChecks } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CtaConsistencyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CTA Consistency Checker</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep content-to-offer paths more consistent across blog and resource pages so traffic converts more cleanly.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {ctaConsistencyChecks.map((check) => (
          <Card key={check.id}>
            <CardHeader>
              <CardTitle>{check.page}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Current CTA</p><p className="mt-1 text-sm">{check.currentCta}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Suggested CTA</p><p className="mt-1 text-sm">{check.suggestedCta}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Reason</p><p className="mt-1 text-sm text-muted-foreground">{check.reason}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
