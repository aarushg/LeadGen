import Link from 'next/link'
import { BarChart3, CircleDollarSign, Download, Mail, Megaphone, Printer, Search, Send } from 'lucide-react'
import { db } from '@/lib/db'
import { ReportingAISummary } from './ai-summary'
import { buildCrossChannelReport, type ScoreboardChannel } from '@/lib/cross-channel-reporting'
import { filterReportingLeads, getWindowDates, toDateInputValue, type ReportingWindow } from '@/lib/reporting-filters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function iconForChannel(channel: string) {
  switch (channel) {
    case 'Ads':
      return Megaphone
    case 'Email':
      return Mail
    case 'SEO':
      return Search
    case 'Outbound':
      return Send
    default:
      return BarChart3
  }
}

export default async function ReportingPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = (await searchParams) ?? {}
  const selectedChannel = typeof params.channel === 'string' ? params.channel : 'All'
  const selectedWindow = (typeof params.window === 'string' ? params.window : 'thisMonth') as ReportingWindow
  const customStart = typeof params.start === 'string' ? params.start : ''
  const customEnd = typeof params.end === 'string' ? params.end : ''
  const agencyName = typeof params.agency === 'string' ? params.agency : ''
  const clientName = typeof params.client === 'string' ? params.client : ''
  const reportTitle = typeof params.title === 'string' ? params.title : ''
  const clientNotes = typeof params.notes === 'string' ? params.notes : ''
  const now = new Date()

  const leads = await db.leads.list()
  const presetDates = getWindowDates(selectedWindow, now)
  const startDate = selectedWindow === 'custom' ? customStart : presetDates ? toDateInputValue(presetDates.start) : ''
  const endDate = selectedWindow === 'custom' ? customEnd : presetDates ? toDateInputValue(presetDates.end) : ''

  const filteredLeads = filterReportingLeads(leads, { selectedChannel, startDate, endDate })

  const leadsForAI = filteredLeads.map(l => ({
    company: l.company,
    status: l.status,
    lead_quality: l.lead_quality ?? null,
    estimated_revenue: l.estimated_revenue ?? null,
    acquisition_channel: l.acquisition_channel ?? null,
  }))

  const report = buildCrossChannelReport(filteredLeads)
  const availableChannels: Array<ScoreboardChannel | 'All'> = ['All', 'Ads', 'Email', 'SEO', 'Outbound', 'Referral', 'Other']
  const exportParams = new URLSearchParams()
  exportParams.set('channel', selectedChannel)
  exportParams.set('window', selectedWindow)
  if (startDate) exportParams.set('start', startDate)
  if (endDate) exportParams.set('end', endDate)
  if (agencyName) exportParams.set('agency', agencyName)
  if (clientName) exportParams.set('client', clientName)
  if (reportTitle) exportParams.set('title', reportTitle)
  if (clientNotes) exportParams.set('notes', clientNotes)

  return (
    <div className="space-y-6">
      <ReportingAISummary leads={leadsForAI} />

      <div className="flex flex-col gap-4 rounded-3xl border bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary" className="w-fit">Reporting</Badge>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cross-Channel Performance Scoreboard</h1>
            <p className="mt-2 text-muted-foreground">
              Unify ad, email, SEO, and outbound performance in one place so agencies can make smarter channel mix decisions.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/paid-campaigns">Paid campaign detail</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/api/reporting/cross-channel.csv?${exportParams.toString()}`}>
              <Download className="h-4 w-4" />
              Export CSV
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/dashboard/reporting/print?${exportParams.toString()}`}>
              <Printer className="h-4 w-4" />
              Printable view
            </Link>
          </Button>
          <Button asChild>
            <Link href="/research">Add tracked lead</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Tracked Leads</p>
            <p className="mt-2 text-2xl font-bold">{report.summary.totalLeads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Estimated Revenue</p>
            <p className="mt-2 text-2xl font-bold">{formatCurrency(report.summary.totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Top Channel</p>
            <p className="mt-2 text-2xl font-bold">{report.summary.topChannel ?? 'No data yet'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 lg:grid-cols-4">
            <div className="space-y-2">
              <label htmlFor="agency" className="text-sm font-medium">Agency name</label>
              <Input id="agency" name="agency" placeholder="CyberRush" defaultValue={agencyName} />
            </div>

            <div className="space-y-2">
              <label htmlFor="client" className="text-sm font-medium">Client name</label>
              <Input id="client" name="client" placeholder="Acme Co" defaultValue={clientName} />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <label htmlFor="title" className="text-sm font-medium">Report title</label>
              <Input id="title" name="title" placeholder="Monthly Growth Review" defaultValue={reportTitle} />
            </div>

            <div className="space-y-2 lg:col-span-4">
              <label htmlFor="notes" className="text-sm font-medium">Client notes</label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add meeting notes, priorities, context, or talking points for the client report."
                defaultValue={clientNotes}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="channel" className="text-sm font-medium">Channel</label>
              <select
                id="channel"
                name="channel"
                defaultValue={selectedChannel}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {availableChannels.map((channel) => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="window" className="text-sm font-medium">Date range</label>
              <select
                id="window"
                name="window"
                defaultValue={selectedWindow}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="thisMonth">This month</option>
                <option value="last30">Last 30 days</option>
                <option value="thisQuarter">This quarter</option>
                <option value="all">All time</option>
                <option value="custom">Custom range</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="start" className="text-sm font-medium">Start date</label>
              <Input id="start" name="start" type="date" defaultValue={customStart || startDate} />
            </div>

            <div className="space-y-2">
              <label htmlFor="end" className="text-sm font-medium">End date</label>
              <Input id="end" name="end" type="date" defaultValue={customEnd || endDate} />
            </div>

            <div className="flex gap-2 lg:col-span-4">
              <Button type="submit">Apply filters</Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/reporting">Reset</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {report.rows.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No cross-channel data yet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Add leads with source or acquisition-channel data like `Google Ads`, `Email`, `SEO`, or `Outbound` to generate this scoreboard.
            </p>
            <p>
              The report groups lead performance into Ads, Email, SEO, Outbound, Referral, and Other so you can compare channel quality in one view.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {report.rows.map((row) => {
            const Icon = iconForChannel(row.channel)

            return (
              <Card key={row.channel}>
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{row.channel}</CardTitle>
                        <p className="text-sm text-muted-foreground">Unified channel performance snapshot</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{row.totalLeads} leads</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border bg-muted/30 p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Qualified</p>
                      <p className="mt-2 text-xl font-semibold">{row.qualifiedLeads}</p>
                    </div>
                    <div className="rounded-2xl border bg-muted/30 p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Won</p>
                      <p className="mt-2 text-xl font-semibold">{row.wonLeads}</p>
                    </div>
                    <div className="rounded-2xl border bg-muted/30 p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue</p>
                      <p className="mt-2 text-xl font-semibold">{formatCurrency(row.estimatedRevenue)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Qualification rate</span>
                      <span className="font-medium">{row.qualificationRate}%</span>
                    </div>
                    <Progress value={row.qualificationRate} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Win rate</span>
                      <span className="font-medium">{row.winRate}%</span>
                    </div>
                    <Progress value={row.winRate} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
