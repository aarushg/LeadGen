import { personalizationRules } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PersonalizationRulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Offer-to-Page Personalization Rules</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Define how landing pages should adapt to traffic source, campaign intent, and account value so visitors see the
          most relevant proof and call to action.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {personalizationRules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">{rule.audience}</CardTitle>
                <Badge variant="secondary">Rule</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trigger</p>
                <p className="mt-1 text-sm">{rule.trigger}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Page element</p>
                <p className="mt-1 text-sm">{rule.pageElement}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recommended change</p>
                <p className="mt-1 text-sm text-muted-foreground">{rule.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
