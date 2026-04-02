import { reviewAutomations } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReviewAutomationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review and Testimonial Collection Automations</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Turn happy milestones into a repeatable automation path for collecting reviews, testimonials, and case study proof.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {reviewAutomations.map((automation) => (
          <Card key={automation.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{automation.trigger}</CardTitle>
                <Badge variant="secondary">Automation</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {automation.sequence.map((step) => (
                  <Badge key={step} variant="outline">{step}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{automation.outcome}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
