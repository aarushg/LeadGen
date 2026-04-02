import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const DATA_DIR = join(process.cwd(), 'data')
const DB_FILE = join(DATA_DIR, 'db.json')

const leadCount = Number.parseInt(process.argv[2] ?? '10000', 10)

function pad(value, size = 5) {
  return String(value).padStart(size, '0')
}

function createRng(seed) {
  let state = seed >>> 0
  return () => {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 4294967296
  }
}

function pick(rng, items) {
  return items[Math.floor(rng() * items.length)]
}

function pickWeighted(rng, weightedItems) {
  const total = weightedItems.reduce((sum, item) => sum + item.weight, 0)
  let cursor = rng() * total
  for (const item of weightedItems) {
    cursor -= item.weight
    if (cursor <= 0) return item.value
  }
  return weightedItems[weightedItems.length - 1].value
}

function isoOffset(daysAgo, hour) {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - daysAgo)
  date.setUTCHours(hour, 0, 0, 0)
  return date.toISOString()
}

async function main() {
  const rng = createRng(20260402)
  await mkdir(DATA_DIR, { recursive: true })

  let existing = {
    leads: [],
    proposals: [],
    tools: [],
    tool_states: [],
    tool_events: [],
  }

  try {
    existing = {
      ...existing,
      ...(JSON.parse(await readFile(DB_FILE, 'utf-8')) ?? {}),
    }
  } catch {}

  const firstNames = ['Aarav', 'Vivaan', 'Arjun', 'Aditya', 'Reyansh', 'Kabir', 'Ishaan', 'Ananya', 'Aanya', 'Diya', 'Myra', 'Kiara']
  const lastNames = ['Sharma', 'Verma', 'Gupta', 'Malhotra', 'Bansal', 'Arora', 'Yadav', 'Singh', 'Khurana', 'Mehta', 'Ahuja', 'Sethi']
  const companyPrefixes = ['Skyline', 'Capital', 'Metro', 'Urban', 'Square', 'Elite', 'Prime', 'Northview', 'Crest', 'BlueBrick', 'Apex', 'Signature']
  const companySuffixes = ['Realty', 'Developers', 'Infra', 'Residences', 'Homes', 'Properties', 'Spaces', 'Buildtech', 'Projects', 'Habitat', 'Assets', 'Estates']
  const microMarkets = ['Gurugram', 'Delhi NCR', 'Noida', 'Greater Noida', 'Dwarka Expressway', 'Sohna Road', 'Golf Course Road', 'New Gurgaon']
  const industries = ['Residential Real Estate', 'Commercial Real Estate', 'Luxury Housing', 'PropTech', 'Plotting Projects', 'Retail Leasing']
  const titles = ['Sales Director', 'Marketing Head', 'VP Sales', 'Channel Partner Manager', 'Leasing Head', 'Business Head', 'Brand Manager', 'CRM Lead']
  const statuses = [
    { value: 'new', weight: 18 },
    { value: 'researched', weight: 14 },
    { value: 'contacted', weight: 16 },
    { value: 'replied', weight: 12 },
    { value: 'qualified', weight: 18 },
    { value: 'closed_won', weight: 12 },
    { value: 'closed_lost', weight: 10 },
  ]
  const leadQualities = [
    { value: 'high', weight: 28 },
    { value: 'medium', weight: 47 },
    { value: 'low', weight: 25 },
  ]
  const channels = [
    { lead_source: 'Google Ads', acquisition_channel: 'Ads', campaigns: ['Gurugram Luxury Apartments', 'Dwarka Expressway Search', 'Noida Investor Search'] },
    { lead_source: 'Meta Ads', acquisition_channel: 'Ads', campaigns: ['Site Visit Retargeting', 'Luxury Homes Carousel', 'Festival Booking Offer'] },
    { lead_source: 'SEO', acquisition_channel: 'SEO', campaigns: ['Gurugram Project Pages', 'Delhi NCR Property Guides', 'Location SEO Cluster'] },
    { lead_source: 'Outbound WhatsApp', acquisition_channel: 'Outbound', campaigns: ['Channel Partner Outreach', 'Broker Activation', 'Investor Callback Push'] },
    { lead_source: 'Referral', acquisition_channel: 'Referral', campaigns: ['Broker Referral Network', 'Existing Buyer Referral', 'Channel Partner Introductions'] },
    { lead_source: 'Email Nurture', acquisition_channel: 'Email', campaigns: ['Site Visit Follow-Up', 'Inventory Update Nurture', 'Price Drop Alert'] },
    { lead_source: 'Direct', acquisition_channel: 'Other', campaigns: ['Walk-In Inquiry', 'Project Website Direct', 'Inbound Call Request'] },
  ]
  const adSets = ['Investors NCR', 'End Users Gurugram', 'Luxury Buyers Delhi', 'NRI Property Audience', 'Warm Site Visitors', 'Project Brand Search']
  const notes = [
    'Interested in improving site visit bookings and filtering serious buyers.',
    'Needs help reducing low-intent leads from property campaigns.',
    'Looking for stronger channel reporting across Google, Meta, and broker referrals.',
    'Wants faster follow-up after project inquiries and missed calls.',
    'Exploring agency support for lead quality, inventory-specific funnels, and remarketing.',
  ]

  const leads = []
  const proposals = []

  for (let index = 1; index <= leadCount; index += 1) {
    const channel = pick(rng, channels)
    const campaign = pick(rng, channel.campaigns)
    const status = pickWeighted(rng, statuses)
    const leadQuality = pickWeighted(rng, leadQualities)
    const firstName = pick(rng, firstNames)
    const lastName = pick(rng, lastNames)
    const company = `${pick(rng, companyPrefixes)} ${pick(rng, companySuffixes)}`
    const market = pick(rng, microMarkets)
    const industry = pick(rng, industries)
    const title = pick(rng, titles)
    const createdDaysAgo = Math.floor(rng() * 240)
    const updatedDaysAgo = Math.max(0, createdDaysAgo - Math.floor(rng() * 35))
    const estimatedRevenueBase =
      leadQuality === 'high' ? 18000 : leadQuality === 'medium' ? 9000 : 3500
    const estimatedRevenue = Math.round(estimatedRevenueBase + rng() * estimatedRevenueBase * 0.8)

    const lead = {
      id: `demo-lead-${pad(index)}`,
      full_name: `${firstName} ${lastName}`,
      company: `${company} ${market}`,
      title,
      email: `${firstName}.${lastName}${index}@${company.toLowerCase().replace(/[^a-z0-9]+/g, '')}.in`.toLowerCase(),
      website: `https://www.${company.toLowerCase().replace(/[^a-z0-9]+/g, '')}.in`,
      industry,
      status,
      notes: `${pick(rng, notes)} Focus market: ${market}.`,
      outreach_message: `Hi ${firstName}, I noticed ${company} is actively marketing in ${market} through ${campaign}. We have a few ideas to improve inquiry quality and site visit conversion.`,
      research_data: JSON.stringify({
        team_size: 15 + Math.floor(rng() * 220),
        base_market: market,
        project_focus: campaign,
        pains: ['lead quality', 'site visit show rate', 'broker attribution', 'follow-up speed'].sort(() => rng() - 0.5).slice(0, 2),
      }),
      lead_source: channel.lead_source,
      acquisition_channel: channel.acquisition_channel,
      campaign_name: campaign,
      ad_set_name: pick(rng, adSets),
      lead_quality: leadQuality,
      estimated_revenue: estimatedRevenue,
      created_at: isoOffset(createdDaysAgo, 13),
      updated_at: isoOffset(updatedDaysAgo, 16),
    }

    leads.push(lead)

    if (index % 3 === 0 || status === 'qualified' || status === 'closed_won') {
      const proposalStatus =
        status === 'closed_won'
          ? 'accepted'
          : status === 'closed_lost'
            ? 'rejected'
            : pick(rng, ['draft', 'sent', 'review'])

      proposals.push({
        id: `demo-proposal-${pad(index)}`,
        lead_id: lead.id,
        content: {
          title: `${company} Real Estate Growth Proposal`,
          package: pick(rng, ['Project Launch Lead Gen Sprint', 'Site Visit Conversion System', 'Full Funnel Realty Growth Retainer']),
          investment: estimatedRevenue > 12000 ? 'INR 2,25,000/mo' : 'INR 1,10,000/mo',
          goals: ['increase qualified property inquiries', 'improve site visit rate', 'clean source reporting'],
        },
        status: proposalStatus,
        created_at: lead.created_at,
        updated_at: lead.updated_at,
      })
    }
  }

  const nextDb = {
    leads,
    proposals,
    tools: existing.tools ?? [],
    tool_states: existing.tool_states ?? [],
    tool_events: existing.tool_events ?? [],
  }

  await writeFile(DB_FILE, JSON.stringify(nextDb, null, 2), 'utf-8')

  console.log(`Seeded ${leads.length} leads and ${proposals.length} proposals into ${DB_FILE}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
