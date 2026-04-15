import { attributionViewRows } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AttributionViewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">First-Touch, Last-Touch, and Multi-Touch Attribution Views</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Compare attribution models so channel decisions can be made with a fuller journey view.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {attributionViewRows.map((row) => (
          <Card key={row.id}>
            <CardHeader>
              <CardTitle>{row.channel}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">First</p><p className="mt-2 text-2xl font-semibold">{row.firstTouch}%</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Last</p><p className="mt-2 text-2xl font-semibold">{row.lastTouch}%</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Multi</p><p className="mt-2 text-2xl font-semibold">{row.multiTouch}%</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
