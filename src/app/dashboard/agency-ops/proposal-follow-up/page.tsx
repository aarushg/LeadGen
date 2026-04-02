import { db } from '@/lib/db'
import { buildProposalFollowUpInsights, proposalFollowUpSequences } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProposalFollowUpWorkbench } from './proposal-follow-up-workbench'

export default async function ProposalFollowUpPage() {
  const [proposals, leads] = await Promise.all([db.proposals.list(), db.leads.list()])
  const insight = buildProposalFollowUpInsights(proposals, leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Proposal Follow-Up Sequence Builder</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Standardize what happens after proposals go out so good opportunities do not stall from inconsistent follow-up.
        </p>
      </div>

      {proposalFollowUpSequences.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Proposal sequences will appear here once they have been configured.
          </CardContent>
        </Card>
      ) : (
        <ProposalFollowUpWorkbench insight={insight} sequences={proposalFollowUpSequences} />
      )}
    </div>
  )
}
