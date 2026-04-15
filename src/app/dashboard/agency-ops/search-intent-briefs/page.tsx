import { searchIntentBriefs } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const intentVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  Transactional: 'success',
  Commercial: 'warning',
  Informational: 'outline',
}

export default function SearchIntentBriefsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Intent Brief Generator</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Turn SEO strategy into writer-ready briefs with intent, angle, and CTA guidance already mapped out.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {searchIntentBriefs.map((brief) => (
          <Card key={brief.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{brief.keyword}</CardTitle>
                <Badge variant={intentVariant[brief.intent] ?? 'secondary'}>{brief.intent}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Angle</p><p className="mt-1 text-sm">{brief.angle}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">CTA</p><p className="mt-1 text-sm text-muted-foreground">{brief.cta}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
