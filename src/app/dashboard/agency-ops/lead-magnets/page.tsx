import { leadMagnetItems } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LeadMagnetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lead Magnet Library</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep gated offers organized so agencies can launch faster and match the right asset to the right campaign.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {leadMagnetItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{item.title}</CardTitle>
                <Badge variant="secondary">{item.format}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Audience</p><p className="mt-1 text-sm">{item.audience}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">CTA</p><p className="mt-1 text-sm text-muted-foreground">{item.cta}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
