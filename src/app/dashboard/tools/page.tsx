'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Sparkles, CheckCircle2, PlusCircle, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import {
  leadGenerationBenefits,
  leadGenerationIntro,
  leadGenerationMustHaveFeatures,
  type LeadTool,
} from '@/lib/lead-tools-data'

const ALL_TYPES = 'all'
type PersistedTool = LeadTool & { id: string }

export default function LeadToolsPage() {
  const router = useRouter()
  const [tools, setTools] = useState<PersistedTool[]>([])
  const [loadingTools, setLoadingTools] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState(ALL_TYPES)
  const [selectedTool, setSelectedTool] = useState<LeadTool | null>(null)
  const [selectedToolNames, setSelectedToolNames] = useState<string[]>([])

  useEffect(() => {
    let ignore = false

    async function loadTools() {
      try {
        setLoadingTools(true)
        const res = await fetch('/api/tools')
        if (!res.ok) throw new Error('Failed to load tools')
        const data = await res.json()
        if (!ignore) {
          setTools((data.tools ?? []) as PersistedTool[])
        }
      } catch {
        if (!ignore) {
          toast.error('Could not load tools from the database')
        }
      } finally {
        if (!ignore) {
          setLoadingTools(false)
        }
      }
    }

    loadTools()

    return () => {
      ignore = true
    }
  }, [])

  function toggleToolSelection(name: string) {
    setSelectedToolNames((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    )
  }

  const types = useMemo(() => {
    return [...new Set(tools.map(tool => tool.type))].sort((a, b) => a.localeCompare(b))
  }, [tools])

  const filteredTools = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return tools.filter((tool) => {
      const typeMatches = selectedType === ALL_TYPES || tool.type === selectedType
      if (!typeMatches) return false

      if (!normalized) return true

      return (
        tool.name.toLowerCase().includes(normalized) ||
        tool.type.toLowerCase().includes(normalized) ||
        tool.bestFor.toLowerCase().includes(normalized) ||
        tool.keyFeatures.some(feature => feature.toLowerCase().includes(normalized))
      )
    })
  }, [query, selectedType, tools])

  const selectedTools = useMemo(
    () => tools.filter((tool) => selectedToolNames.includes(tool.name)),
    [selectedToolNames, tools]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lead Generation Tools Library</h1>
        <p className="text-muted-foreground mt-1">{leadGenerationIntro.overview}</p>
        <p className="text-sm text-muted-foreground mt-2">{leadGenerationIntro.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Tools Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{tools.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{types.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Best-Practice Features</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{leadGenerationMustHaveFeatures.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Visible Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{filteredTools.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Compare Tools Quickly
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_260px]">
          <div className="space-y-2">
            <Label htmlFor="tool-search">Search by tool, use case, or feature</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="tool-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: CRM, intent, automation, webinars"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Filter by category</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_TYPES}>All types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loadingTools && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">Loading tools from database...</CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredTools.map((tool) => (
          <div
            key={tool.name}
            onClick={() => router.push(`/dashboard/tools/${encodeURIComponent(tool.id)}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                router.push(`/dashboard/tools/${encodeURIComponent(tool.id)}`)
              }
            }}
            className="w-full text-left cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Open ${tool.name} details page`}
          >
            <Card
              className={`h-full transition-all hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-primary/40 ${
                selectedToolNames.includes(tool.name) ? 'ring-2 ring-primary/40 border-primary/50' : ''
              }`}
            >
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base">{tool.name}</CardTitle>
                    <Badge variant="secondary">{tool.type}</Badge>
                  </div>
                  {selectedToolNames.includes(tool.name) ? (
                    <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                      <Check className="h-3.5 w-3.5" />
                      Selected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add to compare
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Best for: {tool.bestFor}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{tool.summary}</p>
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Key features</p>
                  <ul className="space-y-1">
                    {tool.keyFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTool(tool)
                    }}
                  >
                    View full details
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/dashboard/tools/${encodeURIComponent(tool.id)}`)
                    }}
                  >
                    Open in app
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {selectedTools.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="text-base">Comparison Workspace ({selectedTools.length})</CardTitle>
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedToolNames([])}>
              Clear selection
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-3">
              {selectedTools.map((tool) => (
                <Card key={`selected-${tool.name}`} className="border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{tool.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{tool.bestFor}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-1">
                      {tool.keyFeatures.map((feature) => (
                        <li key={`${tool.name}-${feature}`} className="text-xs text-muted-foreground">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <Button type="button" size="sm" variant="secondary" onClick={() => setSelectedTool(tool)}>
                        Details
                      </Button>
                      <Button type="button" size="sm" variant="outline" asChild>
                        <Link href={`/research?company=${encodeURIComponent(tool.name)}`}>Research Fit</Link>
                      </Button>
                      <Button type="button" size="sm" variant="outline" asChild>
                        <a href={tool.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredTools.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-medium">No tools matched your filters.</p>
            <p className="text-sm text-muted-foreground mt-1">Try a broader keyword or switch category to All types.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Benefits of Lead Generation Software
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leadGenerationBenefits.map((benefit) => (
              <div key={benefit.title}>
                <p className="font-medium text-sm">{benefit.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">What to Look For in a Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {leadGenerationMustHaveFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Dialog open={selectedTool !== null} onOpenChange={(open) => !open && setSelectedTool(null)}>
        <DialogContent>
          {selectedTool && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 pr-8">
                  <DialogTitle>{selectedTool.name}</DialogTitle>
                  <Badge variant="secondary">{selectedTool.type}</Badge>
                </div>
                <DialogDescription>Best for: {selectedTool.bestFor}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Overview</p>
                  <p className="text-sm mt-1">{selectedTool.summary}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Website</p>
                  <a
                    href={selectedTool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm mt-1 inline-block text-primary hover:underline"
                  >
                    {selectedTool.website}
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Key features</p>
                  <ul className="space-y-2 mt-2">
                    {selectedTool.keyFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
