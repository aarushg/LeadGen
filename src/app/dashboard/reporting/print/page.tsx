import { db } from '@/lib/db'
import { buildCrossChannelReport } from '@/lib/cross-channel-reporting'
import { filterReportingLeads, getWindowDates, toDateInputValue, type ReportingWindow } from '@/lib/reporting-filters'
import { PrintReportActions } from '@/components/reporting/print-report-actions'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatWindowLabel(window: ReportingWindow, startDate: string, endDate: string) {
  switch (window) {
    case 'thisMonth':
      return 'This month'
    case 'last30':
      return 'Last 30 days'
    case 'thisQuarter':
      return 'This quarter'
    case 'all':
      return 'All time'
    case 'custom':
      if (startDate && endDate) return `${startDate} to ${endDate}`
      return 'Custom range'
    default:
      return 'Reporting window'
  }
}

function executiveSummaryLines(report: ReturnType<typeof buildCrossChannelReport>) {
  const strongest = report.summary.strongestChannel
  const weakest = report.summary.weakestChannel

  const lines: string[] = []

  if (strongest) {
    lines.push(
      `${strongest.channel} is the strongest channel in this report with a ${strongest.qualificationRate}% qualification rate and ${formatCurrency(strongest.estimatedRevenue)} in estimated revenue.`
    )
  }

  if (weakest && weakest.channel !== strongest?.channel) {
    lines.push(
      `${weakest.channel} is the weakest-performing channel in this window with a ${weakest.qualificationRate}% qualification rate, which suggests it may need tighter targeting, messaging, or follow-up.`
    )
  }

  if (report.summary.totalRevenue > 0) {
    lines.push(
      `The filtered reporting window contains ${report.summary.totalLeads} tracked leads and ${formatCurrency(report.summary.totalRevenue)} in estimated revenue across all included channels.`
    )
  }

  return lines
}

function recommendedActions(report: ReturnType<typeof buildCrossChannelReport>) {
  const strongest = report.summary.strongestChannel
  const weakest = report.summary.weakestChannel

  const actions: string[] = []

  if (strongest) {
    actions.push(
      `Protect and scale ${strongest.channel} by shifting more budget or effort into the campaigns, audiences, or content themes driving its current quality.`
    )
  }

  if (weakest && weakest.channel !== strongest?.channel) {
    actions.push(
      `Audit ${weakest.channel} for targeting, offer clarity, creative fit, and follow-up speed before increasing spend or volume.`
    )
  }

  if (report.rows.length > 1) {
    actions.push(
      'Use this report to rebalance the next reporting period toward channels with stronger qualification and win rates, not just raw lead count.'
    )
  }

  return actions
}

export default async function ReportingPrintPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = (await searchParams) ?? {}
  const selectedChannel = typeof params.channel === 'string' ? params.channel : 'All'
  const selectedWindow = (typeof params.window === 'string' ? params.window : 'thisMonth') as ReportingWindow
  const customStart = typeof params.start === 'string' ? params.start : ''
  const customEnd = typeof params.end === 'string' ? params.end : ''
  const agencyName = typeof params.agency === 'string' ? params.agency : 'LeadGen'
  const clientName = typeof params.client === 'string' ? params.client : 'Client'
  const reportTitle = typeof params.title === 'string' ? params.title : 'Cross-Channel Performance Report'
  const clientNotes = typeof params.notes === 'string' ? params.notes : ''
  const now = new Date()
  const presetDates = getWindowDates(selectedWindow, now)
  const startDate = selectedWindow === 'custom' ? customStart : presetDates ? toDateInputValue(presetDates.start) : ''
  const endDate = selectedWindow === 'custom' ? customEnd : presetDates ? toDateInputValue(presetDates.end) : ''

  const leads = await db.leads.list()
  const filteredLeads = filterReportingLeads(leads, { selectedChannel, startDate, endDate })
  const report = buildCrossChannelReport(filteredLeads)
  const summaryLines = executiveSummaryLines(report)
  const actionLines = recommendedActions(report)
  const generatedAt = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(now)

  return (
    <div className="mx-auto max-w-5xl space-y-8 bg-white p-6 text-slate-900 print:max-w-none print:p-0">
      <div className="print:hidden">
        <PrintReportActions />
      </div>

      <header className="border-b pb-6">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{agencyName}</p>
            <h1 className="text-4xl font-bold tracking-tight">{reportTitle}</h1>
            <p className="max-w-2xl text-sm text-slate-600">
              Unified client reporting for ads, email, SEO, outbound, referral, and other lead sources.
            </p>
          </div>
          <div className="min-w-56 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p><span className="font-semibold">Client:</span> {clientName}</p>
            <p><span className="font-semibold">Generated:</span> {generatedAt}</p>
            <p><span className="font-semibold">Channel:</span> {selectedChannel}</p>
            <p><span className="font-semibold">Window:</span> {formatWindowLabel(selectedWindow, startDate, endDate)}</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Tracked Leads</p>
          <p className="mt-2 text-3xl font-bold">{report.summary.totalLeads}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Estimated Revenue</p>
          <p className="mt-2 text-3xl font-bold">{formatCurrency(report.summary.totalRevenue)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Top Channel</p>
          <p className="mt-2 text-3xl font-bold">{report.summary.topChannel ?? 'No data yet'}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-semibold">Executive Summary</h2>
        {summaryLines.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            Not enough filtered lead data is available yet to generate summary insights.
          </p>
        ) : (
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {summaryLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h2 className="text-lg font-semibold">Recommended Actions</h2>
        {actionLines.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            Add more filtered lead data to generate tailored recommendations.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {actionLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </section>

      {clientNotes && (
        <section className="rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold">Client Notes</h2>
          <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
            {clientNotes}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Channel Summary</h2>
          <p className="text-sm text-slate-600">Use this snapshot to compare lead quality and revenue efficiency across channels.</p>
        </div>

        {report.rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-sm text-slate-600">
            No rows match the selected filters.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold">Channel</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold">Tracked Leads</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold">Qualified</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold">Won</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold">Qualification Rate</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold">Win Rate</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold">Estimated Revenue</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row) => (
                  <tr key={row.channel}>
                    <td className="border-b border-slate-100 px-4 py-3 font-medium">{row.channel}</td>
                    <td className="border-b border-slate-100 px-4 py-3">{row.totalLeads}</td>
                    <td className="border-b border-slate-100 px-4 py-3">{row.qualifiedLeads}</td>
                    <td className="border-b border-slate-100 px-4 py-3">{row.wonLeads}</td>
                    <td className="border-b border-slate-100 px-4 py-3">{row.qualificationRate}%</td>
                    <td className="border-b border-slate-100 px-4 py-3">{row.winRate}%</td>
                    <td className="border-b border-slate-100 px-4 py-3">{formatCurrency(row.estimatedRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-semibold">How to use this report</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Compare which channels are generating qualified opportunities, not just lead volume.</li>
          <li>Use win rate and estimated revenue together to guide budget allocation for the next reporting period.</li>
          <li>Bring this print view into client meetings as a clean one-page performance snapshot.</li>
        </ul>
      </section>
    </div>
  )
}
