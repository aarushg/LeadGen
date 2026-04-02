import { retentionMilestones } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  Strong: 'success',
  Watch: 'warning',
  'At Risk': 'destructive',
}

export default function RetentionScorecardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Retention Milestone Scorecards</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep retention work visible through milestone-based account health instead of vague sentiment alone.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {retentionMilestones.map((row) => (
          <Card key={row.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{row.client}</CardTitle>
                <Badge variant={statusVariant[row.status] ?? 'secondary'}>{row.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Milestone</p><p className="mt-1 text-sm">{row.milestone}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Note</p><p className="mt-1 text-sm text-muted-foreground">{row.note}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
