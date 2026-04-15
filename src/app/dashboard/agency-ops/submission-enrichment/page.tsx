import { enrichmentSubmissionFlows } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SubmissionEnrichmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lead Enrichment on Form Submission</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Add context immediately at the point of capture so follow-up can be smarter from the first touch.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {enrichmentSubmissionFlows.map((flow) => (
          <Card key={flow.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{flow.trigger}</CardTitle>
                <Badge variant="secondary">Enrichment</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {flow.enrichments.map((item) => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{flow.outcome}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
