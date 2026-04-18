'use client'

import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import {
  ArrowLeft,
  Globe,
  Building2,
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  DollarSign,
  Zap,
  Plus,
  Minus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { ToolImplementation } from '@/lib/tool-implementations'
import type { Tool } from '@/lib/db'

export default function ToolDetailsPage() {
  const params = useParams() ?? {};
  const id = (params as { id?: string }).id ?? "";

  const [tool, setTool] = useState<Tool | null>(null)
  const [implementation, setImplementation] = useState<ToolImplementation | null>(null)
  const [loading, setLoading] = useState(true)
  const [runInput, setRunInput] = useState('{}')
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    async function loadToolData() {
      try {
        setLoading(true)
        // Load basic tool info
        const toolRes = await fetch(`/api/tools`)
        if (!toolRes.ok) throw new Error('Failed to load tool')
        const toolsData = await toolRes.json()
        const foundTool = toolsData.tools?.find((t: Tool) => t.id === id)
        
        if (!foundTool) {
          notFound()
        }
        setTool(foundTool)

        // Load implementation details
        const implRes = await fetch(`/api/tools/${id}/implementation`)
        if (implRes.ok) {
          const implData = await implRes.json()
          setImplementation(implData.implementation)
        }
      } catch (error) {
        toast.error('Failed to load tool details')
      } finally {
        setLoading(false)
      }
    }

    loadToolData()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (!tool) {
    notFound()
  }

  async function executeInAppTool() {
    try {
      setRunning(true)
      let parsedInput: Record<string, unknown> = {}
      if (runInput.trim()) {
        parsedInput = JSON.parse(runInput)
      }

      const response = await fetch(`/api/tools/${id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: parsedInput }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Execution failed')
      }

      const data = await response.json()
      setRunResult((data.result as Record<string, unknown>) ?? null)
      toast.success('Tool executed with in-app API')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid input JSON')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link href="/dashboard/tools">
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{tool.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{tool.summary}</p>
        </div>
        <Badge variant="secondary">{tool.type}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Best For
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{tool.bestFor}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{tool.type}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Official Website
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={tool.website ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Visit vendor site
            </a>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {tool.keyFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">In-App Tool Execution (Custom API)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Run this tool through LeadGen's internal endpoint: <span className="font-mono">/api/tools/{id}/run</span>
          </p>
          <Textarea
            value={runInput}
            onChange={(e) => setRunInput(e.target.value)}
            rows={6}
            placeholder='{"domain":"acme.com","firstName":"Alex","lastName":"Stone"}'
          />
          <Button onClick={executeInAppTool} disabled={running}>
            {running ? 'Executing...' : 'Run In-App Tool'}
          </Button>

          {runResult && (
            <pre className="text-xs bg-muted rounded p-3 overflow-x-auto border">
              {JSON.stringify(runResult, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      {implementation && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm font-medium">{implementation.startingPrice}</p>
                  <p className="text-xs text-muted-foreground">{implementation.pricingModel}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Setup Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm font-medium">{implementation.setupTime}</p>
                  <p className="text-xs text-muted-foreground">{implementation.setupComplexity}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  API Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={implementation.apiSupport ? 'default' : 'secondary'}>
                  {implementation.apiSupport ? 'Yes' : 'No'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Web App Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={implementation.webappOnly ? 'secondary' : 'default'}>
                  {implementation.webappOnly ? 'Yes' : 'No'}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {implementation.integrations.map((integration) => (
                  <Badge key={integration} variant="outline">
                    {integration}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {implementation.implementationSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="h-4 w-4 text-green-600" />
                  Pros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {implementation.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Minus className="h-4 w-4 text-red-600" />
                  Cons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {implementation.cons.map((con) => (
                    <li key={con} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Use Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {implementation.useCases.map((useCase) => (
                  <li key={useCase} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Success Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {implementation.successMetrics.map((metric) => (
                  <li key={metric} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {implementation.alternativesTool && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-base">Alternative Tool</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Consider looking at <span className="font-semibold">{implementation.alternativesTool}</span> as
                  an alternative option with similar capabilities.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div className="flex gap-2 flex-wrap">
        <Button asChild>
          <Link href={`/research?company=${encodeURIComponent(tool.name)}`}>Research This Tool</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/tools/analytics">Open Tool Analytics</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/leads">Open CRM</Link>
        </Button>
        {implementation?.documentationUrl && (
          <Button asChild variant="outline">
            <a href={implementation.documentationUrl} target="_blank" rel="noopener noreferrer">
              Official Docs
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
