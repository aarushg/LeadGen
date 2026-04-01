'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Globe, TrendingUp, Users, Target, Zap, Download, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState } from '@/lib/tool-state-client'

interface CompanyVisit {
  id: string
  companyName: string
  website: string
  industry: string
  employeeCount: string
  location: string
  pageViews: number
  lastVisit: string
  visitIntent: 'research' | 'buying' | 'comparison' | 'exploring'
  decisionMaker: boolean
  contactName?: string
  contactTitle?: string
  email?: string
}

export default function LeadfeederPage() {
  const TOOL_ID = 'leadfeeder'
  const [trackingCode, setTrackingCode] = useState<string | null>(null)
  const [visitors, setVisitors] = useState<CompanyVisit[]>([])
  const [websiteURL, setWebsiteURL] = useState('')
  const [showSetup, setShowSetup] = useState(true)
  const [filterIntent, setFilterIntent] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'pages' | 'intent'>('recent')

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{
        trackingCode: string | null
        visitors: CompanyVisit[]
        websiteURL: string
        showSetup: boolean
      }>(TOOL_ID)

      if (!cancelled && state) {
        setTrackingCode(state.trackingCode ?? null)
        setVisitors(state.visitors ?? [])
        setWebsiteURL(state.websiteURL ?? '')
        setShowSetup(state.showSetup ?? true)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { trackingCode, visitors, websiteURL, showSetup })
  }, [trackingCode, visitors, websiteURL, showSetup])

  function setupTracking() {
    if (!websiteURL) {
      toast.error('Enter your website URL')
      return
    }

    const code = `<!-- Leadfeeder Tracking Code -->
<script>
  (function() {
    var lfCode = "${Math.random().toString(36).substr(2, 9)}";
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://cdn.leadfeeder.com/js/' + lfCode + '.js';
    document.head.appendChild(script);
  })();
</script>`

    setTrackingCode(code)
    setShowSetup(false)
    toast.success('Tracking code generated! Copy to your website.')

    // Simulate visitor data after setup
    setTimeout(() => {
      simulateVisitors()
    }, 1000)
  }

  function simulateVisitors() {
    const companies = [
      {
        name: 'TechCorp Solutions',
        website: 'techcorp.com',
        industry: 'Software',
        size: '500-1000',
      },
      {
        name: 'Global Marketing Inc',
        website: 'globalmarketing.io',
        industry: 'Marketing',
        size: '100-500',
      },
      {
        name: 'Enterprise Systems Ltd',
        website: 'enterprise-systems.co.uk',
        industry: 'Enterprise Software',
        size: '1000+',
      },
      {
        name: 'Growth Startups Fund',
        website: 'growthfund.vc',
        industry: 'Venture Capital',
        size: '50-100',
      },
      {
        name: 'Digital Agency Pro',
        website: 'digitalagencypro.com',
        industry: 'Digital Services',
        size: '100-500',
      },
    ]

    const intents: Array<'research' | 'buying' | 'comparison' | 'exploring'> = [
      'research',
      'buying',
      'comparison',
      'exploring',
    ]

    const newVisitors = companies.map((company, idx) => ({
      id: `visitor-${idx}-${Date.now()}`,
      companyName: company.name,
      website: company.website,
      industry: company.industry,
      employeeCount: company.size,
      location: 'United States',
      pageViews: Math.floor(Math.random() * 50) + 5,
      lastVisit: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      visitIntent: intents[Math.floor(Math.random() * intents.length)],
      decisionMaker: Math.random() > 0.5,
      contactName:
        Math.random() > 0.4
          ? `${['John', 'Sarah', 'Mike', 'Lisa'][Math.floor(Math.random() * 4)]} ${['Smith', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 4)]}`
          : undefined,
      contactTitle: Math.random() > 0.4 ? 'Director of Marketing' : undefined,
      email: Math.random() > 0.4 ? `contact@${company.website}` : undefined,
    }))

    setVisitors(newVisitors)
  }

  function copyTrackingCode() {
    if (trackingCode) {
      navigator.clipboard.writeText(trackingCode)
      toast.success('Code copied to clipboard')
    }
  }

  function exportVisitors() {
    const filtered = filterIntent === 'all' ? visitors : visitors.filter(v => v.visitIntent === filterIntent)
    const csvContent =
      'Company,Website,Industry,Employees,Last Visit,Intent,Pages,Decision Maker\n' +
      filtered
        .map(
          v =>
            `${v.companyName},${v.website},${v.industry},${v.employeeCount},${new Date(v.lastVisit).toLocaleDateString()},${v.visitIntent},${v.pageViews},${v.decisionMaker ? 'Yes' : 'No'}`
        )
        .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leadfeeder-visitors-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Visitors exported')
  }

  const filtered =
    filterIntent === 'all'
      ? visitors
      : visitors.filter(v => v.visitIntent === filterIntent)

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
    if (sortBy === 'pages') return b.pageViews - a.pageViews
    return (a.visitIntent === 'buying' ? 0 : 1) - (b.visitIntent === 'buying' ? 0 : 1)
  })

  const stats = {
    companies: new Set(visitors.map(v => v.companyName)).size,
    buyingIntent: visitors.filter(v => v.visitIntent === 'buying').length,
    decisionMakers: visitors.filter(v => v.decisionMaker).length,
    avgPageViews: visitors.length
      ? Math.round(visitors.reduce((acc, v) => acc + v.pageViews, 0) / visitors.length)
      : 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leadfeeder - Website Visitor Intelligence</h1>
        <p className="text-muted-foreground mt-2">Track B2B companies visiting your website</p>
      </div>

      {showSetup ? (
        <Card>
          <CardHeader>
            <CardTitle>Setup Website Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Your Website URL</Label>
              <Input
                placeholder="https://yourcompany.com"
                value={websiteURL}
                onChange={e => setWebsiteURL(e.target.value)}
              />
            </div>
            <Button onClick={setupTracking} className="w-full">
              Generate Tracking Code
            </Button>
            <p className="text-xs text-muted-foreground">
              Add the tracking code to your website header to start tracking visitor companies
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tracking Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="bg-muted p-3 rounded font-mono text-xs overflow-x-auto max-h-24 overflow-y-auto">
                {trackingCode}
              </div>
              <Button onClick={copyTrackingCode} variant="outline" className="w-full">
                Copy to Clipboard
              </Button>
              <p className="text-xs text-muted-foreground">
                Paste this code in your website's &lt;head&gt; tag to start tracking B2B visitors
              </p>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Companies</p>
                <p className="text-2xl font-bold">{stats.companies}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Buying Intent</p>
                <p className="text-2xl font-bold text-green-600">{stats.buyingIntent}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Decision Makers</p>
                <p className="text-2xl font-bold">{stats.decisionMakers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Avg Page Views</p>
                <p className="text-2xl font-bold">{stats.avgPageViews}</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters & Export */}
          <div className="flex gap-3 flex-wrap">
            <div>
              <Label className="text-xs">Filter by Intent</Label>
              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={filterIntent}
                onChange={e => setFilterIntent(e.target.value)}
              >
                <option value="all">All Intents</option>
                <option value="buying">Buying Intent</option>
                <option value="research">Research</option>
                <option value="comparison">Comparison</option>
                <option value="exploring">Exploring</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Sort By</Label>
              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
              >
                <option value="recent">Most Recent</option>
                <option value="pages">Most Page Views</option>
                <option value="intent">Buying Intent</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" size="sm" onClick={exportVisitors}>
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Visitors Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Tracked Visitors ({sorted.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sorted.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No visitors tracked yet. Add the code to your website to get started.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sorted.map(visitor => (
                    <div
                      key={visitor.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="grid gap-2 md:grid-cols-3">
                        <div>
                          <h4 className="font-semibold text-sm">{visitor.companyName}</h4>
                          <p className="text-xs text-muted-foreground">
                            {visitor.website} • {visitor.industry}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {visitor.employeeCount} employees
                          </p>
                        </div>

                        <div className="text-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                visitor.visitIntent === 'buying' ? 'default' : 'outline'
                              }
                            >
                              {visitor.visitIntent}
                            </Badge>
                            {visitor.decisionMaker && (
                              <Badge variant="secondary">Decision Maker</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            <TrendingUp className="h-3 w-3 inline mr-1" />
                            {visitor.pageViews} page views
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last: {new Date(visitor.lastVisit).toLocaleDateString()}
                          </p>
                        </div>

                        {visitor.contactName && (
                          <div className="text-sm">
                            <p className="font-semibold text-xs">{visitor.contactName}</p>
                            <p className="text-xs text-muted-foreground">{visitor.contactTitle}</p>
                            {visitor.email && (
                              <p className="text-xs font-mono text-primary mt-1 cursor-pointer hover:underline">
                                {visitor.email}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
