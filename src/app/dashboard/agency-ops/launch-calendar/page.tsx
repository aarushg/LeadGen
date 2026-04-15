import { campaignLaunchCalendar } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  Planning: 'outline',
  'Needs Approval': 'warning',
  'Ready to Launch': 'default',
  Live: 'success',
}

export default function LaunchCalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campaign Launch Calendar</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Coordinate client launches, internal owners, and approval status in one planning view so campaigns ship on time.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming launches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {campaignLaunchCalendar.map((item) => (
            <div key={item.id} className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.campaign}</p>
                  <p className="text-sm text-muted-foreground">{item.client} • {item.channel}</p>
                </div>
                <Badge variant={statusVariant[item.status] ?? 'secondary'}>{item.status}</Badge>
              </div>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Launch date</p>
                  <p className="mt-1">{item.launchDate}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Owner</p>
                  <p className="mt-1">{item.owner}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
