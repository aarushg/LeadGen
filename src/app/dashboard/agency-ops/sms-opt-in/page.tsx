import { smsOptInCampaigns } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SmsOptInPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SMS Opt-In Capture</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Add a faster follow-up channel for leads who are more likely to respond to text than email.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {smsOptInCampaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{campaign.client}</CardTitle>
                <Badge variant="secondary">{campaign.offer}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Trigger</p><p className="mt-1 text-sm">{campaign.trigger}</p></div>
              <div className="rounded-2xl border bg-muted/30 p-4"><p className="text-sm">{campaign.optInCopy}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
