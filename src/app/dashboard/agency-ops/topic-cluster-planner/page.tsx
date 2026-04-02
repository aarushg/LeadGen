import { topicClusters } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TopicClusterPlannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Topic Cluster Planner</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Structure SEO campaigns around connected content themes so agencies build compounding organic authority instead of isolated posts.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {topicClusters.map((cluster) => (
          <Card key={cluster.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{cluster.client}</CardTitle>
                <Badge variant="secondary">{cluster.pillar}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {cluster.supportingTopics.map((topic) => (
                  <Badge key={topic} variant="outline">{topic}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{cluster.goal}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
