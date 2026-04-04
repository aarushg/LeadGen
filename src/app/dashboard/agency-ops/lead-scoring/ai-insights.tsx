'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Bot, AlertTriangle, Lightbulb, Zap, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Lead {
  company: string
  status: string
  lead_quality?: string | null
  estimated_revenue?: number | null
  acquisition_channel?: string | null
  notes?: string | null
}

interface Insights {
  topInsight: string
  bottleneck: string
  quickWins: string[]
  riskLeads: string[]
  channelRecommendation: string
}

export function LeadScoringInsights({ leads }: { leads: Lead[] }) {
  const [insights, setInsights] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [model, setModel] = useState('')

  async function fetchInsights() {
    setLoading(true)
    setError('')
    setInsights(null)

    // Get first available model
    let selectedModel = model
    if (!selectedModel) {
      try {
        const statusRes = await fetch('/api/ollama/status')
        const status = await statusRes.json()
        selectedModel = status.models?.[0] ?? 'llama3'
        setModel(selectedModel)
      } catch {
        selectedModel = 'llama3'
      }
    }

    try {
      const res = await fetch('/api/ollama/analyze-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads, model: selectedModel, mode: 'scoring' }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Analysis failed'); return }
      setInsights(data)
    } catch {
      setError('Could not reach Ollama')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Pipeline Analysis
        </CardTitle>
        <Button
          size="sm"
          onClick={fetchInsights}
          disabled={loading || leads.length === 0}
          className="gap-1.5"
        >
          {loading ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing...</>
          ) : insights ? (
            <><Sparkles className="h-3.5 w-3.5" /> Re-analyze</>
          ) : (
            <><Sparkles className="h-3.5 w-3.5" /> Analyze with AI</>
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {!insights && !loading && !error && (
          <p className="text-sm text-muted-foreground">
            Click "Analyze with AI" to get Ollama-powered insights on your pipeline — bottlenecks, quick wins, and at-risk leads.
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" /> {error}
          </p>
        )}

        {insights && (
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Top insight */}
            <div className="sm:col-span-2 rounded-lg border bg-background p-4">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide flex items-center gap-1 mb-2">
                <Lightbulb className="h-3.5 w-3.5" /> Top Insight
              </p>
              <p className="text-sm">{insights.topInsight}</p>
            </div>

            {/* Bottleneck */}
            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide flex items-center gap-1 mb-2">
                <AlertTriangle className="h-3.5 w-3.5" /> Bottleneck
              </p>
              <p className="text-sm">{insights.bottleneck}</p>
            </div>

            {/* Channel recommendation */}
            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide flex items-center gap-1 mb-2">
                <TrendingUp className="h-3.5 w-3.5" /> Channel Signal
              </p>
              <p className="text-sm">{insights.channelRecommendation}</p>
            </div>

            {/* Quick wins */}
            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide flex items-center gap-1 mb-2">
                <Zap className="h-3.5 w-3.5" /> Quick Wins
              </p>
              <ul className="space-y-1.5">
                {insights.quickWins.map((w, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-green-600 font-bold shrink-0">→</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* At-risk leads */}
            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide flex items-center gap-1 mb-2">
                <AlertTriangle className="h-3.5 w-3.5" /> At-Risk Leads
              </p>
              {insights.riskLeads.length > 0 ? (
                <ul className="space-y-1.5">
                  {insights.riskLeads.map((l, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="text-red-500 font-bold shrink-0">!</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No high-risk leads identified.</p>
              )}
            </div>
          </div>
        )}

        {model && insights && (
          <p className="text-xs text-muted-foreground text-right">Generated by {model}</p>
        )}
      </CardContent>
    </Card>
  )
}
