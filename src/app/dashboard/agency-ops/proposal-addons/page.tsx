import { proposalAddons } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProposalAddonsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Proposal Add-Ons Generated from Identified Growth Gaps</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Turn diagnosed weak spots into expansion-ready proposal modules with a clear commercial story.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {proposalAddons.map((row) => (
          <Card key={row.id}>
            <CardHeader className="space-y-3">
              <CardTitle>{row.client}</CardTitle>
              <Badge variant="secondary">{row.addon}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Growth gap</p><p className="mt-1 text-sm">{row.gap}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Value case</p><p className="mt-1 text-sm text-muted-foreground">{row.valueCase}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
