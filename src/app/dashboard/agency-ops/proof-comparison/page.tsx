import { proofComparisonModules } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProofComparisonPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Interactive Proof Comparison Modules</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Compare proof stacks and choose the right credibility mix for each campaign and audience.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {proofComparisonModules.map((row) => (
          <Card key={row.id}>
            <CardHeader className="space-y-3">
              <CardTitle>{row.module}</CardTitle>
              <Badge variant="secondary">{row.bestFor}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {row.proofTypes.map((item) => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Goal</p><p className="mt-1 text-sm">{row.conversionGoal}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
