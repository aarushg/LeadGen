import { clientRoadmapIdeas } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ClientRoadmapBuilderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client-Specific Roadmap Builder</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Turn Growth Hub ideas into clearer account-specific roadmaps based on the client’s actual priority.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {clientRoadmapIdeas.map((row) => (
          <Card key={row.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{row.client}</CardTitle>
                <Badge variant="secondary">{row.focus}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {row.ideas.map((idea) => (
                <Badge key={idea} variant="outline">{idea}</Badge>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
