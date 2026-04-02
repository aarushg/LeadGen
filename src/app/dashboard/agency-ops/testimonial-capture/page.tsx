import { testimonialCaptureItems } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  'To Ask': 'outline',
  Requested: 'warning',
  Approved: 'success',
  Published: 'success',
}

export default function TestimonialCapturePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review and Testimonial Capture Planner</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Turn customer proof into a repeatable growth workflow by tracking who to ask, what proof to capture, and what happens next.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {testimonialCaptureItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{item.client}</CardTitle>
              <Badge variant={statusVariant[item.status] ?? 'secondary'}>{item.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Champion</p><p className="mt-1 text-sm">{item.champion}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Proof type</p><p className="mt-1 text-sm">{item.proofType}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Next step</p><p className="mt-1 text-sm text-muted-foreground">{item.nextStep}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
