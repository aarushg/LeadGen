import { callbackSequences } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CallbackSequencesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lifecycle-Specific Callback Sequences</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Tailor callback flows by visitor stage so follow-up feels more relevant and timely.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {callbackSequences.map((sequence) => (
          <Card key={sequence.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{sequence.stage}</CardTitle>
                <Badge variant="secondary">{sequence.trigger}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {sequence.sequence.map((step) => (
                <Badge key={step} variant="outline">{step}</Badge>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
