import { salesHandoffSummaries } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SalesHandoffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Handoff Summaries</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Package lead context, fit, and likely next step so sales can move faster with better relevance.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {salesHandoffSummaries.map((summary) => (
          <Card key={summary.id}>
            <CardHeader>
              <CardTitle>{summary.company}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Fit</p><p className="mt-1 text-sm">{summary.fit}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Context</p><p className="mt-1 text-sm">{summary.context}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Next step</p><p className="mt-1 text-sm text-muted-foreground">{summary.nextStep}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
