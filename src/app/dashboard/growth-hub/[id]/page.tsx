import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Lightbulb, Rocket, Target } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { growthFeatureIdeas } from '@/lib/growth-feature-ideas'
import { getGrowthFeatureRoute, isGrowthFeatureImplemented } from '@/lib/growth-feature-links'

type GrowthFeatureDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

const priorityVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  High: 'default',
  Medium: 'secondary',
  Low: 'outline',
}

export default async function GrowthFeatureDetailPage({ params }: GrowthFeatureDetailPageProps) {
  const { id } = await params
  const feature = growthFeatureIdeas.find((item) => item.id === id)

  if (!feature) {
    notFound()
  }

  const implemented = isGrowthFeatureImplemented(feature)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/growth-hub">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Growth Hub
          </Link>
        </Button>
        <Badge variant="secondary">{feature.category}</Badge>
        <Badge variant={priorityVariant[feature.priority] ?? 'secondary'}>{feature.priority} priority</Badge>
        <Badge variant={implemented ? 'success' : 'outline'}>{implemented ? 'Implemented' : 'Backlog idea'}</Badge>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{feature.title}</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          A Growth Hub planning brief for agency teams deciding what to build next.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-primary" />
              Agency value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{feature.agencyValue}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              Business outcome
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{feature.clientOutcome}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Rocket className="h-5 w-5 text-primary" />
            Next step
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {implemented
              ? 'This feature already has an implementation route in Agency Ops.'
              : 'This feature is still open. Use this brief as a planning handoff when you want to move it from backlog into Agency Ops.'}
          </p>
          <div className="flex flex-wrap gap-3">
            {implemented ? (
              <Button asChild>
                <Link href={getGrowthFeatureRoute(feature)}>Open implemented feature</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/dashboard/growth-hub">Browse more backlog ideas</Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href="/dashboard/agency-ops">Back to Agency Ops</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
