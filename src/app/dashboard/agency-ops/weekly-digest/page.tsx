import { weeklyDigestItems } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function WeeklyDigestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Weekly Wins and Risks Digest</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Give clients and account teams a simple weekly view of momentum, blockers, and what should happen next.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {weeklyDigestItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.client}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Win</p><p className="mt-1 text-sm">{item.win}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Risk</p><p className="mt-1 text-sm">{item.risk}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Next move</p><p className="mt-1 text-sm text-muted-foreground">{item.nextMove}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
