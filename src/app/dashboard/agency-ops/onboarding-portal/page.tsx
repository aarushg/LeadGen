import { onboardingChecklistItems } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  'Not Started': 'outline',
  'In Progress': 'warning',
  Complete: 'success',
}

export default function OnboardingPortalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Onboarding Checklist Portal</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Standardize account kickoff so agencies collect access, align goals, and avoid preventable launch delays.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {onboardingChecklistItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{item.step}</CardTitle>
              <Badge variant={statusVariant[item.status] ?? 'secondary'}>{item.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Owner</p><p className="mt-1 text-sm">{item.owner}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Impact</p><p className="mt-1 text-sm text-muted-foreground">{item.impact}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
