import Link from 'next/link'
import { BarChart3, CircleDollarSign, Filter, Megaphone, Target } from 'lucide-react'
import { db } from '@/lib/db'
import { buildPaidCampaignReport } from '@/lib/paid-campaign-reporting'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function PaidCampaignsPage() {
  const leads = await db.leads.list()
  const report = buildPaidCampaignReport(leads)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border bg-gradient-to-br from-amber-50 via-white to-sky-50 p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary" className="w-fit">Paid media reporting</Badge>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Paid Campaign Lead-Quality Reporting</h1>
            <p className="mt-2 text-muted-foreground">
              Track which paid channels and campaigns are producing leads that actually qualify, close, and generate revenue.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/research">Add lead with campaign data</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/leads">Open CRM</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Megaphone className="h-4 w-4" />
              <span className="text-sm">Paid Leads</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{report.summary.totalPaidLeads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span className="text-sm">Qualified Leads</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{report.summary.qualifiedLeads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">Qualification Rate</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{report.summary.qualificationRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Win Rate</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{report.summary.winRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CircleDollarSign className="h-4 w-4" />
              <span className="text-sm">Estimated Revenue</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{formatCurrency(report.summary.estimatedRevenue)}</p>
          </CardContent>
        </Card>
      </div>

      {report.campaigns.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No paid campaign lead data yet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Save leads with `lead source`, `acquisition channel`, `campaign name`, `ad set name`, `lead quality`, and optional `estimated revenue`
              to unlock campaign-level reporting here.
            </p>
            <p>
              Paid channels supported out of the box include Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads, paid search, paid social,
              display, YouTube Ads, and retargeting.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {report.campaigns.map((campaign) => (
            <Card key={`${campaign.campaignName}-${campaign.acquisitionChannel}-${campaign.adSetName}`}>
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{campaign.campaignName}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {campaign.acquisitionChannel} • {campaign.adSetName}
                    </p>
                  </div>
                  <Badge variant="secondary">{campaign.totalLeads} leads</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border bg-muted/30 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Qualified</p>
                    <p className="mt-2 text-xl font-semibold">{campaign.qualifiedLeads}</p>
                  </div>
                  <div className="rounded-2xl border bg-muted/30 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Win rate</p>
                    <p className="mt-2 text-xl font-semibold">{campaign.winRate}%</p>
                  </div>
                  <div className="rounded-2xl border bg-muted/30 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue</p>
                    <p className="mt-2 text-xl font-semibold">{formatCurrency(campaign.estimatedRevenue)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Qualification rate</span>
                    <span className="font-medium">{campaign.qualificationRate}%</span>
                  </div>
                  <Progress value={campaign.qualificationRate} />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lead quality mix</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge>High: {campaign.qualityBreakdown.high}</Badge>
                    <Badge variant="secondary">Medium: {campaign.qualityBreakdown.medium}</Badge>
                    <Badge variant="outline">Low: {campaign.qualityBreakdown.low}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pipeline status mix</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">New: {campaign.statusBreakdown.new}</Badge>
                    <Badge variant="outline">Contacted: {campaign.statusBreakdown.contacted}</Badge>
                    <Badge variant="outline">Replied: {campaign.statusBreakdown.replied}</Badge>
                    <Badge variant="outline">Qualified: {campaign.statusBreakdown.qualified}</Badge>
                    <Badge variant="outline">Won: {campaign.statusBreakdown.closed_won}</Badge>
                    <Badge variant="outline">Lost: {campaign.statusBreakdown.closed_lost}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
