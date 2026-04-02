import { renewalCountdownReminders } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RenewalCountdownPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Renewal Countdown Reminders</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep renewal timing visible so client success and account teams can act before conversations get rushed.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {renewalCountdownReminders.map((item) => (
          <Card key={item.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{item.client}</CardTitle>
                <Badge variant="secondary">{item.daysLeft} days</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Owner</p><p className="mt-1 text-sm">{item.owner}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Note</p><p className="mt-1 text-sm text-muted-foreground">{item.note}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
