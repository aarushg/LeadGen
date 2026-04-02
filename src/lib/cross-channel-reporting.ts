import type { Lead } from '@/lib/db'

export type ScoreboardChannel = 'Ads' | 'Email' | 'SEO' | 'Outbound' | 'Referral' | 'Other'

export type CrossChannelRow = {
  channel: ScoreboardChannel
  totalLeads: number
  qualifiedLeads: number
  wonLeads: number
  qualificationRate: number
  winRate: number
  estimatedRevenue: number
}

export type CrossChannelFilters = {
  channel?: ScoreboardChannel | 'All'
  startDate?: string
  endDate?: string
}

function normalize(value?: string) {
  return value?.trim().toLowerCase() ?? ''
}

export function classifyLeadChannel(lead: Lead): ScoreboardChannel {
  const acquisition = normalize(lead.acquisition_channel)
  const source = normalize(lead.lead_source)
  const campaign = normalize(lead.campaign_name)
  const haystack = [acquisition, source, campaign].join(' ')

  if (
    haystack.includes('paid') ||
    haystack.includes('google ads') ||
    haystack.includes('meta ads') ||
    haystack.includes('linkedin ads') ||
    haystack.includes('tiktok ads') ||
    haystack.includes('display') ||
    haystack.includes('youtube ads') ||
    haystack.includes('retarget')
  ) {
    return 'Ads'
  }

  if (
    haystack.includes('email') ||
    haystack.includes('newsletter') ||
    haystack.includes('mailchimp') ||
    haystack.includes('klaviyo')
  ) {
    return 'Email'
  }

  if (
    haystack.includes('seo') ||
    haystack.includes('organic') ||
    haystack.includes('search console') ||
    haystack.includes('blog')
  ) {
    return 'SEO'
  }

  if (
    haystack.includes('outbound') ||
    haystack.includes('cold email') ||
    haystack.includes('linkedin outreach') ||
    haystack.includes('prospecting') ||
    haystack.includes('sdr')
  ) {
    return 'Outbound'
  }

  if (
    haystack.includes('referral') ||
    haystack.includes('partner') ||
    haystack.includes('word of mouth')
  ) {
    return 'Referral'
  }

  return 'Other'
}

function percent(value: number, total: number) {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

export function buildCrossChannelReport(leads: Lead[]) {
  const seedOrder: ScoreboardChannel[] = ['Ads', 'Email', 'SEO', 'Outbound', 'Referral', 'Other']
  const rows = new Map<ScoreboardChannel, CrossChannelRow>(
    seedOrder.map((channel) => [
      channel,
      {
        channel,
        totalLeads: 0,
        qualifiedLeads: 0,
        wonLeads: 0,
        qualificationRate: 0,
        winRate: 0,
        estimatedRevenue: 0,
      },
    ])
  )

  for (const lead of leads) {
    const channel = classifyLeadChannel(lead)
    const row = rows.get(channel)!
    row.totalLeads += 1

    if (lead.status === 'qualified' || lead.status === 'closed_won') {
      row.qualifiedLeads += 1
    }

    if (lead.status === 'closed_won') {
      row.wonLeads += 1
    }

    row.estimatedRevenue += lead.estimated_revenue ?? 0
  }

  const scoreboard = Array.from(rows.values())
    .map((row) => ({
      ...row,
      qualificationRate: percent(row.qualifiedLeads, row.totalLeads),
      winRate: percent(row.wonLeads, row.totalLeads),
    }))
    .filter((row) => row.totalLeads > 0)
    .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue || b.totalLeads - a.totalLeads)

  const rankedByQualification = [...scoreboard]
    .filter((row) => row.totalLeads > 0)
    .sort((a, b) => b.qualificationRate - a.qualificationRate || b.estimatedRevenue - a.estimatedRevenue)

  const strongestChannel = rankedByQualification[0] ?? null
  const weakestChannel = [...rankedByQualification]
    .reverse()
    .find((row) => row.totalLeads > 0) ?? null

  return {
    rows: scoreboard,
    summary: {
      totalLeads: scoreboard.reduce((sum, row) => sum + row.totalLeads, 0),
      totalRevenue: scoreboard.reduce((sum, row) => sum + row.estimatedRevenue, 0),
      topChannel: scoreboard[0]?.channel ?? null,
      strongestChannel,
      weakestChannel,
    },
  }
}
