export type GrowthFeatureCategory =
  | 'Lead Capture'
  | 'Conversion'
  | 'CRM & Pipeline'
  | 'Reporting'
  | 'Automation'
  | 'Content & SEO'
  | 'Paid Media'
  | 'Client Experience'
  | 'Retention'
  | 'Attribution'

export type GrowthFeatureIdea = {
  id: string
  title: string
  category: GrowthFeatureCategory
  priority: 'High' | 'Medium' | 'Low'
  agencyValue: string
  clientOutcome: string
}

type FeatureBlueprint = {
  category: GrowthFeatureCategory
  subject: string
  mechanism: string
  agencyValue: string
  clientOutcome: string
}

export const growthFeatureIdeasIntro = {
  title: 'Agency Growth Hub',
  description:
    'A curated backlog of next-step product ideas marketing agencies can use to help clients acquire, convert, retain, and expand revenue faster.',
}

const curatedIdeas: GrowthFeatureIdea[] = [
  {
    id: 'lead-capture-0001',
    title: 'Intent drift alerts for top landing pages',
    category: 'Lead Capture',
    priority: 'High',
    agencyValue: 'Flags when visitor intent slips on key pages so teams can react before leads cool off.',
    clientOutcome: 'More timely follow-up on visitors most likely to convert.',
  },
  {
    id: 'lead-capture-0002',
    title: 'Conversion friction heatmap',
    category: 'Lead Capture',
    priority: 'High',
    agencyValue: 'Shows where pages create hesitation so agencies can remove friction faster.',
    clientOutcome: 'Cleaner page experiences and more visitors moving through the funnel.',
  },
  {
    id: 'conversion-0001',
    title: 'Stale lead prioritization board',
    category: 'Conversion',
    priority: 'High',
    agencyValue: 'Surfaces the oldest unworked opportunities so teams can act before interest fades.',
    clientOutcome: 'More recovered pipeline from leads already in the CRM.',
  },
  {
    id: 'crm-pipeline-0001',
    title: 'Client-ready anomaly summary generator',
    category: 'CRM & Pipeline',
    priority: 'High',
    agencyValue: 'Turns unusual performance swings into simple client-facing narrative updates.',
    clientOutcome: 'Faster visibility into what changed and why it matters.',
  },
  {
    id: 'reporting-0001',
    title: 'Approval chase automation',
    category: 'Reporting',
    priority: 'High',
    agencyValue: 'Automates follow-up when campaign approvals or client assets are still missing.',
    clientOutcome: 'Fewer launch delays and smoother delivery handoffs.',
  },
  {
    id: 'automation-0001',
    title: 'Topic decay detector',
    category: 'Automation',
    priority: 'High',
    agencyValue: 'Shows when once-strong content starts losing traffic or engagement momentum.',
    clientOutcome: 'Better content refresh decisions before performance drops further.',
  },
  {
    id: 'content-seo-0001',
    title: 'Search query revenue map',
    category: 'Content & SEO',
    priority: 'High',
    agencyValue: 'Connects search terms to downstream revenue so agencies can spot profitable demand.',
    clientOutcome: 'Smarter decisions about which queries deserve more content and spend.',
  },
  {
    id: 'paid-media-0001',
    title: 'Renewal countdown reminders',
    category: 'Paid Media',
    priority: 'High',
    agencyValue: 'Keeps renewal timing visible so no account quietly drifts past proactive outreach.',
    clientOutcome: 'More prepared renewal conversations and fewer surprises.',
  },
  {
    id: 'client-experience-0001',
    title: 'Reusable agency playbook library',
    category: 'Client Experience',
    priority: 'High',
    agencyValue: 'Centralizes repeatable delivery processes so teams can reuse what already works.',
    clientOutcome: 'Faster execution with less setup friction on every client.',
  },
  {
    id: 'retention-0001',
    title: 'Lead source confidence scoring',
    category: 'Retention',
    priority: 'High',
    agencyValue: 'Shows which sources have the cleanest tracking, strongest fit, and most reliable outcomes.',
    clientOutcome: 'More trustworthy channel attribution and better spend decisions.',
  },
  {
    id: 'attribution-0001',
    title: 'Revenue per lead by campaign',
    category: 'Attribution',
    priority: 'High',
    agencyValue: 'Elevates agency reporting from volume to profitability.',
    clientOutcome: 'Focus on campaigns that create the best revenue outcomes.',
  },
]

const blueprints: FeatureBlueprint[] = [
  {
    category: 'Lead Capture',
    subject: 'lead quiz',
    mechanism: 'qualification logic',
    agencyValue: 'Creates a reusable qualification layer for agencies across multiple campaigns.',
    clientOutcome: 'Improves lead quality before the first sales touch.',
  },
  {
    category: 'Lead Capture',
    subject: 'exit-intent offer',
    mechanism: 'bounce recovery automation',
    agencyValue: 'Turns abandoning traffic into recoverable opportunities without a full funnel rebuild.',
    clientOutcome: 'Captures more leads from existing site traffic.',
  },
  {
    category: 'Lead Capture',
    subject: 'booking funnel',
    mechanism: 'intent-based routing',
    agencyValue: 'Lets agencies direct high-intent visitors into the best next step automatically.',
    clientOutcome: 'Shortens response time and increases booked calls.',
  },
  {
    category: 'Conversion',
    subject: 'pricing module',
    mechanism: 'offer testing',
    agencyValue: 'Gives agencies a faster way to test what offer framing wins on-page.',
    clientOutcome: 'Lifts conversion rate without increasing traffic costs.',
  },
  {
    category: 'Conversion',
    subject: 'proof section',
    mechanism: 'trust reinforcement',
    agencyValue: 'Helps agencies standardize trust-building elements across landing pages.',
    clientOutcome: 'Improves buyer confidence before the CTA.',
  },
  {
    category: 'Conversion',
    subject: 'objection block',
    mechanism: 'interactive persuasion',
    agencyValue: 'Lets agencies answer high-friction objections directly inside the page experience.',
    clientOutcome: 'Reduces hesitation and improves conversion quality.',
  },
  {
    category: 'CRM & Pipeline',
    subject: 'pipeline workflow',
    mechanism: 'sales prioritization',
    agencyValue: 'Makes it easier for agencies to operationalize sales follow-up rules.',
    clientOutcome: 'Keeps pipeline movement consistent and timely.',
  },
  {
    category: 'CRM & Pipeline',
    subject: 'reactivation board',
    mechanism: 'stale lead recovery',
    agencyValue: 'Turns dormant records into a repeatable recovery motion.',
    clientOutcome: 'Creates more pipeline from leads already in the system.',
  },
  {
    category: 'CRM & Pipeline',
    subject: 'handoff summary',
    mechanism: 'context transfer',
    agencyValue: 'Reduces manual coordination between marketing, sales, and account teams.',
    clientOutcome: 'Improves speed and quality of follow-up.',
  },
  {
    category: 'Reporting',
    subject: 'executive report',
    mechanism: 'performance summarization',
    agencyValue: 'Makes client reporting easier to package and present consistently.',
    clientOutcome: 'Creates clearer visibility into performance trends.',
  },
  {
    category: 'Reporting',
    subject: 'forecast report',
    mechanism: 'variance tracking',
    agencyValue: 'Helps agencies compare projections against actual outcomes quickly.',
    clientOutcome: 'Improves planning reliability and budget confidence.',
  },
  {
    category: 'Reporting',
    subject: 'retention report',
    mechanism: 'cohort analysis',
    agencyValue: 'Shows which client groups or service cohorts stay healthy the longest.',
    clientOutcome: 'Guides better retention and packaging decisions.',
  },
  {
    category: 'Automation',
    subject: 'follow-up flow',
    mechanism: 'sequence automation',
    agencyValue: 'Saves repetitive execution time across many client accounts.',
    clientOutcome: 'Improves speed-to-follow-up and nurturing consistency.',
  },
  {
    category: 'Automation',
    subject: 'approval workflow',
    mechanism: 'task orchestration',
    agencyValue: 'Reduces operational drag around content, ads, and launch readiness.',
    clientOutcome: 'Helps campaigns ship faster with fewer blockers.',
  },
  {
    category: 'Automation',
    subject: 'lead enrichment step',
    mechanism: 'data completion',
    agencyValue: 'Makes agency handoff and prioritization easier with richer contact context.',
    clientOutcome: 'Improves targeting and follow-up relevance.',
  },
  {
    category: 'Content & SEO',
    subject: 'topic map',
    mechanism: 'search planning',
    agencyValue: 'Helps agencies build more intentional organic growth plans.',
    clientOutcome: 'Supports stronger search visibility and pipeline.',
  },
  {
    category: 'Content & SEO',
    subject: 'content refresh queue',
    mechanism: 'asset improvement',
    agencyValue: 'Creates lower-effort wins from existing content libraries.',
    clientOutcome: 'Improves traffic and lead performance without starting from scratch.',
  },
  {
    category: 'Content & SEO',
    subject: 'schema recommendation',
    mechanism: 'SERP enhancement',
    agencyValue: 'Gives agencies a quick way to spot technical visibility wins.',
    clientOutcome: 'Improves click-through rate from search.',
  },
  {
    category: 'Paid Media',
    subject: 'ad testing tracker',
    mechanism: 'learning velocity',
    agencyValue: 'Helps agencies maintain a healthier testing cadence across accounts.',
    clientOutcome: 'Improves optimization speed and creative freshness.',
  },
  {
    category: 'Paid Media',
    subject: 'creative review board',
    mechanism: 'approval control',
    agencyValue: 'Keeps paid campaigns moving through review without losing visibility.',
    clientOutcome: 'Reduces delays to launch and iteration.',
  },
  {
    category: 'Paid Media',
    subject: 'budget planner',
    mechanism: 'allocation control',
    agencyValue: 'Supports better budget movement across channels and campaigns.',
    clientOutcome: 'Helps spend move toward higher-performing opportunities.',
  },
  {
    category: 'Client Experience',
    subject: 'client roadmap',
    mechanism: 'milestone tracking',
    agencyValue: 'Makes delivery progress easier to communicate and defend.',
    clientOutcome: 'Improves trust and visibility between meetings.',
  },
  {
    category: 'Client Experience',
    subject: 'decision log',
    mechanism: 'account continuity',
    agencyValue: 'Preserves key choices across account managers and delivery teams.',
    clientOutcome: 'Reduces confusion and repeated discussion.',
  },
  {
    category: 'Client Experience',
    subject: 'request intake',
    mechanism: 'work intake standardization',
    agencyValue: 'Centralizes scattered client asks into one operational stream.',
    clientOutcome: 'Improves response consistency and turnaround.',
  },
  {
    category: 'Retention',
    subject: 'referral campaign',
    mechanism: 'advocacy activation',
    agencyValue: 'Turns client success into a repeatable growth channel.',
    clientOutcome: 'Generates lower-cost, trust-based acquisition.',
  },
  {
    category: 'Retention',
    subject: 'renewal play',
    mechanism: 'risk prevention',
    agencyValue: 'Gives agencies earlier warning signals before churn conversations happen.',
    clientOutcome: 'Improves retention and account health.',
  },
  {
    category: 'Retention',
    subject: 'expansion recommendation',
    mechanism: 'upsell timing',
    agencyValue: 'Helps agencies see which accounts are most ready for expansion.',
    clientOutcome: 'Increases lifetime value through better-timed offers.',
  },
  {
    category: 'Attribution',
    subject: 'source report',
    mechanism: 'channel attribution',
    agencyValue: 'Connects agency work to business outcomes more clearly.',
    clientOutcome: 'Improves channel planning and spend confidence.',
  },
  {
    category: 'Attribution',
    subject: 'conversion path',
    mechanism: 'multi-touch visibility',
    agencyValue: 'Shows which channels assist before the final conversion event.',
    clientOutcome: 'Leads to more accurate budget allocation decisions.',
  },
  {
    category: 'Attribution',
    subject: 'naming governance layer',
    mechanism: 'tracking hygiene',
    agencyValue: 'Keeps reporting clean as the number of campaigns scales.',
    clientOutcome: 'Reduces analytics blind spots and misattribution.',
  },
]

const modifiers = [
  'for local growth programs',
  'for multi-location brands',
  'for service businesses',
  'for B2B sales teams',
  'for SaaS acquisition',
  'for ecommerce growth',
  'for founder-led funnels',
  'for retargeting campaigns',
  'for outbound-first teams',
  'for enterprise buying journeys',
]

const lenses = [
  'using first-party data',
  'using AI suggestions',
  'using workflow triggers',
  'using behavioral segmentation',
  'using lifecycle stages',
  'using campaign intent signals',
  'using revenue thresholds',
  'using account-fit scoring',
  'using page engagement patterns',
  'using channel-specific playbooks',
]

const outputs = [
  'to improve lead quality',
  'to increase booked meetings',
  'to reduce wasted spend',
  'to improve qualification rate',
  'to speed up follow-up',
  'to increase conversion efficiency',
  'to improve account retention',
  'to strengthen attribution clarity',
  'to improve launch readiness',
  'to increase pipeline confidence',
]

const businessImpacts = [
  'Creates a stronger operating system for client growth execution.',
  'Improves agency visibility into what should happen next.',
  'Lets agencies standardize higher-quality delivery across accounts.',
  'Makes strategy easier to operationalize in daily workflow.',
  'Turns reusable agency knowledge into a productized workflow.',
]

const clientImpacts = [
  'More qualified inquiries reaching the sales team.',
  'Higher conversion efficiency from existing demand.',
  'Faster movement from lead to revenue.',
  'Clearer reporting and better growth decisions.',
  'Stronger retention and expansion performance over time.',
]

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function buildGeneratedIdeas(targetCount: number): GrowthFeatureIdea[] {
  const generated: GrowthFeatureIdea[] = []
  const seenTitles = new Set(curatedIdeas.map((idea) => idea.title))
  let index = 1

  for (const blueprint of blueprints) {
    for (const modifier of modifiers) {
      for (const lens of lenses) {
        for (const output of outputs) {
          if (generated.length >= targetCount) {
            return generated
          }

          const title = `${blueprint.subject} ${modifier} ${lens} ${output}`
          if (seenTitles.has(title)) continue
          seenTitles.add(title)

          const id = `${slugify(blueprint.category)}-${String(index).padStart(4, '0')}`
          const priority: GrowthFeatureIdea['priority'] =
            output.includes('lead quality') || output.includes('conversion') || output.includes('pipeline')
              ? 'High'
              : modifier.includes('enterprise') || lens.includes('revenue')
                ? 'Medium'
                : 'Low'

          generated.push({
            id,
            title: title[0].toUpperCase() + title.slice(1),
            category: blueprint.category,
            priority,
            agencyValue: `${blueprint.agencyValue} ${businessImpacts[(index - 1) % businessImpacts.length]}`,
            clientOutcome: `${blueprint.clientOutcome} ${clientImpacts[(index - 1) % clientImpacts.length]}`,
          })

          index += 1
        }
      }
    }
  }

  return generated
}

const GENERATED_TARGET = 10000 - curatedIdeas.length

export const growthFeatureIdeas: GrowthFeatureIdea[] = [
  ...curatedIdeas,
  ...buildGeneratedIdeas(GENERATED_TARGET),
]

export const growthFeatureCategories = Array.from(
  new Set(growthFeatureIdeas.map((feature) => feature.category))
)

export const growthFeaturePriorityCounts = growthFeatureIdeas.reduce<Record<string, number>>(
  (acc, feature) => {
    acc[feature.priority] = (acc[feature.priority] ?? 0) + 1
    return acc
  },
  {}
)
