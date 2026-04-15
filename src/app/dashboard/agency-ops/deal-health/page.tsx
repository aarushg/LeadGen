import { dealHealthRows } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const healthVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  Strong: 'success',
  Watch: 'warning',
  'At Risk': 'destructive',
}

export default function DealHealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deal Health Scores</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep opportunity quality visible so the team can focus on deals that need action before they go cold.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {dealHealthRows.map((row) => (
          <Card key={row.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{row.company}</CardTitle>
                <Badge variant={healthVariant[row.health] ?? 'secondary'}>{row.health}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Signal</p><p className="mt-1 text-sm">{row.signal}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Action</p><p className="mt-1 text-sm text-muted-foreground">{row.action}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
