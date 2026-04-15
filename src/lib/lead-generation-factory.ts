export type LeadGenerationFeature = {
  id: string
  title: string
  category: string
  description: string
  playbook: string
}

const categories = [
  'Paid Acquisition',
  'Organic Search',
  'Outbound Prospecting',
  'Email Marketing',
  'LinkedIn Growth',
  'Conversion Optimization',
  'Landing Pages',
  'Lead Qualification',
  'CRM Automation',
  'Referral Programs',
  'Partnership Channels',
  'Webinars',
  'Local Lead Gen',
  'Retargeting',
  'Intent Data',
  'Sales Enablement',
  'Call Tracking',
  'Content Marketing',
  'Lead Nurture',
  'Pipeline Acceleration',
]

const actions = [
  'Builder',
  'Optimizer',
  'Analyzer',
  'Playbook',
  'Sequencer',
  'Scorer',
  'Dashboard',
  'Tracker',
  'Generator',
  'Assistant',
]

const objects = [
  'Audience Segment',
  'Offer Angle',
  'Landing Hook',
  'Email Sequence',
  'Ad Creative',
  'Follow-Up Cadence',
  'Qualification Logic',
  'Lead Routing Rule',
  'Attribution Path',
  'Channel Mix',
  'Pipeline Health',
  'Retention Trigger',
  'Referral Journey',
  'Search Intent Brief',
  'Competitor Gap',
  'Conversion Friction',
  'Call Outcome',
  'Prospect Intent',
  'Proposal Close Path',
  'Revenue Signal',
]

const outcomes = [
  'higher lead volume',
  'better lead quality',
  'faster follow-up',
  'stronger conversion rates',
  'lower acquisition cost',
  'more qualified pipeline',
  'improved win rates',
  'cleaner attribution',
  'better campaign consistency',
  'predictable growth',
]

const playbooks = [
  'Discovery -> Plan -> Launch -> Measure',
  'Audit -> Prioritize -> Test -> Scale',
  'Capture -> Qualify -> Route -> Close',
  'Attract -> Convert -> Nurture -> Expand',
  'Research -> Message -> Deploy -> Optimize',
]

function pad(num: number): string {
  return String(num).padStart(5, '0')
}

export function buildLeadGenerationFeatures(total = 10000): LeadGenerationFeature[] {
  const features: LeadGenerationFeature[] = []

  for (let i = 0; i < total; i += 1) {
    const category = categories[i % categories.length]
    const action = actions[i % actions.length]
    const object = objects[(i * 3) % objects.length]
    const outcome = outcomes[(i * 7) % outcomes.length]
    const playbook = playbooks[(i * 11) % playbooks.length]

    const id = `lgf-${pad(i + 1)}`
    const title = `${object} ${action}`
    const description = `${title} for ${category} focused on ${outcome}.`

    features.push({
      id,
      title,
      category,
      description,
      playbook,
    })
  }

  return features
}
