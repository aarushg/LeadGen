import { postPurchaseSequences } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PostPurchaseSequencesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Post-Purchase Education and Onboarding Sequences</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep new clients or customers engaged after conversion with clearer onboarding and education milestones.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {postPurchaseSequences.map((sequence) => (
          <Card key={sequence.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{sequence.stage}</CardTitle>
                <Badge variant="secondary">Onboarding</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {sequence.assets.map((asset) => (
                  <Badge key={asset} variant="outline">{asset}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{sequence.goal}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
