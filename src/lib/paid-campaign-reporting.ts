import type { Lead, LeadQuality, LeadStatus } from '@/lib/db'

export type PaidCampaignSummary = {
  totalPaidLeads: number
  qualifiedLeads: number
  wonLeads: number
  qualificationRate: number
  winRate: number
  estimatedRevenue: number
}

export type PaidCampaignRow = {
  campaignName: string
  acquisitionChannel: string
  adSetName: string
  totalLeads: number
  qualifiedLeads: number
  wonLeads: number
  qualificationRate: number
  winRate: number
  estimatedRevenue: number
  qualityBreakdown: Record<LeadQuality, number>
  statusBreakdown: Record<LeadStatus, number>
}

const PAID_CHANNELS = new Set([
  'paid search',
  'paid social',
  'display',
  'youtube ads',
  'retargeting',
  'google ads',
  'meta ads',
  'linkedin ads',
  'tiktok ads',
])

function normalizeChannel(value?: string) {
  return value?.trim().toLowerCase() ?? ''
}

function isPaidLead(lead: Lead) {
  const channel = normalizeChannel(lead.acquisition_channel)
  const source = normalizeChannel(lead.lead_source)
  return PAID_CHANNELS.has(channel) || PAID_CHANNELS.has(source)
}

function percent(numerator: number, denominator: number) {
  if (!denominator) return 0
  return Math.round((numerator / denominator) * 100)
}

export function buildPaidCampaignReport(leads: Lead[]) {
  const paidLeads = leads.filter(isPaidLead)

  const rowsMap = new Map<string, PaidCampaignRow>()

  for (const lead of paidLeads) {
    const campaignName = lead.campaign_name?.trim() || 'Unassigned campaign'
    const acquisitionChannel = lead.acquisition_channel?.trim() || lead.lead_source?.trim() || 'Unknown channel'
    const adSetName = lead.ad_set_name?.trim() || 'General'
    const key = `${campaignName}::${acquisitionChannel}::${adSetName}`

    const existing = rowsMap.get(key) ?? {
      campaignName,
      acquisitionChannel,
      adSetName,
      totalLeads: 0,
      qualifiedLeads: 0,
      wonLeads: 0,
      qualificationRate: 0,
      winRate: 0,
      estimatedRevenue: 0,
      qualityBreakdown: { high: 0, medium: 0, low: 0 },
      statusBreakdown: {
        new: 0,
        researched: 0,
        contacted: 0,
        replied: 0,
        qualified: 0,
        closed_won: 0,
        closed_lost: 0,
      },
    }

    existing.totalLeads += 1
    existing.statusBreakdown[lead.status] += 1

    if (lead.status === 'qualified' || lead.status === 'closed_won') {
      existing.qualifiedLeads += 1
    }

    if (lead.status === 'closed_won') {
      existing.wonLeads += 1
    }

    if (lead.lead_quality) {
      existing.qualityBreakdown[lead.lead_quality] += 1
    }

    existing.estimatedRevenue += lead.estimated_revenue ?? 0
    rowsMap.set(key, existing)
  }

  const campaigns = Array.from(rowsMap.values())
    .map((row) => ({
      ...row,
      qualificationRate: percent(row.qualifiedLeads, row.totalLeads),
      winRate: percent(row.wonLeads, row.totalLeads),
    }))
    .sort((a, b) => b.totalLeads - a.totalLeads || b.estimatedRevenue - a.estimatedRevenue)

  const summary: PaidCampaignSummary = {
    totalPaidLeads: paidLeads.length,
    qualifiedLeads: paidLeads.filter((lead) => lead.status === 'qualified' || lead.status === 'closed_won').length,
    wonLeads: paidLeads.filter((lead) => lead.status === 'closed_won').length,
    qualificationRate: percent(
      paidLeads.filter((lead) => lead.status === 'qualified' || lead.status === 'closed_won').length,
      paidLeads.length
    ),
    winRate: percent(
      paidLeads.filter((lead) => lead.status === 'closed_won').length,
      paidLeads.length
    ),
    estimatedRevenue: paidLeads.reduce((total, lead) => total + (lead.estimated_revenue ?? 0), 0),
  }

  return { summary, campaigns }
}
