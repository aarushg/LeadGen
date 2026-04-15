import { proofSequences } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProofSequencingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Proof Sequencing Optimizer</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Decide which trust signals should appear first so the persuasion flow matches the buyer’s stage and intent.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {proofSequences.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.pageType}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">First proof</p><p className="mt-1 text-sm">{item.firstProof}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Second proof</p><p className="mt-1 text-sm">{item.secondProof}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Rationale</p><p className="mt-1 text-sm text-muted-foreground">{item.rationale}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
