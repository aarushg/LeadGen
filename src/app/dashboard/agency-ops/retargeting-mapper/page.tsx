import { retargetingSequences } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RetargetingMapperPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Retargeting Sequence Mapper</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Map how retargeting messages should change by audience warmth and time window so paid follow-up gets smarter.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {retargetingSequences.map((sequence) => (
          <Card key={sequence.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{sequence.audience}</CardTitle>
                <Badge variant="secondary">{sequence.goal}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {sequence.messageByWindow.map((message) => (
                  <Badge key={message} variant="outline">{message}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
