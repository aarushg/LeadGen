import { winBackCampaigns } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  Draft: 'outline',
  Ready: 'warning',
  Live: 'success',
}

export default function WinBackCampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Win-Back Campaigns</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Re-engage former customers or dormant accounts with lower-friction offers and a clearer return path.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {winBackCampaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{campaign.client}</CardTitle>
              <Badge variant={statusVariant[campaign.status] ?? 'secondary'}>{campaign.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Segment</p><p className="mt-1 text-sm">{campaign.segment}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Offer</p><p className="mt-1 text-sm">{campaign.offer}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Next step</p><p className="mt-1 text-sm text-muted-foreground">{campaign.nextStep}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
