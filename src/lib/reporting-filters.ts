import type { Lead } from '@/lib/db'
import { classifyLeadChannel, type ScoreboardChannel } from '@/lib/cross-channel-reporting'

export type ReportingWindow = 'all' | 'last30' | 'thisMonth' | 'thisQuarter' | 'custom'

export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function getWindowDates(window: ReportingWindow, now: Date) {
  const end = new Date(now)
  const start = new Date(now)

  switch (window) {
    case 'last30':
      start.setDate(start.getDate() - 29)
      return { start, end }
    case 'thisMonth':
      start.setDate(1)
      return { start, end }
    case 'thisQuarter': {
      const month = now.getMonth()
      const quarterStartMonth = Math.floor(month / 3) * 3
      return { start: new Date(now.getFullYear(), quarterStartMonth, 1), end }
    }
    default:
      return null
  }
}

export function filterReportingLeads(
  leads: Lead[],
  {
    selectedChannel,
    startDate,
    endDate,
  }: {
    selectedChannel: string
    startDate: string
    endDate: string
  }
) {
  return leads.filter((lead) => {
    if (selectedChannel !== 'All' && classifyLeadChannel(lead) !== selectedChannel as ScoreboardChannel) {
      return false
    }

    const createdAt = new Date(lead.created_at)
    if (startDate) {
      const start = new Date(`${startDate}T00:00:00`)
      if (createdAt < start) return false
    }

    if (endDate) {
      const end = new Date(`${endDate}T23:59:59`)
      if (createdAt > end) return false
    }

    return true
  })
}
