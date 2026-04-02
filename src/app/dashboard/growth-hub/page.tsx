'use client'

import { useMemo, useState } from 'react'
import { Lightbulb, Search, Sparkles, Target, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  growthFeatureCategories,
  growthFeatureIdeas,
  growthFeatureIdeasIntro,
  growthFeaturePriorityCounts,
  type GrowthFeatureCategory,
} from '@/lib/growth-feature-ideas'

const ALL_CATEGORIES = 'All categories'

const priorityVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  High: 'default',
  Medium: 'secondary',
  Low: 'outline',
}

export default function GrowthHubPage() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES)

  const filteredFeatures = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return growthFeatureIdeas.filter((feature) => {
      const categoryMatches =
        selectedCategory === ALL_CATEGORIES || feature.category === selectedCategory
      if (!categoryMatches) return false

      if (!normalized) return true

      return (
        feature.title.toLowerCase().includes(normalized) ||
        feature.category.toLowerCase().includes(normalized) ||
        feature.agencyValue.toLowerCase().includes(normalized) ||
        feature.clientOutcome.toLowerCase().includes(normalized)
      )
    })
  }, [query, selectedCategory])

  const categoryCounts = useMemo(() => {
    return growthFeatureIdeas.reduce<Record<GrowthFeatureCategory, number>>((acc, feature) => {
      acc[feature.category] = (acc[feature.category] ?? 0) + 1
      return acc
    }, {} as Record<GrowthFeatureCategory, number>)
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <Badge variant="secondary" className="w-fit">
              100 agency-ready growth ideas
            </Badge>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{growthFeatureIdeasIntro.title}</h1>
              <p className="mt-2 text-muted-foreground">{growthFeatureIdeasIntro.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="border-white/60 bg-white/70 shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Ideas</p>
                    <p className="text-xl font-semibold">{growthFeatureIdeas.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-white/60 bg-white/70 shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <Target className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Categories</p>
                    <p className="text-xl font-semibold">{growthFeatureCategories.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-white/60 bg-white/70 shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <TrendingUp className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">High priority</p>
                    <p className="text-xl font-semibold">{growthFeaturePriorityCounts.High ?? 0}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="w-full max-w-md border-white/60 bg-white/85 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                What agencies can do with this
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Use it as a roadmap for new service lines, client upsells, and internal product planning.</p>
              <p>Search by outcome, browse by category, and start with high-priority features first.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Find the right growth idea</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by feature, category, agency value, or client outcome"
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Priority mix</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {(['High', 'Medium', 'Low'] as const).map((priority) => (
              <div key={priority} className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{priority}</p>
                <p className="mt-2 text-2xl font-semibold">{growthFeaturePriorityCounts[priority] ?? 0}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Browse by category</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={selectedCategory === ALL_CATEGORIES ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(ALL_CATEGORIES)}
          >
            {ALL_CATEGORIES}
          </Button>
          {growthFeatureCategories.map((category) => (
            <Button
              key={category}
              type="button"
              size="sm"
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category} ({categoryCounts[category] ?? 0})
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id} className="h-full border-border/70">
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <Badge variant="secondary">{feature.category}</Badge>
                <Badge variant={priorityVariant[feature.priority] ?? 'secondary'}>
                  {feature.priority} priority
                </Badge>
              </div>
              <CardTitle className="text-lg leading-snug">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Agency value</p>
                <p className="mt-1 text-sm text-muted-foreground">{feature.agencyValue}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Business outcome</p>
                <p className="mt-1 text-sm">{feature.clientOutcome}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFeatures.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-medium">No growth ideas matched your search.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a broader keyword or switch back to all categories.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
