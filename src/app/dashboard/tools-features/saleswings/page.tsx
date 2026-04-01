'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Loader, Download, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

interface ScoredLead {
  id: string
  name: string
  email: string
  company: string
  engagementScore: number
  fitScore: number
  recommendedAction: string
  lastActivity: string
  traits: string[]
}

export default function SalesWingsPage() {
  const TOOL_ID = 'saleswings'
  const [leads, setLeads] = useState<ScoredLead[]>([])
  const [newLead, setNewLead] = useState({ name: '', email: '', company: '' })
  const [performanceLevel, setPerformanceLevel] = useState('medium')

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ leads: ScoredLead[] }>(TOOL_ID)
      if (!cancelled && state?.leads) {
        setLeads(state.leads)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { leads })
  }, [leads])

  // Simulate AI scoring
  function generateScore(): ScoredLead {
    const scores = [
      { name: 'John Smith', email: 'john@tech.com', company: 'Tech Innovations Inc', engagement: 85, fit: 90 },
      { name: 'Sarah Johnson', email: 'sarah@corp.com', company: 'Global Corp', engagement: 72, fit: 78 },
      { name: 'Mike Davis', email: 'mike@startup.io', company: 'StartUp AI', engagement: 95, fit: 88 },
      { name: 'Lisa Chen', email: 'lisa@enterprise.com', company: 'Enterprise Solutions', engagement: 68, fit: 72 },
    ]

    const randomScore = scores[Math.floor(Math.random() * scores.length)]
    return {
      id: `lead-${Date.now()}`,
      ...randomScore,
      engagementScore: randomScore.engagement,
      fitScore: randomScore.fit,
      recommendedAction: randomScore.engagement > 80 ? 'Call immediately' : 'Send email',
      lastActivity: '2 days ago',
      traits: ['Engaged', 'Good fit', 'High priority'],
    }
  }

  function addLead() {
    if (!newLead.name || !newLead.email) {
      toast.error('Enter name and email')
      return
    }

    const scoredLead: ScoredLead = {
      id: `lead-${Date.now()}`,
      name: newLead.name,
      email: newLead.email,
      company: newLead.company,
      engagementScore: Math.floor(Math.random() * 100),
      fitScore: Math.floor(Math.random() * 100),
      recommendedAction: 'Evaluate',
      lastActivity: 'Just now',
      traits: ['New', 'Unqualified'],
    }

    setLeads([scoredLead, ...leads])
    setNewLead({ name: '', email: '', company: '' })
    void trackToolEvent(TOOL_ID, 'lead_scored')
    toast.success('Lead added and scored')
  }

  function downloadScores() {
    const csv = [
      ['Name', 'Email', 'Company', 'Engagement', 'Fit', 'Action', 'Traits'],
      ...leads.map(l => [
        l.name,
        l.email,
        l.company,
        l.engagementScore,
        l.fitScore,
        l.recommendedAction,
        l.traits.join(';'),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'lead-scores.csv'
    link.click()
  }

  const highPriority = leads.filter(l => l.engagementScore >= 80)
  const medium = leads.filter(l => l.engagementScore >= 60 && l.engagementScore < 80)
  const low = leads.filter(l => l.engagementScore < 60)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SalesWings - Lead Scoring</h1>
        <p className="text-muted-foreground mt-2">
          Automatically score and prioritize leads for your sales team
        </p>
      </div>

      {/* Add Lead Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Lead to Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Name</Label>
              <Input
                placeholder="John Doe"
                value={newLead.name}
                onChange={e => setNewLead({ ...newLead, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                placeholder="john@company.com"
                value={newLead.email}
                onChange={e => setNewLead({ ...newLead, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                placeholder="Company Name"
                value={newLead.company}
                onChange={e => setNewLead({ ...newLead, company: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={addLead} className="w-full">
            Add & Score Lead
          </Button>
        </CardContent>
      </Card>

      {/* Lead Scoring by Priority */}
      {leads.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Lead Scores ({leads.length})</h2>
            <Button variant="outline" size="sm" onClick={downloadScores}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* High Priority */}
          {highPriority.length > 0 && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                  High Priority ({highPriority.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {highPriority.map(lead => (
                  <ScoreCard key={lead.id} lead={lead} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Medium Priority */}
          {medium.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                  Medium Priority ({medium.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {medium.map(lead => (
                  <ScoreCard key={lead.id} lead={lead} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Low Priority */}
          {low.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Low Priority ({low.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {low.map(lead => (
                  <ScoreCard key={lead.id} lead={lead} />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {leads.length === 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-8">No leads scored yet. Add a lead to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ScoreCard({ lead }: { lead: ScoredLead }) {
  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-semibold">{lead.name}</p>
          <p className="text-sm text-muted-foreground">{lead.email}</p>
          <p className="text-xs text-muted-foreground mt-1">{lead.company}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{lead.engagementScore}</div>
          <p className="text-xs text-muted-foreground">engagement</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Fit: {lead.fitScore}%</Badge>
          <Badge variant="outline">{lead.recommendedAction}</Badge>
        </div>
      </div>
    </div>
  )
}
