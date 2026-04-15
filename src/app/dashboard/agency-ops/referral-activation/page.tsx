import { referralActivationCampaigns } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  Draft: 'outline',
  Ready: 'warning',
  Live: 'success',
}

export default function ReferralActivationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Referral Activation Campaigns</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Turn happy customers into a repeatable acquisition channel by tracking incentive design, launch status, and next actions.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {referralActivationCampaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{campaign.client}</CardTitle>
              <Badge variant={statusVariant[campaign.status] ?? 'secondary'}>{campaign.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Audience</p>
                <p className="mt-1 text-sm">{campaign.audience}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Incentive</p>
                <p className="mt-1 text-sm">{campaign.incentive}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Next step</p>
                <p className="mt-1 text-sm text-muted-foreground">{campaign.nextStep}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
