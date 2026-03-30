import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { db, type Proposal } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatRelativeDate } from '@/lib/utils'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  draft: 'secondary',
  sent: 'default',
  accepted: 'success',
  rejected: 'destructive',
}

export default async function ProposalsPage() {
  const proposals = await db.proposals.list()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Proposals</h1>
          <p className="text-muted-foreground">AI-generated client proposals</p>
        </div>
        <Button asChild>
          <Link href="/proposals/new">
            <Plus className="h-4 w-4" />
            New Proposal
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Proposals {proposals.length > 0 && `(${proposals.length})`}</CardTitle>
        </CardHeader>
        <CardContent>
          {proposals.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No proposals yet.</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/proposals/new">Generate your first proposal</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-0 divide-y">
              {proposals.map((proposal: Proposal) => {
                const meta = proposal.content as Record<string, string>
                return (
                  <div key={proposal.id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">{meta?.clientName ?? '—'}</p>
                      <p className="text-sm text-muted-foreground">
                        {meta?.clientCompany}
                        {meta?.projectType && ` · ${meta.projectType}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={STATUS_VARIANT[proposal.status] ?? 'secondary'}>
                        {proposal.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {formatRelativeDate(proposal.created_at)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
