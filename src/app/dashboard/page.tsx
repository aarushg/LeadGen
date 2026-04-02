import Link from 'next/link'
import { Search, FileText, Users, TrendingUp, Plus, LibraryBig, Lightbulb, Megaphone, BarChart3, BriefcaseBusiness } from 'lucide-react'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatRelativeDate } from '@/lib/utils'
import { growthFeatureIdeas, growthFeaturePriorityCounts } from '@/lib/growth-feature-ideas'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  new: 'secondary',
  researched: 'outline',
  contacted: 'default',
  replied: 'success',
  qualified: 'warning',
  closed_won: 'success',
  closed_lost: 'destructive',
}

export default async function DashboardPage() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [allLeads, allProposals] = await Promise.all([
    db.leads.list(),
    db.proposals.list(),
  ])

  const contactedThisWeek = allLeads.filter(
    l => ['contacted', 'replied'].includes(l.status) && l.updated_at >= weekAgo
  ).length

  const repliedCount = allLeads.filter(
    l => ['replied', 'qualified', 'closed_won'].includes(l.status)
  ).length

  const replyRate = allLeads.length > 0
    ? Math.round((repliedCount / allLeads.length) * 100)
    : 0

  const recentLeads = allLeads.slice(0, 10)

  const stats = [
    { label: 'Total Leads', value: allLeads.length, icon: Users, color: 'text-blue-600' },
    { label: 'Contacted This Week', value: contactedThisWeek, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Reply Rate', value: `${replyRate}%`, icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Proposals Sent', value: allProposals.length, icon: FileText, color: 'text-orange-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back. Here&apos;s what&apos;s happening.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/research">
              <Plus className="h-4 w-4" />
              New Lead
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/proposals/new">
              <Plus className="h-4 w-4" />
              New Proposal
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Leads</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/leads">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">No leads yet.</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/research">Research your first lead</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-0 divide-y">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">{lead.full_name || '—'}</p>
                    <p className="text-xs text-muted-foreground">{lead.company}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={STATUS_VARIANT[lead.status] ?? 'secondary'}>
                      {lead.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {formatRelativeDate(lead.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-white to-emerald-50/80">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <p className="font-semibold">New: Agency Growth Hub</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Explore {growthFeatureIdeas.length} growth features your agency can use to help clients win more leads,
              improve conversions, tighten reporting, and expand retention.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{growthFeaturePriorityCounts.High ?? 0} high-priority ideas</Badge>
              <Badge variant="outline">10 strategic categories</Badge>
            </div>
          </div>
          <Button asChild>
            <Link href="/dashboard/growth-hub">Open Growth Hub</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-8">
        <Link href="/research" className="group">
          <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold">Lead Research</p>
              <p className="text-sm text-muted-foreground mt-1">AI-powered company research + outreach</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/proposals/new" className="group">
          <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold">Generate Proposal</p>
              <p className="text-sm text-muted-foreground mt-1">Turn intake info into a full proposal</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/leads" className="group">
          <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold">CRM</p>
              <p className="text-sm text-muted-foreground mt-1">Track leads through your pipeline</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/tools" className="group">
          <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <LibraryBig className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold">Tools Library</p>
              <p className="text-sm text-muted-foreground mt-1">Compare top lead generation platforms</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/growth-hub" className="group">
          <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold">Growth Hub</p>
              <p className="text-sm text-muted-foreground mt-1">100 agency-ready features to grow client revenue</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/paid-campaigns" className="group">
          <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Megaphone className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold">Paid Campaigns</p>
              <p className="text-sm text-muted-foreground mt-1">Report lead quality by channel, campaign, and ad set</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/reporting" className="group">
          <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold">Reporting</p>
              <p className="text-sm text-muted-foreground mt-1">Compare ads, email, SEO, and outbound in one scoreboard</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/agency-ops" className="group">
          <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <BriefcaseBusiness className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold">Agency Ops</p>
              <p className="text-sm text-muted-foreground mt-1">Run personalization, launch planning, renewal risk, and more</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
