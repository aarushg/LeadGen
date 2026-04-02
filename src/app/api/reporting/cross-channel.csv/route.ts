import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { buildCrossChannelReport } from '@/lib/cross-channel-reporting'
import { filterReportingLeads, getWindowDates, toDateInputValue, type ReportingWindow } from '@/lib/reporting-filters'

function escapeCsv(value: string | number) {
  const stringValue = String(value)
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

export async function GET(req: NextRequest) {
  const selectedChannel = req.nextUrl.searchParams.get('channel') ?? 'All'
  const selectedWindow = (req.nextUrl.searchParams.get('window') ?? 'thisMonth') as ReportingWindow
  const customStart = req.nextUrl.searchParams.get('start') ?? ''
  const customEnd = req.nextUrl.searchParams.get('end') ?? ''
  const now = new Date()
  const presetDates = getWindowDates(selectedWindow, now)
  const startDate = selectedWindow === 'custom' ? customStart : presetDates ? toDateInputValue(presetDates.start) : ''
  const endDate = selectedWindow === 'custom' ? customEnd : presetDates ? toDateInputValue(presetDates.end) : ''

  const leads = await db.leads.list()
  const filteredLeads = filterReportingLeads(leads, { selectedChannel, startDate, endDate })
  const report = buildCrossChannelReport(filteredLeads)

  const rows = [
    ['Channel', 'Tracked Leads', 'Qualified Leads', 'Won Leads', 'Qualification Rate', 'Win Rate', 'Estimated Revenue'],
    ...report.rows.map((row) => [
      row.channel,
      row.totalLeads,
      row.qualifiedLeads,
      row.wonLeads,
      `${row.qualificationRate}%`,
      `${row.winRate}%`,
      row.estimatedRevenue,
    ]),
  ]

  const csv = rows
    .map((row) => row.map((value) => escapeCsv(value)).join(','))
    .join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="cross-channel-report.csv"',
    },
  })
}
