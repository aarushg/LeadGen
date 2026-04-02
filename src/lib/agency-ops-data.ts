import type { Lead } from '@/lib/db'
import type { Proposal } from '@/lib/db'
import { classifyLeadChannel, type ScoreboardChannel } from '@/lib/cross-channel-reporting'

export type PersonalizationRule = {
  id: string
  audience: string
  trigger: string
  pageElement: string
  recommendation: string
}

export type CompetitorAdSignal = {
  id: string
  competitor: string
  channel: 'Meta Ads' | 'Google Ads' | 'LinkedIn Ads' | 'YouTube'
  angle: string
  offer: string
  suggestedResponse: string
}

export type CampaignLaunchItem = {
  id: string
  campaign: string
  client: string
  channel: string
  owner: string
  launchDate: string
  status: 'Planning' | 'Needs Approval' | 'Ready to Launch' | 'Live'
}

export type ObjectionWidget = {
  id: string
  audience: string
  objection: string
  response: string
  suggestedPlacement: string
}

export type CreativeApprovalItem = {
  id: string
  client: string
  campaign: string
  assetType: string
  owner: string
  status: 'Drafting' | 'In Review' | 'Needs Revisions' | 'Approved'
  dueDate: string
}

export type ClientDecision = {
  id: string
  client: string
  decision: string
  owner: string
  decidedOn: string
  impact: 'High' | 'Medium' | 'Low'
}

export type ValueCalculatorScenario = {
  id: string
  audience: string
  metric: string
  baseline: string
  uplift: string
  pitch: string
}

export type RoadmapMilestone = {
  id: string
  client: string
  milestone: string
  dueDate: string
  owner: string
  status: 'Planned' | 'In Progress' | 'At Risk' | 'Complete'
}

export type ReferralCampaign = {
  id: string
  client: string
  audience: string
  incentive: string
  status: 'Draft' | 'Ready' | 'Live'
  nextStep: string
}

export type LeadCaptureQuizTemplate = {
  id: string
  title: string
  audience: string
  qualificationGoal: string
  steps: string[]
  outcome: string
}

export type ExitIntentOffer = {
  id: string
  offerName: string
  trigger: string
  targetPage: string
  incentive: string
  followUp: string
}

export type PricingSensitivityTest = {
  id: string
  client: string
  audience: string
  testFocus: string
  variants: string[]
  successMetric: string
  recommendedRead: string
}

export type ProposalFollowUpSequence = {
  id: string
  sequence: string
  trigger: string
  channelMix: string[]
  timing: string
  goal: string
}

export type SharedGrowthRoadmapItem = {
  id: string
  client: string
  quarter: string
  priority: string
  owner: string
  status: 'Planned' | 'In Progress' | 'Blocked' | 'Complete'
  successMetric: string
}

export type QualificationFormTemplate = {
  id: string
  title: string
  audience: string
  fields: string[]
  logic: string
  expectedLift: string
}

export type RescueBanner = {
  id: string
  page: string
  trigger: string
  message: string
  cta: string
  audience: string
}

export type OfferTestScenario = {
  id: string
  client: string
  experiment: string
  variants: string[]
  targetMetric: string
  note: string
}

export type LeadScoringRule = {
  id: string
  rule: string
  points: number
  reason: string
}

export type LeadEnrichmentTask = {
  id: string
  client: string
  step: string
  source: string
  priority: 'High' | 'Medium' | 'Low'
  nextAction: string
}

export type SeoOpportunity = {
  id: string
  client: string
  page: string
  intent: 'High' | 'Medium' | 'Low'
  score: number
  action: string
}

export type ClientRequestItem = {
  id: string
  client: string
  request: string
  owner: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'New' | 'Queued' | 'In Progress' | 'Delivered'
}

export type TestimonialCaptureItem = {
  id: string
  client: string
  champion: string
  proofType: 'Review' | 'Testimonial' | 'Case Study'
  status: 'To Ask' | 'Requested' | 'Approved' | 'Published'
  nextStep: string
}

export type SchedulingWidgetScenario = {
  id: string
  audience: string
  routing: string
  calendarType: string
  expectedOutcome: string
}

export type GeoPersonalizationVariant = {
  id: string
  market: string
  headline: string
  socialProof: string
  cta: string
}

export type FunnelDropoffStep = {
  id: string
  step: string
  visitors: number
  conversionRate: number
  issue: string
}

export type LeadRoutingRule = {
  id: string
  trigger: string
  routeTo: string
  priority: 'High' | 'Medium' | 'Low'
  sla: string
}

export type TopicCluster = {
  id: string
  client: string
  pillar: string
  supportingTopics: string[]
  goal: string
}

export type OnboardingChecklistItem = {
  id: string
  step: string
  owner: string
  status: 'Not Started' | 'In Progress' | 'Complete'
  impact: string
}

export type WinBackCampaign = {
  id: string
  client: string
  segment: string
  offer: string
  status: 'Draft' | 'Ready' | 'Live'
  nextStep: string
}

export type ChatQualificationFlow = {
  id: string
  audience: string
  openingPrompt: string
  qualificationChecks: string[]
  route: string
}

export type SmsOptInCampaign = {
  id: string
  client: string
  trigger: string
  offer: string
  optInCopy: string
}

export type CtaTest = {
  id: string
  client: string
  control: string
  variant: string
  targetMetric: string
  note: string
}

export type LostDealReason = {
  id: string
  reason: string
  count: number
  recommendation: string
}

export type WeeklyDigestItem = {
  id: string
  client: string
  win: string
  risk: string
  nextMove: string
}

export type MissedCallAutomation = {
  id: string
  client: string
  trigger: string
  textReply: string
  fallback: string
}

export type SearchIntentBrief = {
  id: string
  keyword: string
  intent: 'Transactional' | 'Commercial' | 'Informational'
  angle: string
  cta: string
}

export type AudienceOverlapInsight = {
  id: string
  audienceA: string
  audienceB: string
  overlapRate: number
  action: string
}

export type ApprovalQueueItem = {
  id: string
  client: string
  asset: string
  owner: string
  status: 'Waiting' | 'In Review' | 'Approved' | 'Blocked'
  blocker?: string
}

export type SuccessPlan = {
  id: string
  client: string
  revenueTarget: string
  milestone: string
  owner: string
  status: 'On Track' | 'Watch' | 'At Risk'
}

export type IndustryIntakeTemplate = {
  id: string
  industry: string
  fields: string[]
  qualifier: string
}

export type AttributionCaptureRule = {
  id: string
  touchpoint: string
  dataPoints: string[]
  value: string
}

export type ProofAsset = {
  id: string
  client: string
  assetType: 'Review' | 'Testimonial' | 'Case Study'
  status: 'Draft' | 'Ready' | 'Live'
  useCase: string
}

export type ReactivationTask = {
  id: string
  company: string
  staleDays: number
  reason: string
  nextStep: string
}

export type PipelineProjection = {
  id: string
  period: string
  projectedLeads: number
  projectedRevenue: number
  confidence: 'High' | 'Medium' | 'Low'
}

export type NurtureWorkflow = {
  id: string
  stage: string
  trigger: string
  sequence: string[]
  goal: string
}

export type LocalSeoTemplate = {
  id: string
  locationType: string
  modules: string[]
  cta: string
  note: string
}

export type RetargetingSequence = {
  id: string
  audience: string
  messageByWindow: string[]
  goal: string
}

export type StrategyRecap = {
  id: string
  client: string
  recapTitle: string
  wins: string
  nextPriority: string
}

export type CommunicationTimelineItem = {
  id: string
  client: string
  date: string
  event: string
  owner: string
}

export type LeadMagnetItem = {
  id: string
  title: string
  format: string
  audience: string
  cta: string
}

export type FormRecoveryFlow = {
  id: string
  trigger: string
  recoveryStep: string
  delay: string
  goal: string
}

export type MobileAuditItem = {
  id: string
  area: string
  issue: string
  impact: string
}

export type SalesHandoffSummary = {
  id: string
  company: string
  fit: string
  context: string
  nextStep: string
}

export type BenchmarkAlert = {
  id: string
  client: string
  metric: string
  variance: string
  action: string
}

export type NoShowRecoveryFlow = {
  id: string
  trigger: string
  sequence: string[]
  goal: string
}

export type ContentRefreshOpportunity = {
  id: string
  page: string
  client: string
  issue: string
  action: string
}

export type KeywordAlert = {
  id: string
  campaign: string
  keyword: string
  spend: string
  issue: string
}

export type RequestCenterItem = {
  id: string
  client: string
  request: string
  source: string
  owner: string
}

export type ChurnRiskItem = {
  id: string
  client: string
  risk: 'High' | 'Medium' | 'Low'
  signal: string
  recommendation: string
}

export type SocialProofBlock = {
  id: string
  page: string
  proofType: string
  headline: string
  supportingText: string
}

export type ConsentPrompt = {
  id: string
  trigger: string
  prompt: string
  compliantFor: string
}

export type MessageMatchScore = {
  id: string
  campaign: string
  landingPage: string
  score: number
  gap: string
}

export type WinPattern = {
  id: string
  industry: string
  channel: string
  offer: string
  pattern: string
}

export type GoalVarianceAlert = {
  id: string
  client: string
  metric: string
  target: string
  actual: string
  action: string
}

export type ReviewAutomation = {
  id: string
  trigger: string
  sequence: string[]
  outcome: string
}

export type ContentGap = {
  id: string
  competitor: string
  topic: string
  opportunity: string
}

export type RevenuePerLeadRow = {
  id: string
  campaign: string
  leads: number
  revenuePerLead: number
  note: string
}

export type CrossSellJourney = {
  id: string
  client: string
  currentService: string
  nextOffer: string
  trigger: string
}

export type PostPurchaseSequence = {
  id: string
  stage: string
  assets: string[]
  goal: string
}

export type HeatmapInsight = {
  id: string
  page: string
  hotZone: string
  missedArea: string
  recommendation: string
}

export type CheckoutFrictionItem = {
  id: string
  step: string
  friction: string
  impact: string
}

export type GuaranteeSection = {
  id: string
  offer: string
  guarantee: string
  useCase: string
}

export type PageSpeedOpportunity = {
  id: string
  page: string
  issue: string
  expectedImpact: string
}

export type OfferPackagingOption = {
  id: string
  packageName: string
  positioning: string
  idealFor: string
}

export type DealHealthRow = {
  id: string
  company: string
  health: 'Strong' | 'Watch' | 'At Risk'
  signal: string
  action: string
}

export type PersonaTag = {
  id: string
  persona: string
  traits: string[]
  bestOffer: string
}

export type ExpansionOpportunity = {
  id: string
  client: string
  currentService: string
  expansionPath: string
  reason: string
}

export type SourceRevenueRow = {
  id: string
  source: string
  leads: number
  revenue: number
  summary: string
}

export type LandingPageLeaderboardRow = {
  id: string
  page: string
  conversionRate: number
  primarySource: string
  note: string
}

export type CallbackSequence = {
  id: string
  stage: string
  trigger: string
  sequence: string[]
}

export type MicroConversionPrompt = {
  id: string
  placement: string
  prompt: string
  goal: string
}

export type ProofSequence = {
  id: string
  pageType: string
  firstProof: string
  secondProof: string
  rationale: string
}

export type SalesVelocityBenchmark = {
  id: string
  segment: string
  averageDays: number
  note: string
}

export type LeadQualityTrend = {
  id: string
  month: string
  high: number
  medium: number
  low: number
}

export type EnrichmentSubmissionFlow = {
  id: string
  trigger: string
  enrichments: string[]
  outcome: string
}

export type CtaConsistencyCheck = {
  id: string
  page: string
  currentCta: string
  suggestedCta: string
  reason: string
}

export type AttributionViewRow = {
  id: string
  channel: string
  firstTouch: number
  lastTouch: number
  multiTouch: number
}

export type ClientRoadmapIdea = {
  id: string
  client: string
  focus: string
  ideas: string[]
}

export type RetentionMilestone = {
  id: string
  client: string
  milestone: string
  status: 'Strong' | 'Watch' | 'At Risk'
  note: string
}

export type ResponseTimeRow = {
  id: string
  channel: string
  avgMinutes: number
  slaTargetMinutes: number
  missedRate: number
}

export type BuyerObjectionPrompt = {
  id: string
  objection: string
  prompt: string
  bestUse: string
}

export type ProofComparisonModule = {
  id: string
  module: string
  proofTypes: string[]
  bestFor: string
  conversionGoal: string
}

export type OpportunityAgingRow = {
  id: string
  stage: string
  healthyDays: number
  agingDays: number
  atRiskCount: number
}

export type ContentRoiRow = {
  id: string
  asset: string
  influencedLeads: number
  opportunities: number
  estimatedRevenue: number
}

export type ApprovalReminder = {
  id: string
  client: string
  blocker: string
  owner: string
  daysOpen: number
}

export type CaseStudyWorkflowItem = {
  id: string
  client: string
  stage: string
  proofAngle: string
  owner: string
}

export type OfflineConversionImportRow = {
  id: string
  source: string
  matchedConversions: number
  matchRate: number
  revenue: number
}

export type ProposalAddon = {
  id: string
  client: string
  gap: string
  addon: string
  valueCase: string
}

export type CustomerEducationAsset = {
  id: string
  stage: string
  asset: string
  audience: string
  goal: string
}

export const personalizationRules: PersonalizationRule[] = [
  {
    id: 'rule-1',
    audience: 'Paid search visitors',
    trigger: 'Source contains Google Ads or Paid Search',
    pageElement: 'Hero headline + CTA',
    recommendation: 'Swap to pain-point-first messaging with a fast-call CTA and proof from recent revenue wins.',
  },
  {
    id: 'rule-2',
    audience: 'SEO visitors',
    trigger: 'Acquisition channel is SEO or Organic',
    pageElement: 'Mid-page conversion block',
    recommendation: 'Lead with educational proof, benchmark data, and a softer CTA like a checklist or audit download.',
  },
  {
    id: 'rule-3',
    audience: 'Retargeting traffic',
    trigger: 'Campaign includes retargeting or remarketing',
    pageElement: 'Offer stack',
    recommendation: 'Use stronger social proof, limited-time bonuses, and a direct booking CTA for warm visitors.',
  },
  {
    id: 'rule-4',
    audience: 'Outbound traffic',
    trigger: 'Source is outbound or cold email',
    pageElement: 'Opening section',
    recommendation: 'Mirror the outreach promise on-page so the landing experience matches the outbound pitch exactly.',
  },
  {
    id: 'rule-5',
    audience: 'High-value enterprise accounts',
    trigger: 'Company size or deal size flags a strategic account',
    pageElement: 'Case study and ROI section',
    recommendation: 'Show enterprise proof, implementation support, and a stakeholder-ready ROI narrative.',
  },
]

export const competitorAdSignals: CompetitorAdSignal[] = [
  {
    id: 'comp-1',
    competitor: 'Pipeline Pilot',
    channel: 'LinkedIn Ads',
    angle: 'Revenue team alignment',
    offer: 'Free GTM scorecard',
    suggestedResponse: 'Counter with a stronger qualification promise and a clearer implementation outcome.',
  },
  {
    id: 'comp-2',
    competitor: 'ScaleLabs',
    channel: 'Meta Ads',
    angle: 'Fast lead generation wins',
    offer: '30-day funnel sprint',
    suggestedResponse: 'Differentiate with proof around lead quality and closed revenue, not just speed.',
  },
  {
    id: 'comp-3',
    competitor: 'GrowthForge',
    channel: 'Google Ads',
    angle: 'SEO + paid blended growth',
    offer: 'Free channel mix audit',
    suggestedResponse: 'Position bundled reporting and client-ready deliverables as your advantage.',
  },
  {
    id: 'comp-4',
    competitor: 'DemandCore',
    channel: 'YouTube',
    angle: 'Founder-led education',
    offer: 'On-demand webinar funnel',
    suggestedResponse: 'Answer with shorter, proof-driven creative tailored to your best-fit ICP.',
  },
]

export const campaignLaunchCalendar: CampaignLaunchItem[] = [
  {
    id: 'launch-1',
    campaign: 'Spring Demo Push',
    client: 'Acme Co',
    channel: 'Google Ads',
    owner: 'Paid Media',
    launchDate: '2026-04-08',
    status: 'Ready to Launch',
  },
  {
    id: 'launch-2',
    campaign: 'Q2 Win-Back Flow',
    client: 'Northstar Health',
    channel: 'Email',
    owner: 'Lifecycle',
    launchDate: '2026-04-10',
    status: 'Needs Approval',
  },
  {
    id: 'launch-3',
    campaign: 'Local Expansion Pages',
    client: 'Summit Dental',
    channel: 'SEO',
    owner: 'Content',
    launchDate: '2026-04-15',
    status: 'Planning',
  },
  {
    id: 'launch-4',
    campaign: 'ABM Reactivation Sprint',
    client: 'Signal Stack',
    channel: 'LinkedIn Ads',
    owner: 'Strategy',
    launchDate: '2026-04-18',
    status: 'Planning',
  },
  {
    id: 'launch-5',
    campaign: 'Referral Revival',
    client: 'Blue Peak',
    channel: 'Referral',
    owner: 'Account Lead',
    launchDate: '2026-04-22',
    status: 'Live',
  },
]

export const objectionWidgets: ObjectionWidget[] = [
  {
    id: 'obj-1',
    audience: 'Paid search landing pages',
    objection: 'This sounds expensive compared with hiring in-house.',
    response: 'Show a short ROI comparison between in-house hiring cost and campaign revenue velocity.',
    suggestedPlacement: 'Pricing block',
  },
  {
    id: 'obj-2',
    audience: 'Outbound demo pages',
    objection: 'I am not sure this will work for our niche.',
    response: 'Surface industry-specific case studies and a niche-fit explanation beside the CTA.',
    suggestedPlacement: 'Below the hero CTA',
  },
  {
    id: 'obj-3',
    audience: 'Retargeting traffic',
    objection: 'We already tried an agency before.',
    response: 'Add a “Why clients switch to us” module focused on process clarity, reporting, and accountability.',
    suggestedPlacement: 'Trust section',
  },
  {
    id: 'obj-4',
    audience: 'SEO service pages',
    objection: 'This will probably take too long to pay off.',
    response: 'Pair long-term SEO outcomes with near-term conversion wins and reporting checkpoints.',
    suggestedPlacement: 'Timeline section',
  },
]

export const creativeApprovalQueue: CreativeApprovalItem[] = [
  {
    id: 'approval-1',
    client: 'Acme Co',
    campaign: 'Spring Demo Push',
    assetType: 'Video ad set',
    owner: 'Creative Lead',
    status: 'In Review',
    dueDate: '2026-04-09',
  },
  {
    id: 'approval-2',
    client: 'Northstar Health',
    campaign: 'Q2 Retargeting Burst',
    assetType: 'Static ad variations',
    owner: 'Paid Media',
    status: 'Needs Revisions',
    dueDate: '2026-04-11',
  },
  {
    id: 'approval-3',
    client: 'Blue Peak',
    campaign: 'Referral Revival',
    assetType: 'Email creative',
    owner: 'Lifecycle',
    status: 'Approved',
    dueDate: '2026-04-07',
  },
  {
    id: 'approval-4',
    client: 'Signal Stack',
    campaign: 'ABM Reactivation Sprint',
    assetType: 'LinkedIn carousel',
    owner: 'Strategy',
    status: 'Drafting',
    dueDate: '2026-04-13',
  },
]

export const clientDecisionLog: ClientDecision[] = [
  {
    id: 'decision-1',
    client: 'Acme Co',
    decision: 'Shift 20% of search budget into branded retargeting for faster demo capture.',
    owner: 'Account Director',
    decidedOn: '2026-04-02',
    impact: 'High',
  },
  {
    id: 'decision-2',
    client: 'Northstar Health',
    decision: 'Delay landing page rebuild and prioritize nurture automation first.',
    owner: 'Strategist',
    decidedOn: '2026-04-01',
    impact: 'Medium',
  },
  {
    id: 'decision-3',
    client: 'Summit Dental',
    decision: 'Roll out location pages in batches instead of launching all cities at once.',
    owner: 'SEO Lead',
    decidedOn: '2026-03-29',
    impact: 'Medium',
  },
  {
    id: 'decision-4',
    client: 'Blue Peak',
    decision: 'Keep referral offer simple and avoid layered reward complexity in Q2.',
    owner: 'Client Success',
    decidedOn: '2026-03-27',
    impact: 'Low',
  },
]

export const valueCalculatorScenarios: ValueCalculatorScenario[] = [
  {
    id: 'calc-1',
    audience: 'B2B lead generation pages',
    metric: 'Qualified demos per month',
    baseline: '18 demos at 15% close rate',
    uplift: 'Increase to 26 demos at the same close rate',
    pitch: 'Shows the monthly revenue lift from improving traffic-to-demo conversion before changing sales capacity.',
  },
  {
    id: 'calc-2',
    audience: 'SEO service pages',
    metric: 'Organic leads generated',
    baseline: '35 leads per month',
    uplift: 'Raise to 50 leads through content + CRO',
    pitch: 'Frames SEO as pipeline growth instead of rankings alone.',
  },
  {
    id: 'calc-3',
    audience: 'Retention offers',
    metric: 'Customer churn rate',
    baseline: '6% monthly churn',
    uplift: 'Reduce churn to 4.5%',
    pitch: 'Quantifies how small retention gains create large annual revenue impact.',
  },
]

export const roadmapMilestones: RoadmapMilestone[] = [
  {
    id: 'milestone-1',
    client: 'Acme Co',
    milestone: 'Launch retargeting funnel and booking page refresh',
    dueDate: '2026-04-12',
    owner: 'Paid Media',
    status: 'In Progress',
  },
  {
    id: 'milestone-2',
    client: 'Northstar Health',
    milestone: 'Ship nurture automation sequence with reporting handoff',
    dueDate: '2026-04-16',
    owner: 'Lifecycle',
    status: 'Planned',
  },
  {
    id: 'milestone-3',
    client: 'Signal Stack',
    milestone: 'Roll out ABM offer testing sprint',
    dueDate: '2026-04-19',
    owner: 'Strategy',
    status: 'At Risk',
  },
  {
    id: 'milestone-4',
    client: 'Blue Peak',
    milestone: 'Complete referral program relaunch',
    dueDate: '2026-04-05',
    owner: 'Account Lead',
    status: 'Complete',
  },
]

export const referralActivationCampaigns: ReferralCampaign[] = [
  {
    id: 'ref-1',
    client: 'Blue Peak',
    audience: 'Recent promoters and repeat buyers',
    incentive: '$100 account credit for each referred customer',
    status: 'Live',
    nextStep: 'Add post-purchase email invite and referral leaderboard block.',
  },
  {
    id: 'ref-2',
    client: 'Northstar Health',
    audience: 'Patients with 2+ completed visits',
    incentive: 'Free consultation credit for referred family member',
    status: 'Ready',
    nextStep: 'Get legal approval and launch reminder sequence.',
  },
  {
    id: 'ref-3',
    client: 'Acme Co',
    audience: 'Power users and successful implementations',
    incentive: 'Exclusive strategy session for qualified referral',
    status: 'Draft',
    nextStep: 'Clarify advocate qualification criteria and landing page CTA.',
  },
]

export const leadCaptureQuizTemplates: LeadCaptureQuizTemplate[] = [
  {
    id: 'quiz-1',
    title: 'B2B Demo Qualification Quiz',
    audience: 'Service businesses and SaaS demand gen funnels',
    qualificationGoal: 'Identify fit, urgency, budget, and readiness before sales follow-up.',
    steps: ['Business type', 'Monthly lead goal', 'Current funnel problem', 'Budget range', 'Timeline to start'],
    outcome: 'Routes high-fit leads to booking while sending lower-fit leads to nurture.',
  },
  {
    id: 'quiz-2',
    title: 'Local Growth Audit Quiz',
    audience: 'Multi-location and local service brands',
    qualificationGoal: 'Segment by location count, current acquisition mix, and growth bottlenecks.',
    steps: ['Location count', 'Primary channel', 'Lead volume', 'Main blocker', 'Desired growth pace'],
    outcome: 'Creates more relevant follow-up offers and sharper sales handoff notes.',
  },
  {
    id: 'quiz-3',
    title: 'Agency Fit Finder',
    audience: 'Inbound agency lead capture pages',
    qualificationGoal: 'Separate strategic-fit clients from low-intent price shoppers.',
    steps: ['Business model', 'Revenue band', 'Current marketing owner', 'Urgency', 'Preferred next step'],
    outcome: 'Improves form completion while giving the sales team better context.',
  },
]

export const exitIntentOffers: ExitIntentOffer[] = [
  {
    id: 'exit-1',
    offerName: 'Free Funnel Audit',
    trigger: 'Exit detected on pricing or service page after 20+ seconds',
    targetPage: 'Pricing page',
    incentive: 'Instant audit request with 3-point growth diagnosis',
    followUp: 'Send short sales-assist email sequence with case studies.',
  },
  {
    id: 'exit-2',
    offerName: 'Campaign Recovery Checklist',
    trigger: 'Exit detected on paid media landing page',
    targetPage: 'Paid media service page',
    incentive: 'Downloadable checklist with channel triage steps',
    followUp: 'Nurture into booking CTA after content engagement.',
  },
  {
    id: 'exit-3',
    offerName: 'Book a 15-Minute Strategy Call',
    trigger: 'Repeat visit exit on high-intent page',
    targetPage: 'Demo / booking page',
    incentive: 'Fast consult slot with minimal form fields',
    followUp: 'Route directly to calendar and same-day reminder.',
  },
]

export const pricingSensitivityTests: PricingSensitivityTest[] = [
  {
    id: 'pricing-test-1',
    client: 'Acme Co',
    audience: 'Bottom-funnel paid search visitors',
    testFocus: 'Monthly retainer framing vs growth-sprint framing',
    variants: ['Monthly retainer from $4.5k', '90-day growth sprint from $12k'],
    successMetric: 'Qualified call booking rate',
    recommendedRead: 'Use the sprint framing when urgency is high and decision cycles are short.',
  },
  {
    id: 'pricing-test-2',
    client: 'Northstar Health',
    audience: 'Founder-led inbound demo traffic',
    testFocus: 'Price transparency vs custom-quote CTA',
    variants: ['Transparent starting price', 'Custom plan consultation'],
    successMetric: 'Qualified form completion rate',
    recommendedRead: 'Transparent starting prices can improve trust, but only if the offer scope feels concrete.',
  },
  {
    id: 'pricing-test-3',
    client: 'Signal Stack',
    audience: 'ABM landing page visitors',
    testFocus: 'Guarantee-led offer vs case-study-led offer',
    variants: ['Pipeline lift guarantee', 'Enterprise case study proof stack'],
    successMetric: 'Sales accepted opportunities',
    recommendedRead: 'For enterprise buyers, proof often outperforms discounting when risk is the real blocker.',
  },
]

export const proposalFollowUpSequences: ProposalFollowUpSequence[] = [
  {
    id: 'proposal-sequence-1',
    sequence: 'Fast Decision Sequence',
    trigger: 'Proposal sent after discovery call with active timeline',
    channelMix: ['Email day 1', 'SMS day 2', 'Call day 4'],
    timing: '7-day window',
    goal: 'Keep momentum high and remove final objections before the deal cools off.',
  },
  {
    id: 'proposal-sequence-2',
    sequence: 'Stakeholder Alignment Sequence',
    trigger: 'Proposal needs sign-off from founder plus finance or ops',
    channelMix: ['Email day 1', 'Case study resend day 3', 'Loom recap day 5'],
    timing: '10-day window',
    goal: 'Equip the main buyer with internal-facing proof and next-step clarity.',
  },
  {
    id: 'proposal-sequence-3',
    sequence: 'Reactivation Sequence',
    trigger: 'Proposal has gone cold for 14+ days',
    channelMix: ['Value summary email', 'New insight follow-up', 'Breakup email'],
    timing: '6-day window',
    goal: 'Recover stalled deals without sounding repetitive or desperate.',
  },
]

export const sharedGrowthRoadmapItems: SharedGrowthRoadmapItem[] = [
  {
    id: 'roadmap-shared-1',
    client: 'Acme Co',
    quarter: 'Q2 2026',
    priority: 'Launch qualification-first paid search landing pages',
    owner: 'Paid Media Lead',
    status: 'In Progress',
    successMetric: 'Increase qualified demo rate by 20%',
  },
  {
    id: 'roadmap-shared-2',
    client: 'Northstar Health',
    quarter: 'Q2 2026',
    priority: 'Roll out nurture automation for unbooked leads',
    owner: 'Lifecycle Strategist',
    status: 'Planned',
    successMetric: 'Lift follow-up conversion from MQL to SQL',
  },
  {
    id: 'roadmap-shared-3',
    client: 'Blue Peak',
    quarter: 'Q2 2026',
    priority: 'Refresh referral channel offer and landing page proof',
    owner: 'Account Director',
    status: 'Blocked',
    successMetric: 'Double referral lead volume month over month',
  },
  {
    id: 'roadmap-shared-4',
    client: 'Signal Stack',
    quarter: 'Q3 2026',
    priority: 'Expand into SEO demand capture around high-intent use cases',
    owner: 'SEO Lead',
    status: 'Planned',
    successMetric: 'Generate 15 SQLs from new organic entry pages',
  },
]

export const qualificationFormTemplates: QualificationFormTemplate[] = [
  {
    id: 'qual-form-1',
    title: 'Demo Intent Form',
    audience: 'High-intent service buyers',
    fields: ['Business model', 'Monthly lead volume', 'Primary channel', 'Timeline', 'Revenue target'],
    logic: 'Reveal budget and timeline questions only after the visitor selects growth help in the next 90 days.',
    expectedLift: 'Higher completion rate with stronger sales qualification context.',
  },
  {
    id: 'qual-form-2',
    title: 'Local Growth Intake',
    audience: 'Multi-location brands',
    fields: ['Location count', 'Service area', 'Current bookings', 'Top growth blocker', 'Preferred next step'],
    logic: 'Show location-specific follow-ups when the visitor has more than 3 active locations.',
    expectedLift: 'Fewer low-fit submissions and better routing to the right offer.',
  },
  {
    id: 'qual-form-3',
    title: 'Outbound Landing Intake',
    audience: 'Warm outbound traffic',
    fields: ['Team size', 'Current pipeline source', 'Target market', 'Urgency', 'Decision maker'],
    logic: 'Shorter path for executive buyers and a softer nurture path for early-stage researchers.',
    expectedLift: 'More qualified handoffs from outbound campaigns.',
  },
]

export const rescueBanners: RescueBanner[] = [
  {
    id: 'rescue-1',
    page: 'Pricing page',
    trigger: '45 seconds on page without CTA click',
    message: 'Before you leave, grab a quick pricing-fit audit tailored to your growth stage.',
    cta: 'Get the audit',
    audience: 'Bottom-funnel visitors',
  },
  {
    id: 'rescue-2',
    page: 'SEO service page',
    trigger: 'Scroll past 70% with no conversion',
    message: 'See the top 5 SEO wins we would prioritize first for your site.',
    cta: 'Show my SEO wins',
    audience: 'Organic research traffic',
  },
  {
    id: 'rescue-3',
    page: 'Demo page',
    trigger: 'Exit motion after repeat visit',
    message: 'Need a faster option? Book a 15-minute strategy call instead.',
    cta: 'Book the short call',
    audience: 'Repeat high-intent visitors',
  },
]

export const offerTestScenarios: OfferTestScenario[] = [
  {
    id: 'offer-test-1',
    client: 'Acme Co',
    experiment: 'Guarantee-led hero vs benchmark-led hero',
    variants: ['Guaranteed pipeline lift', 'Peer benchmark scorecard'],
    targetMetric: 'Qualified demo rate',
    note: 'Test whether certainty or proof moves high-intent search traffic faster.',
  },
  {
    id: 'offer-test-2',
    client: 'Northstar Health',
    experiment: 'Free audit vs free roadmap',
    variants: ['Get a growth audit', 'Get a 90-day roadmap'],
    targetMetric: 'Form completion rate',
    note: 'Use this to see whether tactical or strategic framing wins.',
  },
  {
    id: 'offer-test-3',
    client: 'Signal Stack',
    experiment: 'Founder consult vs team workshop',
    variants: ['Book founder strategy call', 'Join GTM workshop'],
    targetMetric: 'Sales accepted opportunities',
    note: 'Useful when enterprise buyers want broader buy-in before committing.',
  },
]

export const leadScoringRules: LeadScoringRule[] = [
  { id: 'score-1', rule: 'Closed-won or referred account', points: 30, reason: 'High trust and high intent source.' },
  { id: 'score-2', rule: 'Estimated revenue above $10k', points: 20, reason: 'Higher ACV opportunities deserve faster response.' },
  { id: 'score-3', rule: 'Qualified status reached', points: 15, reason: 'Marketing or sales already validated the fit.' },
  { id: 'score-4', rule: 'SEO or referral sourced lead', points: 10, reason: 'Often indicates stronger inbound intent.' },
  { id: 'score-5', rule: 'No activity for 30+ days', points: -15, reason: 'Decay older records so current pipeline stays prioritized.' },
]

export const leadEnrichmentTasks: LeadEnrichmentTask[] = [
  {
    id: 'enrich-1',
    client: 'Acme Co',
    step: 'Append company size and revenue band',
    source: 'Apollo + site research',
    priority: 'High',
    nextAction: 'Push enriched lead into qualification queue.',
  },
  {
    id: 'enrich-2',
    client: 'Northstar Health',
    step: 'Confirm buying committee roles',
    source: 'LinkedIn + CRM notes',
    priority: 'Medium',
    nextAction: 'Route to strategist for multi-stakeholder follow-up.',
  },
  {
    id: 'enrich-3',
    client: 'Signal Stack',
    step: 'Map technology stack and ad channels',
    source: 'BuiltWith + ad library',
    priority: 'High',
    nextAction: 'Attach technical fit summary to handoff.',
  },
]

export const seoOpportunities: SeoOpportunity[] = [
  {
    id: 'seo-opp-1',
    client: 'Acme Co',
    page: '/seo/medical-billing-leads',
    intent: 'High',
    score: 92,
    action: 'Refresh CTA and internal linking around commercial-intent keywords.',
  },
  {
    id: 'seo-opp-2',
    client: 'Northstar Health',
    page: '/guides/clinic-growth',
    intent: 'Medium',
    score: 78,
    action: 'Add comparison section and richer proof to capture solution-aware traffic.',
  },
  {
    id: 'seo-opp-3',
    client: 'Signal Stack',
    page: '/blog/abm-playbook',
    intent: 'High',
    score: 88,
    action: 'Convert into a cluster hub with product-fit CTA modules.',
  },
]

export const clientRequestItems: ClientRequestItem[] = [
  {
    id: 'request-1',
    client: 'Acme Co',
    request: 'Launch a geo-targeted landing page variant for Dallas.',
    owner: 'Growth Strategist',
    priority: 'High',
    status: 'Queued',
  },
  {
    id: 'request-2',
    client: 'Northstar Health',
    request: 'Update nurture flow copy for the April promo.',
    owner: 'Lifecycle Lead',
    priority: 'Medium',
    status: 'In Progress',
  },
  {
    id: 'request-3',
    client: 'Blue Peak',
    request: 'Add last month performance summary into the client portal.',
    owner: 'Account Manager',
    priority: 'Low',
    status: 'New',
  },
]

export const testimonialCaptureItems: TestimonialCaptureItem[] = [
  {
    id: 'proof-1',
    client: 'Acme Co',
    champion: 'Head of Growth',
    proofType: 'Case Study',
    status: 'Requested',
    nextStep: 'Send interview prompts and ROI proof summary.',
  },
  {
    id: 'proof-2',
    client: 'Northstar Health',
    champion: 'Founder',
    proofType: 'Review',
    status: 'To Ask',
    nextStep: 'Request review after April milestone recap.',
  },
  {
    id: 'proof-3',
    client: 'Signal Stack',
    champion: 'VP Marketing',
    proofType: 'Testimonial',
    status: 'Approved',
    nextStep: 'Publish on landing page and paid social proof block.',
  },
]

export const schedulingWidgetScenarios: SchedulingWidgetScenario[] = [
  {
    id: 'schedule-1',
    audience: 'High-intent paid search leads',
    routing: 'Route directly to 30-minute strategy consult',
    calendarType: 'Sales calendar',
    expectedOutcome: 'More booked calls from bottom-funnel visitors.',
  },
  {
    id: 'schedule-2',
    audience: 'Mid-funnel organic leads',
    routing: 'Offer audit review before full sales call',
    calendarType: 'Strategist calendar',
    expectedOutcome: 'Better qualification without forcing a hard sales motion too early.',
  },
  {
    id: 'schedule-3',
    audience: 'Enterprise or multi-stakeholder accounts',
    routing: 'Send to discovery workshop intake',
    calendarType: 'Account strategy calendar',
    expectedOutcome: 'Higher-quality meetings with the right stakeholders included.',
  },
]

export const geoPersonalizationVariants: GeoPersonalizationVariant[] = [
  {
    id: 'geo-1',
    market: 'Dallas',
    headline: 'Scale Dallas lead volume without wasting paid spend',
    socialProof: 'Featuring a Texas service brand case study',
    cta: 'See the Dallas growth plan',
  },
  {
    id: 'geo-2',
    market: 'Chicago',
    headline: 'Turn Chicago demand into more booked calls',
    socialProof: 'Localized proof from regional healthcare campaigns',
    cta: 'Get the Chicago funnel audit',
  },
  {
    id: 'geo-3',
    market: 'Miami',
    headline: 'Grow Miami pipeline with faster local conversion paths',
    socialProof: 'Highlights bilingual landing page wins',
    cta: 'View the Miami launch brief',
  },
]

export const funnelDropoffSteps: FunnelDropoffStep[] = [
  { id: 'drop-1', step: 'Landing page visit', visitors: 3200, conversionRate: 100, issue: 'Healthy top-of-funnel volume.' },
  { id: 'drop-2', step: 'CTA click', visitors: 760, conversionRate: 24, issue: 'Headline-to-offer match needs work.' },
  { id: 'drop-3', step: 'Form start', visitors: 410, conversionRate: 13, issue: 'Too many fields before intent is clear.' },
  { id: 'drop-4', step: 'Form submit', visitors: 188, conversionRate: 6, issue: 'Biggest loss is happening at qualification friction.' },
  { id: 'drop-5', step: 'Booked call', visitors: 74, conversionRate: 2, issue: 'Scheduling flow needs clearer urgency and trust.' },
]

export const leadRoutingRules: LeadRoutingRule[] = [
  {
    id: 'route-1',
    trigger: 'Lead score above 40 and paid campaign source',
    routeTo: 'Assigned sales rep + instant Slack alert',
    priority: 'High',
    sla: '15 minutes',
  },
  {
    id: 'route-2',
    trigger: 'Organic lead with unclear intent',
    routeTo: 'Lifecycle nurture queue',
    priority: 'Medium',
    sla: '4 hours',
  },
  {
    id: 'route-3',
    trigger: 'Enterprise account or strategic target',
    routeTo: 'Account director and strategist review',
    priority: 'High',
    sla: '30 minutes',
  },
]

export const topicClusters: TopicCluster[] = [
  {
    id: 'cluster-1',
    client: 'Acme Co',
    pillar: 'B2B demo generation',
    supportingTopics: ['demo landing page audits', 'paid search qualification', 'sales handoff speed'],
    goal: 'Capture more high-intent search demand around conversion efficiency.',
  },
  {
    id: 'cluster-2',
    client: 'Northstar Health',
    pillar: 'healthcare clinic growth',
    supportingTopics: ['clinic location pages', 'patient lead funnels', 'local SEO booking flows'],
    goal: 'Create compounding organic traffic from localized healthcare terms.',
  },
  {
    id: 'cluster-3',
    client: 'Signal Stack',
    pillar: 'ABM pipeline growth',
    supportingTopics: ['ABM landing pages', 'outbound-to-demo flows', 'pipeline scoring systems'],
    goal: 'Support enterprise demand capture with more connected content assets.',
  },
]

export const onboardingChecklistItems: OnboardingChecklistItem[] = [
  {
    id: 'onboard-1',
    step: 'Collect analytics, ad platform, and CRM access',
    owner: 'Account Manager',
    status: 'Complete',
    impact: 'Prevents launch delays caused by missing system access.',
  },
  {
    id: 'onboard-2',
    step: 'Confirm offer, ICP, and revenue goals',
    owner: 'Strategist',
    status: 'In Progress',
    impact: 'Keeps campaign and content direction aligned with business outcomes.',
  },
  {
    id: 'onboard-3',
    step: 'Load proof assets and case studies',
    owner: 'Creative Lead',
    status: 'Not Started',
    impact: 'Improves launch quality and conversion trust signals.',
  },
]

export const winBackCampaigns: WinBackCampaign[] = [
  {
    id: 'winback-1',
    client: 'Blue Peak',
    segment: 'Former trial users with high product usage',
    offer: 'Fast-start reactivation credit',
    status: 'Ready',
    nextStep: 'Launch a 3-email win-back sequence with social proof.',
  },
  {
    id: 'winback-2',
    client: 'Acme Co',
    segment: 'Dormant customers from last year campaign',
    offer: 'Free funnel refresh review',
    status: 'Draft',
    nextStep: 'Pair the offer with a short landing page and testimonial block.',
  },
  {
    id: 'winback-3',
    client: 'Northstar Health',
    segment: 'Churned consult leads with incomplete onboarding',
    offer: 'Restart consult at lower-friction entry point',
    status: 'Live',
    nextStep: 'Monitor reply quality and route reactivated leads into nurture.',
  },
]

export const chatQualificationFlows: ChatQualificationFlow[] = [
  {
    id: 'chat-1',
    audience: 'Paid search visitors',
    openingPrompt: 'What are you trying to fix in your funnel right now?',
    qualificationChecks: ['Urgency', 'Budget range', 'Primary channel', 'Desired next step'],
    route: 'Hot leads route to sales, others route to audit or nurture.',
  },
  {
    id: 'chat-2',
    audience: 'Outbound landing visitors',
    openingPrompt: 'Want a fast answer or a deeper strategy review?',
    qualificationChecks: ['Team size', 'Use case', 'Decision maker', 'Timeline'],
    route: 'Segment by urgency into short consult or nurture sequence.',
  },
  {
    id: 'chat-3',
    audience: 'Organic solution-aware visitors',
    openingPrompt: 'Which growth problem matters most right now?',
    qualificationChecks: ['Lead volume', 'Current bottleneck', 'Internal owner', 'Preferred outcome'],
    route: 'Use softer CTA for education-first visitors and harder CTA for ready buyers.',
  },
]

export const smsOptInCampaigns: SmsOptInCampaign[] = [
  {
    id: 'sms-1',
    client: 'Acme Co',
    trigger: 'Form submit without booking',
    offer: 'Fast-start funnel audit',
    optInCopy: 'Text me the audit and next-step recommendations.',
  },
  {
    id: 'sms-2',
    client: 'Northstar Health',
    trigger: 'Missed consult booking flow',
    offer: '15-minute strategy callback',
    optInCopy: 'Send me a text link to book later.',
  },
  {
    id: 'sms-3',
    client: 'Signal Stack',
    trigger: 'High-intent landing page exit',
    offer: 'Enterprise GTM scorecard',
    optInCopy: 'Text me the scorecard and follow-up details.',
  },
]

export const ctaTests: CtaTest[] = [
  {
    id: 'cta-1',
    client: 'Acme Co',
    control: 'Book a demo',
    variant: 'Get a growth plan',
    targetMetric: 'CTA click-through rate',
    note: 'Testing whether strategy framing outperforms sales framing.',
  },
  {
    id: 'cta-2',
    client: 'Northstar Health',
    control: 'Request pricing',
    variant: 'See your likely ROI',
    targetMetric: 'Qualified form starts',
    note: 'Testing outcome-first CTA against price-first intent.',
  },
  {
    id: 'cta-3',
    client: 'Signal Stack',
    control: 'Book your workshop',
    variant: 'See the ABM roadmap',
    targetMetric: 'Sales accepted opportunities',
    note: 'Testing lower-friction research CTA vs direct booking CTA.',
  },
]

export const lostDealReasons: LostDealReason[] = [
  {
    id: 'lost-1',
    reason: 'No clear proof of ROI',
    count: 9,
    recommendation: 'Add stronger case studies, revenue proof, and benchmark reporting into sales flows.',
  },
  {
    id: 'lost-2',
    reason: 'Response time was too slow',
    count: 6,
    recommendation: 'Tighten routing and SLA visibility for new and qualified leads.',
  },
  {
    id: 'lost-3',
    reason: 'Offer felt too broad or unclear',
    count: 8,
    recommendation: 'Clarify offer framing and improve CTA-to-page consistency.',
  },
]

export const weeklyDigestItems: WeeklyDigestItem[] = [
  {
    id: 'digest-1',
    client: 'Acme Co',
    win: 'Qualified lead rate improved after the new landing page launch.',
    risk: 'Search response time is slipping for inbound demo leads.',
    nextMove: 'Tighten routing rules and shift more volume into the top-performing ad set.',
  },
  {
    id: 'digest-2',
    client: 'Northstar Health',
    win: 'Referral channel delivered the strongest close rate this week.',
    risk: 'Nurture flow open rates fell below target.',
    nextMove: 'Refresh message framing and test a shorter CTA path.',
  },
  {
    id: 'digest-3',
    client: 'Signal Stack',
    win: 'ABM landing page engagement increased after proof updates.',
    risk: 'Enterprise follow-up is slowing down after proposal send.',
    nextMove: 'Activate stakeholder follow-up sequence and review sales handoff timing.',
  },
]

export const missedCallAutomations: MissedCallAutomation[] = [
  {
    id: 'missed-1',
    client: 'Acme Co',
    trigger: 'Inbound sales call missed during business hours',
    textReply: 'Sorry we missed you. Want the direct booking link or a quick callback?',
    fallback: 'Escalate to rep if no reply in 30 minutes.',
  },
  {
    id: 'missed-2',
    client: 'Northstar Health',
    trigger: 'After-hours inbound consult call',
    textReply: 'We can help. Reply here and we will text you the next available consult slot.',
    fallback: 'Add the lead to morning callback queue.',
  },
  {
    id: 'missed-3',
    client: 'Signal Stack',
    trigger: 'High-intent account calls from paid campaign number',
    textReply: 'Thanks for reaching out. Want the ABM roadmap or a same-day callback?',
    fallback: 'Notify account strategist directly.',
  },
]

export const searchIntentBriefs: SearchIntentBrief[] = [
  {
    id: 'brief-1',
    keyword: 'b2b demo landing page agency',
    intent: 'Commercial',
    angle: 'Show why qualification-first landing pages outperform generic demo pages.',
    cta: 'Download the landing page benchmark checklist.',
  },
  {
    id: 'brief-2',
    keyword: 'healthcare lead generation strategy',
    intent: 'Informational',
    angle: 'Teach channel mix and compliance-aware conversion tactics for clinics.',
    cta: 'Get the clinic growth roadmap.',
  },
  {
    id: 'brief-3',
    keyword: 'ABM funnel audit',
    intent: 'Transactional',
    angle: 'Offer a direct audit path backed by enterprise-proof examples.',
    cta: 'Request the ABM audit.',
  },
]

export const audienceOverlapInsights: AudienceOverlapInsight[] = [
  {
    id: 'overlap-1',
    audienceA: 'Retargeting visitors',
    audienceB: 'Customer lookalike',
    overlapRate: 42,
    action: 'Split exclusions so warm traffic is not competing with expansion prospecting.',
  },
  {
    id: 'overlap-2',
    audienceA: 'Demo page engagers',
    audienceB: 'CRM qualified leads',
    overlapRate: 36,
    action: 'Remove CRM-qualified leads from demo nurture prospecting.',
  },
  {
    id: 'overlap-3',
    audienceA: 'Broad interest stack',
    audienceB: 'Site visitors 30 days',
    overlapRate: 28,
    action: 'Tighten interest audience and shift budget toward cleaner net-new reach.',
  },
]

export const approvalQueueItems: ApprovalQueueItem[] = [
  {
    id: 'approvalq-1',
    client: 'Acme Co',
    asset: 'Spring paid search landing page',
    owner: 'Creative Lead',
    status: 'Waiting',
  },
  {
    id: 'approvalq-2',
    client: 'Northstar Health',
    asset: 'Referral email refresh',
    owner: 'Lifecycle Strategist',
    status: 'In Review',
  },
  {
    id: 'approvalq-3',
    client: 'Signal Stack',
    asset: 'ABM ad set concepts',
    owner: 'Paid Media Lead',
    status: 'Blocked',
    blocker: 'Need founder sign-off on messaging angle.',
  },
]

export const successPlans: SuccessPlan[] = [
  {
    id: 'success-1',
    client: 'Acme Co',
    revenueTarget: '$250k influenced pipeline this quarter',
    milestone: 'Lift qualified demo rate above 18%',
    owner: 'Account Director',
    status: 'On Track',
  },
  {
    id: 'success-2',
    client: 'Northstar Health',
    revenueTarget: '$120k new patient pipeline this quarter',
    milestone: 'Increase referral lead volume by 30%',
    owner: 'Strategist',
    status: 'Watch',
  },
  {
    id: 'success-3',
    client: 'Signal Stack',
    revenueTarget: '$400k enterprise pipeline this quarter',
    milestone: 'Shorten proposal-to-close cycle by 20%',
    owner: 'Account Lead',
    status: 'At Risk',
  },
]

export const industryIntakeTemplates: IndustryIntakeTemplate[] = [
  {
    id: 'industry-1',
    industry: 'Healthcare',
    fields: ['Location count', 'Patient lead source', 'Compliance constraints', 'New patient goal', 'Booking system'],
    qualifier: 'Best for clinic and provider growth accounts.',
  },
  {
    id: 'industry-2',
    industry: 'B2B SaaS',
    fields: ['Average deal size', 'Current demo volume', 'Sales cycle length', 'Primary acquisition channel', 'ICP'],
    qualifier: 'Built for demo-generation and pipeline-growth teams.',
  },
  {
    id: 'industry-3',
    industry: 'Home Services',
    fields: ['Service area', 'Call volume', 'Seasonality', 'Technician capacity', 'Most profitable service'],
    qualifier: 'Useful for local-service lead capture and routing.',
  },
]

export const attributionCaptureRules: AttributionCaptureRule[] = [
  {
    id: 'attrib-1',
    touchpoint: 'First form submit',
    dataPoints: ['UTM source', 'UTM campaign', 'Landing page', 'Referral source'],
    value: 'Preserves the original acquisition source before later touchpoints muddy reporting.',
  },
  {
    id: 'attrib-2',
    touchpoint: 'Booked call',
    dataPoints: ['Campaign name', 'Offer type', 'Scheduling route'],
    value: 'Links meetings back to the campaign and CTA path that created them.',
  },
  {
    id: 'attrib-3',
    touchpoint: 'Closed-won deal',
    dataPoints: ['Channel', 'Campaign', 'Revenue band', 'Sales owner'],
    value: 'Makes source-to-revenue reporting much easier to trust.',
  },
]

export const proofAssets: ProofAsset[] = [
  {
    id: 'proofasset-1',
    client: 'Acme Co',
    assetType: 'Case Study',
    status: 'Ready',
    useCase: 'Paid search landing pages',
  },
  {
    id: 'proofasset-2',
    client: 'Northstar Health',
    assetType: 'Review',
    status: 'Live',
    useCase: 'Referral and nurture campaigns',
  },
  {
    id: 'proofasset-3',
    client: 'Signal Stack',
    assetType: 'Testimonial',
    status: 'Draft',
    useCase: 'ABM funnel proof section',
  },
]

export const reactivationTasks: ReactivationTask[] = [
  {
    id: 'react-1',
    company: 'Blue Peak',
    staleDays: 67,
    reason: 'Qualified lead never booked after proposal send.',
    nextStep: 'Send reactivation email with a shorter next-step offer.',
  },
  {
    id: 'react-2',
    company: 'Northstar Health',
    staleDays: 41,
    reason: 'Lead engaged with content but stopped replying.',
    nextStep: 'Route into nurture with proof-led follow-up.',
  },
  {
    id: 'react-3',
    company: 'Signal Stack',
    staleDays: 54,
    reason: 'Enterprise opportunity stalled after internal review.',
    nextStep: 'Reopen with stakeholder recap and implementation clarity.',
  },
]

export const pipelineProjections: PipelineProjection[] = [
  {
    id: 'projection-1',
    period: 'May 2026',
    projectedLeads: 42,
    projectedRevenue: 145000,
    confidence: 'Medium',
  },
  {
    id: 'projection-2',
    period: 'June 2026',
    projectedLeads: 48,
    projectedRevenue: 162000,
    confidence: 'High',
  },
  {
    id: 'projection-3',
    period: 'July 2026',
    projectedLeads: 39,
    projectedRevenue: 138000,
    confidence: 'Low',
  },
]

export const nurtureWorkflows: NurtureWorkflow[] = [
  {
    id: 'nurture-1',
    stage: 'New lead',
    trigger: 'Form submit without booking',
    sequence: ['Welcome email', 'Proof email', 'CTA follow-up'],
    goal: 'Move early leads into a booked consult.',
  },
  {
    id: 'nurture-2',
    stage: 'Qualified but stalled',
    trigger: 'Qualified lead inactive for 7 days',
    sequence: ['Case study send', 'Objection handling email', 'Short-call CTA'],
    goal: 'Recover deals before they go cold.',
  },
  {
    id: 'nurture-3',
    stage: 'Proposal sent',
    trigger: 'Proposal open but no reply',
    sequence: ['Value recap', 'Stakeholder proof', 'Breakup note'],
    goal: 'Push opportunities back into a decision cycle.',
  },
]

export const localSeoTemplates: LocalSeoTemplate[] = [
  {
    id: 'local-1',
    locationType: 'City page',
    modules: ['Localized hero', 'Area proof', 'Service map', 'FAQ', 'Call CTA'],
    cta: 'Book the city-specific audit',
    note: 'Built for metro or city pages targeting service-intent queries.',
  },
  {
    id: 'local-2',
    locationType: 'Neighborhood page',
    modules: ['Neighborhood proof', 'Travel/service radius', 'Mini case study', 'Booking CTA'],
    cta: 'See the neighborhood growth plan',
    note: 'Useful when clients compete in tighter local markets.',
  },
  {
    id: 'local-3',
    locationType: 'Multi-location hub',
    modules: ['Location selector', 'Offer block', 'Proof carousel', 'Conversion CTA'],
    cta: 'Choose your nearest location',
    note: 'Good for brands managing multiple locations inside one funnel.',
  },
]

export const retargetingSequences: RetargetingSequence[] = [
  {
    id: 'retarget-1',
    audience: 'Site visitors 0-7 days',
    messageByWindow: ['Reinforce core offer', 'Add social proof', 'Push direct CTA'],
    goal: 'Convert the warmest recent visitors quickly.',
  },
  {
    id: 'retarget-2',
    audience: 'Pricing page visitors 8-21 days',
    messageByWindow: ['Address objections', 'Show ROI proof', 'Offer short consult'],
    goal: 'Recover bottom-funnel traffic that hesitated on pricing.',
  },
  {
    id: 'retarget-3',
    audience: 'Lead magnet downloaders 22-45 days',
    messageByWindow: ['Promote case study', 'Reframe problem', 'Invite to workshop'],
    goal: 'Move warmer education-stage leads into a sales motion.',
  },
]

export const strategyRecaps: StrategyRecap[] = [
  {
    id: 'recap-1',
    client: 'Acme Co',
    recapTitle: 'April Growth Recap',
    wins: 'Qualified lead rate and call bookings both improved after landing page changes.',
    nextPriority: 'Tighten follow-up speed and expand the best-performing paid segment.',
  },
  {
    id: 'recap-2',
    client: 'Northstar Health',
    recapTitle: 'April Growth Recap',
    wins: 'Referral channel efficiency improved and nurture engagement stabilized.',
    nextPriority: 'Refresh SMS opt-in and strengthen local SEO page rollout.',
  },
  {
    id: 'recap-3',
    client: 'Signal Stack',
    recapTitle: 'April Growth Recap',
    wins: 'ABM page engagement rose after proof updates and tighter CTA framing.',
    nextPriority: 'Reduce proposal lag and add more mid-funnel retargeting support.',
  },
]

export const communicationTimelineItems: CommunicationTimelineItem[] = [
  {
    id: 'timeline-1',
    client: 'Acme Co',
    date: '2026-04-02',
    event: 'Quarterly growth planning call completed',
    owner: 'Account Director',
  },
  {
    id: 'timeline-2',
    client: 'Northstar Health',
    date: '2026-04-05',
    event: 'Client approved referral campaign refresh',
    owner: 'Strategist',
  },
  {
    id: 'timeline-3',
    client: 'Signal Stack',
    date: '2026-04-08',
    event: 'Proposal follow-up review shared with buying committee',
    owner: 'Account Lead',
  },
]

export const leadMagnetItems: LeadMagnetItem[] = [
  { id: 'magnet-1', title: 'Paid Funnel Audit Checklist', format: 'Checklist', audience: 'Paid media buyers', cta: 'Download the audit' },
  { id: 'magnet-2', title: '90-Day Growth Roadmap', format: 'PDF guide', audience: 'Founder-led service businesses', cta: 'Get the roadmap' },
  { id: 'magnet-3', title: 'SEO Opportunity Scorecard', format: 'Worksheet', audience: 'Organic growth teams', cta: 'See your SEO score' },
]

export const formRecoveryFlows: FormRecoveryFlow[] = [
  { id: 'recover-1', trigger: 'Form started but email not submitted', recoveryStep: 'Email reminder with saved progress link', delay: '30 minutes', goal: 'Recover warm submissions quickly.' },
  { id: 'recover-2', trigger: 'Booking form abandoned after time-slot view', recoveryStep: 'Text reminder with simplified booking CTA', delay: '2 hours', goal: 'Get the lead back into the calendar flow.' },
  { id: 'recover-3', trigger: 'Long intake form abandoned after 50% completion', recoveryStep: 'Offer shorter consult form', delay: '24 hours', goal: 'Reduce friction and save partial intent.' },
]

export const mobileAuditItems: MobileAuditItem[] = [
  { id: 'mobile-1', area: 'Hero section', issue: 'Primary CTA sits below first viewport', impact: 'Lower mobile CTA clicks from paid traffic.' },
  { id: 'mobile-2', area: 'Form layout', issue: 'Too many stacked fields before value is clear', impact: 'High abandonment on mobile form starts.' },
  { id: 'mobile-3', area: 'Proof section', issue: 'Case study cards are hard to scan on small screens', impact: 'Lower trust reinforcement before conversion.' },
]

export const salesHandoffSummaries: SalesHandoffSummary[] = [
  { id: 'handoff-1', company: 'Acme Co', fit: 'Strong paid search fit with enterprise budget', context: 'Searching for faster demo qualification and cleaner reporting.', nextStep: 'Lead with ROI proof and implementation speed.' },
  { id: 'handoff-2', company: 'Northstar Health', fit: 'Mid-market healthcare growth team', context: 'Needs localized lead capture and nurture support.', nextStep: 'Anchor on patient pipeline lift and compliance-aware execution.' },
  { id: 'handoff-3', company: 'Signal Stack', fit: 'ABM-focused SaaS team', context: 'Needs stronger sales handoff and enterprise funnel consistency.', nextStep: 'Use case studies and stakeholder-ready planning materials.' },
]

export const benchmarkAlerts: BenchmarkAlert[] = [
  { id: 'alert-1', client: 'Acme Co', metric: 'Qualified rate', variance: '-12 points vs portfolio average', action: 'Review landing page alignment and lead scoring thresholds.' },
  { id: 'alert-2', client: 'Northstar Health', metric: 'Response speed', variance: '+9 hours slower than target', action: 'Tighten routing and missed-call recovery workflows.' },
  { id: 'alert-3', client: 'Signal Stack', metric: 'Proposal close rate', variance: '-8 points vs top cohort', action: 'Strengthen proposal follow-up and proof packaging.' },
]

export const noShowRecoveryFlows: NoShowRecoveryFlow[] = [
  { id: 'noshow-1', trigger: 'Consult no-show after confirmed booking', sequence: ['Immediate apology email', 'SMS reschedule link', '24-hour reminder'], goal: 'Recover booked meetings before intent cools.' },
  { id: 'noshow-2', trigger: 'Workshop no-show from enterprise account', sequence: ['Stakeholder recap', 'New scheduling options', 'Direct strategist follow-up'], goal: 'Preserve high-value opportunities with low friction.' },
  { id: 'noshow-3', trigger: 'Demo no-show from paid campaign lead', sequence: ['Case study follow-up', 'One-click reschedule', 'Breakup note'], goal: 'Turn missed meetings into recovered pipeline.' },
]

export const contentRefreshOpportunities: ContentRefreshOpportunity[] = [
  { id: 'refresh-1', page: '/blog/landing-page-benchmarks', client: 'Acme Co', issue: 'Traffic is strong but CTA is outdated', action: 'Refresh CTA and insert newer proof modules.' },
  { id: 'refresh-2', page: '/guides/clinic-growth-strategy', client: 'Northstar Health', issue: 'Ranks well but lacks commercial-intent sections', action: 'Add comparison block and consult CTA.' },
  { id: 'refresh-3', page: '/resources/abm-playbook', client: 'Signal Stack', issue: 'Engagement is good but conversion path is weak', action: 'Add roadmap download and tighter internal links.' },
]

export const keywordAlerts: KeywordAlert[] = [
  { id: 'keyword-1', campaign: 'Demo Push', keyword: 'cheap lead gen agency', spend: '$1,240', issue: 'Low-intent query draining spend without qualified conversions.' },
  { id: 'keyword-2', campaign: 'Clinic Growth Search', keyword: 'free patient leads', spend: '$860', issue: 'High click volume but poor fit for sales-qualified opportunities.' },
  { id: 'keyword-3', campaign: 'ABM Search', keyword: 'what is abm software', spend: '$540', issue: 'Informational intent too early for current offer mix.' },
]

export const requestCenterItems: RequestCenterItem[] = [
  { id: 'reqcenter-1', client: 'Acme Co', request: 'Need a new paid landing page for a niche offer', source: 'Slack', owner: 'Strategist' },
  { id: 'reqcenter-2', client: 'Northstar Health', request: 'Update referral sequence before next campaign launch', source: 'Email', owner: 'Lifecycle Lead' },
  { id: 'reqcenter-3', client: 'Signal Stack', request: 'Add ABM recap to next stakeholder meeting deck', source: 'Meeting notes', owner: 'Account Lead' },
]

export const churnRiskItems: ChurnRiskItem[] = [
  { id: 'churn-1', client: 'Blue Peak', risk: 'High', signal: 'Low engagement and no recent wins shared with the client.', recommendation: 'Ship a fast-win recap and proactive retention plan.' },
  { id: 'churn-2', client: 'Northstar Health', risk: 'Medium', signal: 'Mixed lead quality and slower reply speed.', recommendation: 'Tighten routing and surface one clear growth initiative.' },
  { id: 'churn-3', client: 'Acme Co', risk: 'Low', signal: 'Healthy win rate and recent roadmap progress.', recommendation: 'Maintain cadence and tee up expansion motion.' },
]

export const socialProofBlocks: SocialProofBlock[] = [
  { id: 'proofblock-1', page: 'Project landing page', proofType: 'Case study', headline: 'How one Gurugram launch improved site visits by 32%', supportingText: 'Use project-specific ROI and booking proof above the fold.' },
  { id: 'proofblock-2', page: 'Retargeting page', proofType: 'Testimonials', headline: 'Buyer trust from recent homeowners and investors', supportingText: 'Stack short trust quotes near the CTA and pricing context.' },
  { id: 'proofblock-3', page: 'Luxury project page', proofType: 'Brand logos', headline: 'Trusted by leading Delhi NCR developers', supportingText: 'Use recognizable developer and channel-partner proof blocks.' },
]

export const consentPrompts: ConsentPrompt[] = [
  { id: 'consent-1', trigger: 'Before form submit', prompt: 'I agree to be contacted on phone, SMS, WhatsApp, and email regarding this property.', compliantFor: 'Real-estate lead capture forms' },
  { id: 'consent-2', trigger: 'Before WhatsApp opt-in', prompt: 'Send me project updates and callback details on WhatsApp.', compliantFor: 'Messaging-first follow-up flows' },
  { id: 'consent-3', trigger: 'Before gated asset download', prompt: 'I agree to receive market insights and campaign updates.', compliantFor: 'Lead magnet and nurture entry points' },
]

export const messageMatchScores: MessageMatchScore[] = [
  { id: 'match-1', campaign: 'Gurugram Luxury Apartments', landingPage: '/gurugram-luxury-residences', score: 82, gap: 'Strong match, but ad promise could be mirrored more clearly in hero CTA.' },
  { id: 'match-2', campaign: 'Dwarka Expressway Search', landingPage: '/dwarka-expressway-projects', score: 61, gap: 'Offer framing on the page is broader than the ad-specific search intent.' },
  { id: 'match-3', campaign: 'Site Visit Retargeting', landingPage: '/book-site-visit', score: 74, gap: 'Retargeting proof is decent, but trust stack needs to appear earlier.' },
]

export const winPatterns: WinPattern[] = [
  { id: 'winpattern-1', industry: 'Luxury Housing', channel: 'Google Ads', offer: 'Site Visit Booking', pattern: 'High-intent search plus fast call routing closes best when proof is above the fold.' },
  { id: 'winpattern-2', industry: 'Residential Real Estate', channel: 'Meta Ads', offer: 'Inventory Update Funnel', pattern: 'Carousel ads with localized proof work best for warm retargeting audiences.' },
  { id: 'winpattern-3', industry: 'Commercial Real Estate', channel: 'Referral', offer: 'Consult + Leasing Brief', pattern: 'Referral-led leads convert better when sales follows up within 30 minutes.' },
]

export const goalVarianceAlerts: GoalVarianceAlert[] = [
  { id: 'variance-1', client: 'Skyline Realty Gurugram', metric: 'Qualified leads', target: '180 / month', actual: '146 / month', action: 'Improve lead scoring and tighten ad-to-page match.' },
  { id: 'variance-2', client: 'Prime Residences Delhi NCR', metric: 'Site visits booked', target: '70 / month', actual: '51 / month', action: 'Strengthen scheduling flow and no-show recovery.' },
  { id: 'variance-3', client: 'Urban Estates Noida', metric: 'Revenue influenced', target: 'INR 2.4Cr', actual: 'INR 1.9Cr', action: 'Shift spend toward best-performing search campaigns and retargeting.' },
]

export const reviewAutomations: ReviewAutomation[] = [
  { id: 'reviewauto-1', trigger: 'Closed-won client milestone reached', sequence: ['Milestone recap email', 'Review request', 'Reminder'], outcome: 'Capture more reviews after visible delivery wins.' },
  { id: 'reviewauto-2', trigger: 'Positive NPS or feedback signal', sequence: ['Thank-you note', 'Testimonial ask', 'Case study interview invite'], outcome: 'Convert happy clients into stronger proof assets.' },
  { id: 'reviewauto-3', trigger: 'Project launch success update', sequence: ['Results summary', 'WhatsApp proof ask', 'Approval follow-up'], outcome: 'Make testimonial collection part of the launch workflow.' },
]

export const contentGaps: ContentGap[] = [
  { id: 'gap-1', competitor: 'Elite Realty Hub', topic: 'Dwarka Expressway investment guide', opportunity: 'Competitor ranks with a detailed investor angle that your site lacks.' },
  { id: 'gap-2', competitor: 'Capital Homes', topic: 'Gurugram luxury project comparison', opportunity: 'Add high-intent comparison content with site-visit CTA modules.' },
  { id: 'gap-3', competitor: 'Metro Properties', topic: 'Noida commercial leasing FAQ', opportunity: 'Publish a deeper leasing FAQ with conversion hooks for business buyers.' },
]

export const revenuePerLeadRows: RevenuePerLeadRow[] = [
  { id: 'rpl-1', campaign: 'Gurugram Luxury Apartments', leads: 164, revenuePerLead: 18200, note: 'Search campaign drives fewer but far higher-value opportunities.' },
  { id: 'rpl-2', campaign: 'Site Visit Retargeting', leads: 243, revenuePerLead: 9400, note: 'Retargeting improves conversion efficiency on existing demand.' },
  { id: 'rpl-3', campaign: 'Broker Referral Network', leads: 96, revenuePerLead: 22100, note: 'Referral quality is high even at lower volume.' },
]

export const crossSellJourneys: CrossSellJourney[] = [
  { id: 'journey-1', client: 'Skyline Realty Gurugram', currentService: 'Lead generation', nextOffer: 'Site visit conversion system', trigger: 'Qualified leads are growing but visit rate is lagging.' },
  { id: 'journey-2', client: 'Prime Residences Delhi NCR', currentService: 'Paid media', nextOffer: 'Reporting + attribution retainer', trigger: 'Leadership wants cleaner revenue visibility.' },
  { id: 'journey-3', client: 'Urban Estates Noida', currentService: 'SEO support', nextOffer: 'Retargeting and nurture automation', trigger: 'Organic demand is rising but follow-up is inconsistent.' },
]

export const postPurchaseSequences: PostPurchaseSequence[] = [
  { id: 'post-1', stage: 'Immediately after conversion', assets: ['Welcome message', 'Next-step guide', 'Point of contact'], goal: 'Reduce confusion right after the lead or client signs.' },
  { id: 'post-2', stage: 'First 7 days', assets: ['Onboarding checklist', 'Proof of progress timeline', 'FAQ'], goal: 'Create confidence and reduce early drop-off.' },
  { id: 'post-3', stage: 'First 30 days', assets: ['Milestone recap', 'Education content', 'Expansion prompt'], goal: 'Reinforce value and prepare the next growth motion.' },
]

export const heatmapInsights: HeatmapInsight[] = [
  { id: 'heat-1', page: '/gurugram-luxury-residences', hotZone: 'Hero proof strip', missedArea: 'Pricing explainer accordion', recommendation: 'Move a shorter trust CTA above the scroll break.' },
  { id: 'heat-2', page: '/book-site-visit', hotZone: 'Project gallery thumbnails', missedArea: 'Calendar CTA below fold', recommendation: 'Bring booking CTA higher and tighten image-to-action flow.' },
  { id: 'heat-3', page: '/dwarka-expressway-projects', hotZone: 'Location benefits section', missedArea: 'Inventory comparison table', recommendation: 'Convert the table into a simplified mobile-first block.' },
]

export const checkoutFrictionItems: CheckoutFrictionItem[] = [
  { id: 'friction-1', step: 'Contact form start', friction: 'Too many fields before value is clear', impact: 'High drop-off before qualification starts.' },
  { id: 'friction-2', step: 'Booking time-slot selection', friction: 'Calendar options load slowly on mobile', impact: 'Warm leads abandon before confirming a visit.' },
  { id: 'friction-3', step: 'Final confirmation', friction: 'Weak trust cues near submit action', impact: 'Users hesitate before committing to the next step.' },
]

export const guaranteeSections: GuaranteeSection[] = [
  { id: 'guarantee-1', offer: 'Site Visit Funnel Setup', guarantee: 'Campaign launch and reporting readiness in 14 days', useCase: 'Useful when speed is a major buying concern.' },
  { id: 'guarantee-2', offer: 'Luxury Project Lead Gen', guarantee: 'Clear lead-quality scoring and routing from week one', useCase: 'Helps reassure teams worried about junk leads.' },
  { id: 'guarantee-3', offer: 'Local SEO Launch', guarantee: 'Priority pages live with measurement and CTA structure included', useCase: 'Good for buyers worried about SEO taking too long to show value.' },
]

export const pageSpeedOpportunities: PageSpeedOpportunity[] = [
  { id: 'speed-1', page: '/gurugram-luxury-residences', issue: 'Large above-the-fold media delaying first interaction', expectedImpact: 'Faster CTA access on mobile paid traffic.' },
  { id: 'speed-2', page: '/book-site-visit', issue: 'Heavy calendar script loading before the hero renders', expectedImpact: 'Better booking-start rate from warm visitors.' },
  { id: 'speed-3', page: '/dwarka-expressway-projects', issue: 'Overloaded comparison modules causing layout shifts', expectedImpact: 'Cleaner engagement and lower bounce rate.' },
]

export const offerPackagingOptions: OfferPackagingOption[] = [
  { id: 'package-1', packageName: 'Project Launch Sprint', positioning: 'Fast setup for a single launch window', idealFor: 'Developers pushing a new inventory block or project launch.' },
  { id: 'package-2', packageName: 'Always-On Lead Engine', positioning: 'Ongoing paid, reporting, and conversion support', idealFor: 'Builders needing steady lead flow across multiple months.' },
  { id: 'package-3', packageName: 'Site Visit Conversion System', positioning: 'Focused on inquiry-to-visit improvement', idealFor: 'Teams with volume but weak down-funnel conversion.' },
]

export const dealHealthRows: DealHealthRow[] = [
  { id: 'dealhealth-1', company: 'Skyline Realty Gurugram', health: 'Strong', signal: 'Fast replies, qualified status, and recent stakeholder engagement.', action: 'Push proposal follow-up and preserve momentum.' },
  { id: 'dealhealth-2', company: 'Prime Residences Delhi NCR', health: 'Watch', signal: 'Good fit but slower replies after first consult.', action: 'Re-engage with proof-led recap and a shorter next step.' },
  { id: 'dealhealth-3', company: 'Urban Estates Noida', health: 'At Risk', signal: 'Proposal is open but activity has dropped for 10+ days.', action: 'Escalate with stakeholder alignment sequence.' },
]

export const personaTags: PersonaTag[] = [
  { id: 'persona-1', persona: 'Luxury project marketer', traits: ['Needs premium positioning', 'Cares about lead quality', 'Wants cleaner reporting'], bestOffer: 'Luxury lead-gen + site visit conversion system' },
  { id: 'persona-2', persona: 'Sales-led builder team', traits: ['Prioritizes speed', 'Needs routing discipline', 'Cares about no-show recovery'], bestOffer: 'Lead routing + scheduling workflow' },
  { id: 'persona-3', persona: 'Local expansion operator', traits: ['Needs location pages', 'Wants stronger local SEO', 'Values attribution clarity'], bestOffer: 'Local SEO + reporting package' },
]

export const expansionOpportunities: ExpansionOpportunity[] = [
  { id: 'expand-1', client: 'Skyline Realty Gurugram', currentService: 'Paid lead generation', expansionPath: 'Add site visit conversion and no-show recovery', reason: 'Lead volume is healthy but booked visit rate is lagging.' },
  { id: 'expand-2', client: 'Prime Residences Delhi NCR', currentService: 'SEO support', expansionPath: 'Add retargeting and nurture automation', reason: 'Organic traffic is growing but paid follow-up is missing.' },
  { id: 'expand-3', client: 'Urban Estates Noida', currentService: 'Reporting retainer', expansionPath: 'Add content and local landing pages', reason: 'Reporting is strong but pipeline growth needs new demand sources.' },
]

export const sourceRevenueRows: SourceRevenueRow[] = [
  { id: 'source-revenue-1', source: 'Google Ads', leads: 380, revenue: 4200000, summary: 'Highest direct revenue contribution from bottom-funnel search demand.' },
  { id: 'source-revenue-2', source: 'Referral', leads: 120, revenue: 2650000, summary: 'Lower volume but highest-quality lead source in the portfolio.' },
  { id: 'source-revenue-3', source: 'SEO', leads: 290, revenue: 3180000, summary: 'Compounding organic source with strong mid-funnel efficiency.' },
]

export const landingPageLeaderboardRows: LandingPageLeaderboardRow[] = [
  { id: 'leader-1', page: '/gurugram-luxury-residences', conversionRate: 18.4, primarySource: 'Google Ads', note: 'Strong ad-to-page match and premium proof stack.' },
  { id: 'leader-2', page: '/book-site-visit', conversionRate: 14.8, primarySource: 'Meta Retargeting', note: 'Warm traffic converts well once the calendar loads cleanly.' },
  { id: 'leader-3', page: '/dwarka-expressway-projects', conversionRate: 12.9, primarySource: 'SEO', note: 'Good organic intent but more proof above the fold could lift conversion.' },
]

export const callbackSequences: CallbackSequence[] = [
  { id: 'callback-1', stage: 'Fresh inquiry', trigger: 'Lead submitted but did not book', sequence: ['5-minute callback attempt', 'WhatsApp prompt', 'Short consult offer'] },
  { id: 'callback-2', stage: 'Qualified lead', trigger: 'Lead reached scoring threshold', sequence: ['Priority callback', 'Case study send', 'Booking CTA'] },
  { id: 'callback-3', stage: 'Warm retargeting lead', trigger: 'Repeat visit without form completion', sequence: ['Soft callback invite', 'Location-specific proof', 'Short call option'] },
]

export const microConversionPrompts: MicroConversionPrompt[] = [
  { id: 'micro-1', placement: 'Hero section', prompt: 'Want a quick callback instead?', goal: 'Capture visitors not ready for a full form.' },
  { id: 'micro-2', placement: 'Pricing section', prompt: 'See if this project fits your budget range', goal: 'Move price-sensitive visitors into a lighter intent step.' },
  { id: 'micro-3', placement: 'Exit banner', prompt: 'Get the latest inventory update on WhatsApp', goal: 'Save demand before the visitor leaves.' },
]

export const proofSequences: ProofSequence[] = [
  { id: 'proofseq-1', pageType: 'Luxury landing page', firstProof: 'Developer brand trust', secondProof: 'Site visit outcomes', rationale: 'Premium buyers want credibility before tactical proof.' },
  { id: 'proofseq-2', pageType: 'Retargeting page', firstProof: 'Testimonials', secondProof: 'Offer guarantee', rationale: 'Warm audiences need reassurance before urgency.' },
  { id: 'proofseq-3', pageType: 'SEO comparison page', firstProof: 'Benchmark data', secondProof: 'Case study', rationale: 'Research-stage visitors respond better to structured evidence first.' },
]

export const salesVelocityBenchmarks: SalesVelocityBenchmark[] = [
  { id: 'velocity-1', segment: 'Luxury housing search leads', averageDays: 11, note: 'Faster cycle when callback happens within 15 minutes.' },
  { id: 'velocity-2', segment: 'Referral-driven buyers', averageDays: 8, note: 'Warm introductions move faster than cold paid traffic.' },
  { id: 'velocity-3', segment: 'Commercial leasing inquiries', averageDays: 19, note: 'Longer sales motion because more stakeholders are involved.' },
]

export const leadQualityTrends: LeadQualityTrend[] = [
  { id: 'quality-1', month: 'January', high: 34, medium: 49, low: 17 },
  { id: 'quality-2', month: 'February', high: 39, medium: 45, low: 16 },
  { id: 'quality-3', month: 'March', high: 43, medium: 42, low: 15 },
]

export const enrichmentSubmissionFlows: EnrichmentSubmissionFlow[] = [
  { id: 'submit-enrich-1', trigger: 'Form submit on project page', enrichments: ['Source attribution', 'Market tag', 'Budget band'], outcome: 'Faster routing and more context for callback teams.' },
  { id: 'submit-enrich-2', trigger: 'Callback request prompt', enrichments: ['Returning visitor status', 'Page depth', 'Preferred project'], outcome: 'Better prioritization for short-form leads.' },
  { id: 'submit-enrich-3', trigger: 'WhatsApp opt-in', enrichments: ['Campaign source', 'Project interest', 'Language preference'], outcome: 'Cleaner nurture handoff and campaign attribution.' },
]

export const ctaConsistencyChecks: CtaConsistencyCheck[] = [
  { id: 'cta-check-1', page: '/blog/gurugram-investor-guide', currentCta: 'Read more projects', suggestedCta: 'Get the investor shortlist', reason: 'Blog CTA should better match the commercial intent of the content.' },
  { id: 'cta-check-2', page: '/resources/site-visit-checklist', currentCta: 'Contact us', suggestedCta: 'Book your site visit', reason: 'Current CTA is too generic for a mid-funnel visitor.' },
  { id: 'cta-check-3', page: '/blog/noida-pricing-trends', currentCta: 'See all services', suggestedCta: 'Get the pricing update', reason: 'Closer CTA alignment should improve content-to-offer conversion.' },
]

export const attributionViewRows: AttributionViewRow[] = [
  { id: 'attrib-view-1', channel: 'Google Ads', firstTouch: 42, lastTouch: 33, multiTouch: 38 },
  { id: 'attrib-view-2', channel: 'SEO', firstTouch: 27, lastTouch: 18, multiTouch: 24 },
  { id: 'attrib-view-3', channel: 'Referral', firstTouch: 14, lastTouch: 29, multiTouch: 21 },
]

export const clientRoadmapIdeas: ClientRoadmapIdea[] = [
  { id: 'road-idea-1', client: 'Skyline Realty Gurugram', focus: 'Improve site visit conversion', ideas: ['Dynamic scheduling', 'No-show recovery', 'Landing page leaderboard'] },
  { id: 'road-idea-2', client: 'Prime Residences Delhi NCR', focus: 'Grow higher-quality paid demand', ideas: ['Message match scoring', 'Keyword alerts', 'Revenue per lead'] },
  { id: 'road-idea-3', client: 'Urban Estates Noida', focus: 'Improve nurture and retention visibility', ideas: ['Lead nurture workflows', 'Retention milestone scorecards', 'Client communication timeline'] },
]

export const retentionMilestones: RetentionMilestone[] = [
  { id: 'ret-milestone-1', client: 'Skyline Realty Gurugram', milestone: 'Quarterly growth recap delivered and acknowledged', status: 'Strong', note: 'Client has clear visibility into wins and next priorities.' },
  { id: 'ret-milestone-2', client: 'Prime Residences Delhi NCR', milestone: 'Lead quality improvement plan agreed', status: 'Watch', note: 'Needs stronger proof that the new plan is improving pipeline value.' },
  { id: 'ret-milestone-3', client: 'Urban Estates Noida', milestone: 'Expansion roadmap discussed before renewal', status: 'At Risk', note: 'Account needs proactive strategic engagement before renewal pressure rises.' },
]

export const intentDriftAlerts = [
  { id: 'intent-1', page: 'Dwarka Expressway luxury projects', signal: 'Time on page is down 18%', alert: 'Review hero message and proof order' },
  { id: 'intent-2', page: 'Noida commercial leasing guide', signal: 'Scroll depth is down 22%', alert: 'Move CTA and buyer proof higher' },
  { id: 'intent-3', page: 'Gurugram possession-ready inventory', signal: 'Click-to-lead rate slipped 9%', alert: 'Refresh offer and booking path' },
]

export const conversionFrictionHeatmap = [
  { id: 'friction-1', step: 'Hero CTA', friction: 'Medium', note: 'Copy is clear, but CTA contrast is weak' },
  { id: 'friction-2', step: 'Form length', friction: 'High', note: 'Too many fields before the first submit' },
  { id: 'friction-3', step: 'Trust section', friction: 'Medium', note: 'Proof is present but not in a persuasive order' },
]

export const staleLeadPriorities = [
  { id: 'stale-1', lead: 'DLF buyer who viewed twice', age: 18, priority: 'Hot', nextAction: 'Call within 30 minutes' },
  { id: 'stale-2', lead: 'Noida investor from Google Ads', age: 24, priority: 'Warm', nextAction: 'Send market comparison brief' },
  { id: 'stale-3', lead: 'Golf Course Road inquiry', age: 31, priority: 'Warm', nextAction: 'Reconnect with a site-visit prompt' },
]

export const anomalySummaries = [
  { id: 'anomaly-1', account: 'Skyline Realty Gurugram', change: '+21% lead quality', narrative: 'Search and landing page changes are improving qualified demand.' },
  { id: 'anomaly-2', account: 'Prime Residences Delhi NCR', change: '-14% response speed', narrative: 'Lead routing is lagging on weekends and needs follow-up coverage.' },
  { id: 'anomaly-3', account: 'Urban Estates Noida', change: '+9% revenue per lead', narrative: 'Smaller lead volume is being offset by stronger qualification.' },
]

export const approvalChaseTasks = [
  { id: 'chase-1', client: 'Skyline Realty Gurugram', blocker: 'Pricing sheet approval', owner: 'Client lead', nextReminder: 'Tomorrow 10:00 AM' },
  { id: 'chase-2', client: 'Prime Residences Delhi NCR', blocker: 'Video testimonial cut', owner: 'Marketing manager', nextReminder: 'Today 4:00 PM' },
  { id: 'chase-3', client: 'Urban Estates Noida', blocker: 'Legal line update', owner: 'Compliance contact', nextReminder: 'Friday 11:30 AM' },
]

export const topicDecaySignals = [
  { id: 'topic-1', topic: 'Gurugram rental yield', trafficChange: '-17%', action: 'Refresh stats and FAQs' },
  { id: 'topic-2', topic: 'Dwarka Expressway amenities', trafficChange: '-12%', action: 'Update comparison table and CTA' },
  { id: 'topic-3', topic: 'Noida office space trends', trafficChange: '-19%', action: 'Add new pricing and location proof' },
]

export const searchQueryRevenueMap = [
  { id: 'query-1', query: 'buy 3 bhk in gurugram', revenue: 9400000, confidence: 'High' },
  { id: 'query-2', query: 'commercial office noida', revenue: 6200000, confidence: 'Medium' },
  { id: 'query-3', query: 'dwarka expressway project', revenue: 11800000, confidence: 'High' },
]

export const renewalCountdownReminders = [
  { id: 'renew-1', client: 'Skyline Realty Gurugram', daysLeft: 38, owner: 'Account lead', note: 'Prepare quarterly recap and renewal story' },
  { id: 'renew-2', client: 'Prime Residences Delhi NCR', daysLeft: 24, owner: 'Strategy lead', note: 'Schedule value review before procurement starts' },
  { id: 'renew-3', client: 'Urban Estates Noida', daysLeft: 61, owner: 'Client success', note: 'Keep account visible with expansion ideas' },
]

export const agencyPlaybookLibrary = [
  { id: 'playbook-1', name: 'Launch sprint template', useCase: 'New project rollouts', steps: ['Intake', 'Offer', 'Landing page', 'Routing'] },
  { id: 'playbook-2', name: 'Lead recovery template', useCase: 'Abandoned or stale demand', steps: ['Alert', 'Sequence', 'Proof', 'Callback'] },
  { id: 'playbook-3', name: 'Retention review template', useCase: 'Monthly client reviews', steps: ['Win', 'Risk', 'Gap', 'Next move'] },
]

export const leadSourceConfidenceScores = [
  { id: 'source-1', source: 'Google Ads', confidence: 92, reason: 'Clean UTM mapping and offline imports' },
  { id: 'source-2', source: 'Meta Ads', confidence: 84, reason: 'Strong lead capture but occasional CRM gaps' },
  { id: 'source-3', source: 'Organic Search', confidence: 76, reason: 'Good source data with some attribution blending' },
]

export const responseTimeRows: ResponseTimeRow[] = [
  { id: 'response-1', channel: 'Meta Lead Ads', avgMinutes: 7, slaTargetMinutes: 10, missedRate: 8 },
  { id: 'response-2', channel: 'Google Search Forms', avgMinutes: 18, slaTargetMinutes: 15, missedRate: 21 },
  { id: 'response-3', channel: 'Landing Page WhatsApp', avgMinutes: 4, slaTargetMinutes: 5, missedRate: 5 },
]

export const buyerObjectionPrompts: BuyerObjectionPrompt[] = [
  { id: 'objection-prompt-1', objection: 'Need more proof this project fits my budget', prompt: 'Show a range-based success story and invite the lead to compare package tiers.', bestUse: 'Luxury and mid-market project pages' },
  { id: 'objection-prompt-2', objection: 'Not ready to talk to sales yet', prompt: 'Offer a market brief, unit mix guide, or price trend snapshot before the hard CTA.', bestUse: 'Top-of-funnel landing pages' },
  { id: 'objection-prompt-3', objection: 'Unsure if this location is right', prompt: 'Surface commuting, appreciation, and inventory comparison prompts tied to the local micro-market.', bestUse: 'Location-focused campaigns' },
]

export const proofComparisonModules: ProofComparisonModule[] = [
  { id: 'proof-compare-1', module: 'Builder credibility stack', proofTypes: ['RERA status', 'Delivered inventory', 'Resident stories'], bestFor: 'New project launch pages', conversionGoal: 'Increase qualified site visits' },
  { id: 'proof-compare-2', module: 'Investor trust panel', proofTypes: ['ROI snapshots', 'Rental yield proof', 'Market absorption data'], bestFor: 'Investor acquisition campaigns', conversionGoal: 'Lift consultation bookings' },
  { id: 'proof-compare-3', module: 'Neighborhood proof wall', proofTypes: ['Travel-time proof', 'School proximity', 'Lifestyle amenities'], bestFor: 'Location-led campaigns', conversionGoal: 'Improve lead-to-visit rate' },
]

export const opportunityAgingRows: OpportunityAgingRow[] = [
  { id: 'aging-1', stage: 'Qualified', healthyDays: 5, agingDays: 11, atRiskCount: 18 },
  { id: 'aging-2', stage: 'Site Visit Scheduled', healthyDays: 7, agingDays: 16, atRiskCount: 12 },
  { id: 'aging-3', stage: 'Negotiation', healthyDays: 10, agingDays: 24, atRiskCount: 9 },
]

export const contentRoiRows: ContentRoiRow[] = [
  { id: 'content-roi-1', asset: 'Dwarka Expressway buyer guide', influencedLeads: 124, opportunities: 28, estimatedRevenue: 5400000 },
  { id: 'content-roi-2', asset: 'Gurugram luxury market update', influencedLeads: 87, opportunities: 19, estimatedRevenue: 3800000 },
  { id: 'content-roi-3', asset: 'Noida commercial leasing checklist', influencedLeads: 61, opportunities: 14, estimatedRevenue: 2100000 },
]

export const approvalReminders: ApprovalReminder[] = [
  { id: 'approval-reminder-1', client: 'DLF Investor Desk', blocker: 'Video walkthrough final cut pending', owner: 'Client marketing lead', daysOpen: 4 },
  { id: 'approval-reminder-2', client: 'Sohna Road Residences', blocker: 'Updated price sheet still missing', owner: 'Project sales ops', daysOpen: 6 },
  { id: 'approval-reminder-3', client: 'Noida Commercial Suites', blocker: 'Landing page legal disclaimer approval', owner: 'Compliance contact', daysOpen: 3 },
]

export const caseStudyWorkflowItems: CaseStudyWorkflowItem[] = [
  { id: 'case-study-1', client: 'Golf Course Extension Launch', stage: 'Interview scheduled', proofAngle: 'Reduced CPL while increasing site visits', owner: 'Strategy team' },
  { id: 'case-study-2', client: 'Noida Investor Funnel', stage: 'Drafting narrative', proofAngle: 'Improved qualification rate from paid search', owner: 'Content team' },
  { id: 'case-study-3', client: 'Dwarka Premium Towers', stage: 'Awaiting approval', proofAngle: 'Better lead-to-visit conversion from offer changes', owner: 'Account manager' },
]

export const offlineConversionImportRows: OfflineConversionImportRow[] = [
  { id: 'offline-1', source: 'Meta CAPI + CRM uploads', matchedConversions: 42, matchRate: 76, revenue: 9200000 },
  { id: 'offline-2', source: 'Google Ads offline imports', matchedConversions: 31, matchRate: 68, revenue: 7100000 },
  { id: 'offline-3', source: 'Broker walk-in reconciliation', matchedConversions: 19, matchRate: 59, revenue: 3400000 },
]

export const proposalAddons: ProposalAddon[] = [
  { id: 'addon-1', client: 'Gurugram Launch Sprint', gap: 'Low-speed lead follow-up on weekends', addon: 'WhatsApp + missed-call recovery automation', valueCase: 'Recover warm demand outside business hours.' },
  { id: 'addon-2', client: 'Noida Investor Growth Plan', gap: 'Weak nurture after guide downloads', addon: 'Lead nurture workflow by funnel stage', valueCase: 'Convert more research-stage leads into consultations.' },
  { id: 'addon-3', client: 'Dwarka Expressway Sales Push', gap: 'Thin proof on landing pages', addon: 'Proof comparison modules and case study publishing', valueCase: 'Increase trust before site-visit booking.' },
]

export const customerEducationAssets: CustomerEducationAsset[] = [
  { id: 'education-1', stage: 'Onboarding', asset: 'Client portal kickoff checklist', audience: 'New retained clients', goal: 'Speed up first 14-day activation' },
  { id: 'education-2', stage: 'Adoption', asset: 'Monthly reporting interpretation guide', audience: 'Marketing and sales stakeholders', goal: 'Improve decision-making in review meetings' },
  { id: 'education-3', stage: 'Renewal', asset: 'Growth wins recap library', audience: 'Client leadership', goal: 'Support renewal and expansion conversations' },
]

export function buildLeadToCloseInsights(leads: Lead[]) {
  const wonLeads = leads.filter((lead) => lead.status === 'closed_won')
  const rows = new Map<ScoreboardChannel, { channel: ScoreboardChannel; deals: number; avgDays: number; revenue: number; totalDays: number }>()

  for (const lead of wonLeads) {
    const channel = classifyLeadChannel(lead)
    const createdAt = new Date(lead.created_at)
    const updatedAt = new Date(lead.updated_at)
    const days = Math.max(1, Math.round((updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)))
    const existing = rows.get(channel) ?? { channel, deals: 0, avgDays: 0, revenue: 0, totalDays: 0 }
    existing.deals += 1
    existing.totalDays += days
    existing.revenue += lead.estimated_revenue ?? 0
    rows.set(channel, existing)
  }

  return Array.from(rows.values())
    .map((row) => ({
      channel: row.channel,
      deals: row.deals,
      avgDays: Math.round(row.totalDays / row.deals),
      revenue: row.revenue,
    }))
    .sort((a, b) => a.avgDays - b.avgDays || b.revenue - a.revenue)
}

export function buildRenewalRiskBriefing(leads: Lead[]) {
  const byCompany = new Map<string, Lead[]>()
  for (const lead of leads) {
    const key = lead.company || 'Unknown company'
    const items = byCompany.get(key) ?? []
    items.push(lead)
    byCompany.set(key, items)
  }

  return Array.from(byCompany.entries())
    .map(([company, companyLeads]) => {
      const lastUpdated = companyLeads
        .map((lead) => new Date(lead.updated_at).getTime())
        .sort((a, b) => b - a)[0]
      const wonCount = companyLeads.filter((lead) => lead.status === 'closed_won').length
      const lostCount = companyLeads.filter((lead) => lead.status === 'closed_lost').length
      const staleDays = Math.round((Date.now() - lastUpdated) / (1000 * 60 * 60 * 24))

      let risk: 'High' | 'Medium' | 'Low' = 'Low'
      let reason = 'Healthy recent activity and positive pipeline signals.'

      if (staleDays > 45 || (lostCount > wonCount && wonCount === 0)) {
        risk = 'High'
        reason = 'Little recent movement or a weak win/loss profile suggests renewal risk.'
      } else if (staleDays > 21 || lostCount >= wonCount) {
        risk = 'Medium'
        reason = 'Engagement is soft or deal quality is mixed, so the account needs attention.'
      }

      return {
        company,
        leadCount: companyLeads.length,
        wonCount,
        lostCount,
        staleDays,
        risk,
        reason,
      }
    })
    .sort((a, b) => {
      const riskScore = { High: 3, Medium: 2, Low: 1 }
      return riskScore[b.risk] - riskScore[a.risk] || b.staleDays - a.staleDays
    })
    .slice(0, 10)
}

export function buildChannelMarginInsights(leads: Lead[]) {
  const assumedCostByChannel: Record<ScoreboardChannel, number> = {
    Ads: 1800,
    Email: 350,
    SEO: 900,
    Outbound: 700,
    Referral: 200,
    Other: 500,
  }

  const grouped = new Map<ScoreboardChannel, { channel: ScoreboardChannel; revenue: number; leads: number }>()

  for (const lead of leads) {
    const channel = classifyLeadChannel(lead)
    const current = grouped.get(channel) ?? { channel, revenue: 0, leads: 0 }
    current.revenue += lead.estimated_revenue ?? 0
    current.leads += 1
    grouped.set(channel, current)
  }

  return Array.from(grouped.values())
    .map((item) => {
      const cost = assumedCostByChannel[item.channel] + item.leads * 45
      const margin = item.revenue - cost
      const marginRate = item.revenue > 0 ? Math.round((margin / item.revenue) * 100) : 0
      return {
        channel: item.channel,
        revenue: item.revenue,
        cost,
        margin,
        marginRate,
      }
    })
    .sort((a, b) => b.margin - a.margin)
}

export function buildExpansionPlaybook(leads: Lead[]) {
  const byCompany = new Map<string, Lead[]>()
  for (const lead of leads) {
    const list = byCompany.get(lead.company) ?? []
    list.push(lead)
    byCompany.set(lead.company, list)
  }

  return Array.from(byCompany.entries())
    .map(([company, items]) => {
      const wonCount = items.filter((item) => item.status === 'closed_won').length
      const qualifiedCount = items.filter((item) => item.status === 'qualified').length
      const hasOrganic = items.some((item) => classifyLeadChannel(item) === 'SEO')
      const hasPaid = items.some((item) => classifyLeadChannel(item) === 'Ads')

      let recommendedMotion = 'Nurture current pipeline before expansion.'
      if (wonCount >= 2 && hasPaid && !hasOrganic) {
        recommendedMotion = 'Expand into SEO or content support to lower paid dependence.'
      } else if (wonCount >= 1 && qualifiedCount >= 1) {
        recommendedMotion = 'Pitch a follow-on upsell tied to conversion optimization or retention.'
      } else if (hasOrganic && !hasPaid) {
        recommendedMotion = 'Layer paid distribution to amplify already-proven organic demand.'
      }

      return {
        company,
        wonCount,
        qualifiedCount,
        recommendedMotion,
      }
    })
    .sort((a, b) => b.wonCount - a.wonCount || b.qualifiedCount - a.qualifiedCount)
    .slice(0, 10)
}

export function buildCohortRetentionReport(leads: Lead[]) {
  const cohorts = new Map<string, { cohort: string; companies: Set<string>; won: number; active: number }>()

  for (const lead of leads) {
    const created = new Date(lead.created_at)
    const cohort = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`
    const current = cohorts.get(cohort) ?? { cohort, companies: new Set<string>(), won: 0, active: 0 }
    current.companies.add(lead.company)
    if (lead.status === 'closed_won') current.won += 1
    if (lead.status !== 'closed_lost') current.active += 1
    cohorts.set(cohort, current)
  }

  return Array.from(cohorts.values())
    .map((cohort) => ({
      cohort: cohort.cohort,
      companies: cohort.companies.size,
      won: cohort.won,
      active: cohort.active,
      retentionRate: cohort.companies.size > 0 ? Math.round((cohort.active / cohort.companies.size) * 100) : 0,
    }))
    .sort((a, b) => a.cohort.localeCompare(b.cohort))
}

export function buildAdTestingVelocity() {
  return [
    { month: 'January', launchedTests: 6, target: 8, note: 'Testing pace lagged because creative approvals slowed down.' },
    { month: 'February', launchedTests: 9, target: 8, note: 'Healthy test velocity created faster learning loops.' },
    { month: 'March', launchedTests: 7, target: 10, note: 'Need more net-new concepts in upper-funnel campaigns.' },
    { month: 'April', launchedTests: 5, target: 10, note: 'Early signal shows testing output is falling behind target.' },
  ]
}

export function buildClientBenchmarkScorecards(leads: Lead[]) {
  const byCompany = new Map<
    string,
    { company: string; total: number; qualified: number; won: number; revenue: number }
  >()

  for (const lead of leads) {
    const current = byCompany.get(lead.company) ?? {
      company: lead.company,
      total: 0,
      qualified: 0,
      won: 0,
      revenue: 0,
    }

    current.total += 1
    if (lead.status === 'qualified' || lead.status === 'closed_won') current.qualified += 1
    if (lead.status === 'closed_won') current.won += 1
    current.revenue += lead.estimated_revenue ?? 0
    byCompany.set(lead.company, current)
  }

  const rows = Array.from(byCompany.values()).map((row) => ({
    company: row.company,
    leads: row.total,
    qualificationRate: row.total > 0 ? Math.round((row.qualified / row.total) * 100) : 0,
    winRate: row.total > 0 ? Math.round((row.won / row.total) * 100) : 0,
    revenuePerLead: row.total > 0 ? Math.round(row.revenue / row.total) : 0,
  }))

  const averageQualificationRate =
    rows.length > 0 ? Math.round(rows.reduce((sum, row) => sum + row.qualificationRate, 0) / rows.length) : 0
  const averageWinRate =
    rows.length > 0 ? Math.round(rows.reduce((sum, row) => sum + row.winRate, 0) / rows.length) : 0
  const averageRevenuePerLead =
    rows.length > 0 ? Math.round(rows.reduce((sum, row) => sum + row.revenuePerLead, 0) / rows.length) : 0

  return rows
    .map((row) => ({
      ...row,
      qualificationDelta: row.qualificationRate - averageQualificationRate,
      winRateDelta: row.winRate - averageWinRate,
      revenueDelta: row.revenuePerLead - averageRevenuePerLead,
    }))
    .sort((a, b) => b.revenuePerLead - a.revenuePerLead || b.winRate - a.winRate)
}

export function buildProposalFollowUpInsights(proposals: Proposal[], leads: Lead[]) {
  const total = proposals.length
  const wonLeadIds = new Set(leads.filter((lead) => lead.status === 'closed_won').map((lead) => lead.id))
  const wonFromProposals = proposals.filter((proposal) => proposal.lead_id && wonLeadIds.has(proposal.lead_id)).length
  const active = proposals.filter((proposal) => proposal.status !== 'accepted' && proposal.status !== 'rejected').length

  return {
    total,
    active,
    wonFromProposals,
    closeRate: total > 0 ? Math.round((wonFromProposals / total) * 100) : 0,
    staleEstimate: Math.max(0, total - active - wonFromProposals),
  }
}

export function buildCustomerAdvocacyScores(leads: Lead[]) {
  const byCompany = new Map<string, Lead[]>()

  for (const lead of leads) {
    const items = byCompany.get(lead.company) ?? []
    items.push(lead)
    byCompany.set(lead.company, items)
  }

  return Array.from(byCompany.entries())
    .map(([company, items]) => {
      const won = items.filter((lead) => lead.status === 'closed_won').length
      const referrals = items.filter((lead) => classifyLeadChannel(lead) === 'Referral').length
      const qualified = items.filter((lead) => lead.status === 'qualified' || lead.status === 'closed_won').length
      const avgRevenue =
        items.length > 0
          ? Math.round(items.reduce((sum, lead) => sum + (lead.estimated_revenue ?? 0), 0) / items.length)
          : 0

      const score = Math.min(100, won * 25 + referrals * 20 + qualified * 8 + (avgRevenue >= 10000 ? 15 : 5))
      const tier = score >= 75 ? 'High' : score >= 45 ? 'Medium' : 'Low'
      const play =
        tier === 'High'
          ? 'Invite this account into referral asks, review capture, and testimonial outreach.'
          : tier === 'Medium'
            ? 'Warm the account with milestone recaps before making an advocacy ask.'
            : 'Focus on delivery wins first, then revisit advocacy once value is more visible.'

      return {
        company,
        score,
        tier,
        won,
        referrals,
        qualified,
        avgRevenue,
        play,
      }
    })
    .sort((a, b) => b.score - a.score || b.avgRevenue - a.avgRevenue)
    .slice(0, 10)
}

export function buildLeadScoringSnapshot(leads: Lead[]) {
  return leads
    .map((lead) => {
      let score = 0
      if (lead.status === 'closed_won') score += 30
      if (lead.status === 'qualified') score += 15
      if ((lead.estimated_revenue ?? 0) >= 10000) score += 20
      const channel = classifyLeadChannel(lead)
      if (channel === 'SEO' || channel === 'Referral') score += 10

      const staleDays = Math.round((Date.now() - new Date(lead.updated_at).getTime()) / (1000 * 60 * 60 * 24))
      if (staleDays >= 30) score -= 15

      const tier = score >= 40 ? 'Hot' : score >= 20 ? 'Warm' : 'Cold'

      return {
        id: lead.id,
        company: lead.company,
        channel,
        score,
        tier,
        status: lead.status,
        estimatedRevenue: lead.estimated_revenue ?? 0,
      }
    })
    .sort((a, b) => b.score - a.score || b.estimatedRevenue - a.estimatedRevenue)
    .slice(0, 12)
}

export function buildForecastAccuracyReport(leads: Lead[]) {
  const windows = [
    { label: 'January', targetLeads: 24, targetRevenue: 90000 },
    { label: 'February', targetLeads: 28, targetRevenue: 110000 },
    { label: 'March', targetLeads: 30, targetRevenue: 120000 },
    { label: 'April', targetLeads: 32, targetRevenue: 130000 },
  ]

  return windows.map((window, index) => {
    const slice = leads.slice(index * 3, index * 3 + 3)
    const actualLeads = slice.length
    const actualRevenue = slice.reduce((sum, lead) => sum + (lead.estimated_revenue ?? 0), 0)

    return {
      period: window.label,
      targetLeads: window.targetLeads,
      actualLeads,
      leadVariance: actualLeads - window.targetLeads,
      targetRevenue: window.targetRevenue,
      actualRevenue,
      revenueVariance: actualRevenue - window.targetRevenue,
    }
  })
}

export function buildConversionLagAnalysis(leads: Lead[]) {
  const grouped = new Map<string, { campaign: string; leads: number; won: number; totalDays: number }>()

  for (const lead of leads) {
    const campaign = lead.campaign_name || lead.lead_source || 'Unattributed campaign'
    const current = grouped.get(campaign) ?? { campaign, leads: 0, won: 0, totalDays: 0 }
    current.leads += 1

    const days = Math.max(
      1,
      Math.round((new Date(lead.updated_at).getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24))
    )
    current.totalDays += days
    if (lead.status === 'closed_won') current.won += 1
    grouped.set(campaign, current)
  }

  return Array.from(grouped.values())
    .map((item) => ({
      campaign: item.campaign,
      leads: item.leads,
      won: item.won,
      averageLagDays: Math.round(item.totalDays / item.leads),
    }))
    .sort((a, b) => b.averageLagDays - a.averageLagDays || b.won - a.won)
    .slice(0, 12)
}

export function buildPipelineSlaSnapshot(leads: Lead[]) {
  return leads
    .map((lead) => {
      const hoursSinceUpdate = Math.max(
        1,
        Math.round((Date.now() - new Date(lead.updated_at).getTime()) / (1000 * 60 * 60))
      )
      const slaHours = lead.status === 'new' ? 1 : lead.status === 'qualified' ? 2 : 6
      const breached = hoursSinceUpdate > slaHours

      return {
        id: lead.id,
        company: lead.company,
        status: lead.status,
        hoursSinceUpdate,
        slaHours,
        breached,
      }
    })
    .sort((a, b) => Number(b.breached) - Number(a.breached) || b.hoursSinceUpdate - a.hoursSinceUpdate)
    .slice(0, 12)
}

export function buildExecutiveKpiSnapshot(leads: Lead[]) {
  const total = leads.length
  const qualified = leads.filter((lead) => lead.status === 'qualified' || lead.status === 'closed_won').length
  const won = leads.filter((lead) => lead.status === 'closed_won').length
  const revenue = leads.reduce((sum, lead) => sum + (lead.estimated_revenue ?? 0), 0)

  return {
    total,
    qualified,
    won,
    revenue,
    qualificationRate: total > 0 ? Math.round((qualified / total) * 100) : 0,
    winRate: total > 0 ? Math.round((won / total) * 100) : 0,
  }
}

export function buildBudgetReallocationRecommendations(leads: Lead[]) {
  const grouped = new Map<ScoreboardChannel, { channel: ScoreboardChannel; leads: number; won: number; revenue: number }>()

  for (const lead of leads) {
    const channel = classifyLeadChannel(lead)
    const current = grouped.get(channel) ?? { channel, leads: 0, won: 0, revenue: 0 }
    current.leads += 1
    if (lead.status === 'closed_won') current.won += 1
    current.revenue += lead.estimated_revenue ?? 0
    grouped.set(channel, current)
  }

  return Array.from(grouped.values())
    .map((item) => {
      const winRate = item.leads > 0 ? Math.round((item.won / item.leads) * 100) : 0
      const recommendation =
        winRate >= 20
          ? 'Increase budget and protect volume.'
          : winRate >= 10
            ? 'Hold steady while testing new creative or landing pages.'
            : 'Reduce spend until quality improves.'

      return {
        channel: item.channel,
        leads: item.leads,
        winRate,
        revenue: item.revenue,
        recommendation,
      }
    })
    .sort((a, b) => b.revenue - a.revenue || b.winRate - a.winRate)
}
