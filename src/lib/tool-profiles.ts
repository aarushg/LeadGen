export type ToolCapability =
  | 'contact-discovery'
  | 'contact-enrichment'
  | 'outreach-automation'
  | 'lead-scoring'
  | 'marketing-automation'
  | 'lead-capture'
  | 'webinar-engagement'
  | 'conversational-engagement'
  | 'callback-automation'
  | 'visitor-intelligence'
  | 'account-intelligence'
  | 'crm-pipeline'
  | 'lead-sync'
  | 'referral-marketing'
  | 'account-based-marketing'
  | 'web-scraping-platform'

export interface ToolFieldDefinition {
  key: string
  label: string
  required: boolean
  example?: string
}

export interface ToolProfile {
  capability: ToolCapability
  recordType: 'contact' | 'account' | 'signal' | 'campaign' | 'conversation' | 'event' | 'sync' | 'deal' | 'page'
  researchBasis: string
  modes: string[]
  inputFields: ToolFieldDefinition[]
  outputFocus: string[]
}

const profileMap: Record<string, ToolProfile> = {
  leadgenscrape: {
    capability: 'web-scraping-platform',
    recordType: 'page',
    researchBasis: 'actor-based scraping, managed proxies, datasets, request queues, integrations, and AI delivery workflows',
    modes: ['actor-planning', 'crawl-design', 'dataset-review'],
    inputFields: [
      { key: 'domain', label: 'Target Domain', required: false, example: 'example.com' },
      { key: 'searchTerm', label: 'Extraction Goal', required: false, example: 'restaurants in Toronto' },
      { key: 'company', label: 'Workflow Context', required: false, example: 'Lead enrichment for Acme' },
    ],
    outputFocus: ['crawl targets', 'data extraction opportunities', 'automation handoff actions'],
  },
  'apify platform': {
    capability: 'web-scraping-platform',
    recordType: 'page',
    researchBasis: 'actor-based scraping, managed proxies, datasets, request queues, integrations, and AI delivery workflows',
    modes: ['actor-planning', 'crawl-design', 'dataset-review'],
    inputFields: [
      { key: 'domain', label: 'Target Domain', required: false, example: 'example.com' },
      { key: 'searchTerm', label: 'Extraction Goal', required: false, example: 'restaurants in Toronto' },
      { key: 'company', label: 'Workflow Context', required: false, example: 'Lead enrichment for Acme' },
    ],
    outputFocus: ['crawl targets', 'data extraction opportunities', 'automation handoff actions'],
  },
  'salesforce marketing cloud': {
    capability: 'marketing-automation',
    recordType: 'campaign',
    researchBasis: 'multi-channel campaign orchestration, audience segmentation, automation, analytics',
    modes: ['journey-design', 'audience-targeting', 'campaign-review'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'domain', label: 'Domain', required: false, example: 'acme.com' },
      { key: 'searchTerm', label: 'Campaign Goal', required: false, example: 'product launch nurture' },
    ],
    outputFocus: ['campaign opportunities', 'engagement signals', 'source-backed next steps'],
  },
  leadfeeder: {
    capability: 'visitor-intelligence',
    recordType: 'account',
    researchBasis: 'website visitor identification, account lists, intent and CRM sync',
    modes: ['visitor-identification', 'account-prioritization', 'signal-review'],
    inputFields: [
      { key: 'domain', label: 'Website Domain', required: false, example: 'acme.com' },
      { key: 'company', label: 'Target Account', required: false, example: 'Acme' },
      { key: 'searchTerm', label: 'Intent Topic', required: false, example: 'pricing' },
    ],
    outputFocus: ['identified accounts', 'intent signals', 'follow-up recommendations'],
  },
  uplead: {
    capability: 'contact-enrichment',
    recordType: 'contact',
    researchBasis: 'email verification, enrichment, firmographics, verified B2B contact data',
    modes: ['email-enrichment', 'contact-verification'],
    inputFields: [{ key: 'email', label: 'Email', required: true, example: 'jane@acme.com' }],
    outputFocus: ['enriched contact record', 'company context', 'verification status'],
  },
  intercom: {
    capability: 'conversational-engagement',
    recordType: 'conversation',
    researchBasis: 'live chat, AI agent, inbox, outbound messaging, support workflows',
    modes: ['conversation-audit', 'message-planning', 'inbound-qualification'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'domain', label: 'Domain', required: false, example: 'acme.com' },
      { key: 'searchTerm', label: 'Conversation Goal', required: false, example: 'demo request' },
    ],
    outputFocus: ['conversation entry points', 'qualification cues', 'handoff actions'],
  },
  hunter: {
    capability: 'contact-discovery',
    recordType: 'contact',
    researchBasis: 'domain search, email finder, email verifier, public email patterns',
    modes: ['domain-search', 'email-pattern-discovery'],
    inputFields: [
      { key: 'domain', label: 'Domain', required: true, example: 'acme.com' },
      { key: 'firstName', label: 'First Name', required: false, example: 'Jane' },
      { key: 'lastName', label: 'Last Name', required: false, example: 'Doe' },
    ],
    outputFocus: ['public emails', 'email patterns', 'source evidence'],
  },
  demio: {
    capability: 'webinar-engagement',
    recordType: 'event',
    researchBasis: 'webinar scheduling, attendee engagement, analytics, follow-up automation',
    modes: ['webinar-planning', 'registration-audit', 'engagement-review'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'searchTerm', label: 'Webinar Topic', required: false, example: 'customer onboarding' },
      { key: 'domain', label: 'Domain', required: false, example: 'acme.com' },
    ],
    outputFocus: ['event signals', 'registration touchpoints', 'follow-up actions'],
  },
  overloop: {
    capability: 'outreach-automation',
    recordType: 'campaign',
    researchBasis: 'multichannel sequences, database prospecting, personalization, outreach analytics',
    modes: ['sequence-planning', 'prospect-research', 'campaign-review'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'targetRole', label: 'Target Role', required: false, example: 'Head of Sales' },
      { key: 'searchTerm', label: 'Sequence Goal', required: false, example: 'demo outbound' },
    ],
    outputFocus: ['prospecting signals', 'sequence-ready contacts', 'next-step plays'],
  },
  'd&b hoovers': {
    capability: 'account-intelligence',
    recordType: 'account',
    researchBasis: 'company intelligence, decision-makers, buying intent, prospect scoring',
    modes: ['account-research', 'buyer-intent-review', 'list-building'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'domain', label: 'Domain', required: false, example: 'acme.com' },
      { key: 'searchTerm', label: 'ICP Query', required: false, example: 'healthcare analytics buyers' },
    ],
    outputFocus: ['account intelligence', 'decision-maker clues', 'intent context'],
  },
  'agile crm': {
    capability: 'crm-pipeline',
    recordType: 'deal',
    researchBasis: 'contact management, deal stages, sales, marketing and service automation',
    modes: ['pipeline-review', 'contact-management', 'deal-prep'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'searchTerm', label: 'Pipeline Focus', required: false, example: 'expansion opportunity' },
      { key: 'targetRole', label: 'Contact Role', required: false, example: 'Operations Director' },
    ],
    outputFocus: ['deal-ready accounts', 'contact notes', 'follow-up actions'],
  },
  callpage: {
    capability: 'callback-automation',
    recordType: 'conversation',
    researchBasis: 'instant callback, AI voice agent, smart routing, call analytics, meeting booking',
    modes: ['callback-audit', 'routing-review', 'call-capture-review'],
    inputFields: [
      { key: 'domain', label: 'Website Domain', required: false, example: 'acme.com' },
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'searchTerm', label: 'Call Intent', required: false, example: 'pricing call' },
    ],
    outputFocus: ['call entry points', 'routing cues', 'response-time actions'],
  },
  aeroleads: {
    capability: 'contact-discovery',
    recordType: 'contact',
    researchBasis: 'email and phone discovery, lead enrichment, CRM sync',
    modes: ['contact-search', 'company-contact-discovery'],
    inputFields: [
      { key: 'company', label: 'Company', required: true, example: 'Acme' },
      { key: 'title', label: 'Title', required: true, example: 'Marketing Director' },
      { key: 'seniority', label: 'Seniority', required: false, example: 'Director' },
    ],
    outputFocus: ['contact matches', 'public emails', 'company-fit clues'],
  },
  leadfuze: {
    capability: 'contact-discovery',
    recordType: 'contact',
    researchBasis: 'prospect list building, targeting filters, AI-assisted sourcing',
    modes: ['list-building', 'persona-search'],
    inputFields: [
      { key: 'targetRole', label: 'Target Role', required: true, example: 'VP Sales' },
      { key: 'industry', label: 'Industry', required: true, example: 'SaaS' },
      { key: 'location', label: 'Location', required: false, example: 'United States' },
      { key: 'companySize', label: 'Company Size', required: false, example: '51-200' },
    ],
    outputFocus: ['lead list', 'fit signals', 'recommended outreach targets'],
  },
  leadsbridge: {
    capability: 'lead-sync',
    recordType: 'sync',
    researchBasis: 'lead sync, audience sync, offline conversion tracking, ads-to-CRM routing',
    modes: ['sync-mapping', 'routing-review', 'integration-audit'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'domain', label: 'Domain', required: false, example: 'acme.com' },
      { key: 'searchTerm', label: 'Sync Goal', required: false, example: 'facebook lead ads to crm' },
    ],
    outputFocus: ['lead sources', 'handoff recommendations', 'mapping checkpoints'],
  },
  saleswings: {
    capability: 'lead-scoring',
    recordType: 'signal',
    researchBasis: 'behavioral tracking, lead and account scoring, intent analytics, Salesforce alerts',
    modes: ['intent-review', 'score-analysis', 'handoff-prioritization'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'domain', label: 'Domain', required: false, example: 'acme.com' },
      { key: 'searchTerm', label: 'Interest Topic', required: false, example: 'pricing page' },
    ],
    outputFocus: ['intent signals', 'priority cues', 'sales handoff guidance'],
  },
  optinmonster: {
    capability: 'lead-capture',
    recordType: 'page',
    researchBasis: 'onsite campaigns, popup targeting, exit intent, A/B testing, conversion optimization',
    modes: ['capture-audit', 'popup-targeting', 'conversion-review'],
    inputFields: [
      { key: 'domain', label: 'Website Domain', required: false, example: 'acme.com' },
      { key: 'searchTerm', label: 'Offer Theme', required: false, example: 'newsletter signup' },
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
    ],
    outputFocus: ['capture pages', 'conversion triggers', 'test ideas'],
  },
  dealfront: {
    capability: 'visitor-intelligence',
    recordType: 'account',
    researchBasis: 'visitor identification, buying intent, account prioritization, enrichment',
    modes: ['visitor-identification', 'account-watchlist', 'intent-review'],
    inputFields: [
      { key: 'domain', label: 'Website Domain', required: false, example: 'acme.com' },
      { key: 'company', label: 'Target Account', required: false, example: 'Acme' },
      { key: 'searchTerm', label: 'Intent Topic', required: false, example: 'integration' },
    ],
    outputFocus: ['identified accounts', 'intent topics', 'follow-up targets'],
  },
  sumo: {
    capability: 'lead-capture',
    recordType: 'page',
    researchBasis: 'list building, onsite forms, popups, conversion prompts',
    modes: ['capture-audit', 'list-growth-review', 'page-prompt-review'],
    inputFields: [
      { key: 'domain', label: 'Website Domain', required: false, example: 'acme.com' },
      { key: 'searchTerm', label: 'Capture Goal', required: false, example: 'email signup' },
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
    ],
    outputFocus: ['capture entry points', 'signup cues', 'list-growth actions'],
  },
  extole: {
    capability: 'referral-marketing',
    recordType: 'campaign',
    researchBasis: 'referral programs, advocate journeys, rewards, fraud controls, analytics',
    modes: ['referral-planning', 'advocate-journey-review', 'reward-audit'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'searchTerm', label: 'Referral Goal', required: false, example: 'customer advocacy' },
      { key: 'domain', label: 'Domain', required: false, example: 'acme.com' },
    ],
    outputFocus: ['referral surfaces', 'advocacy prompts', 'reward actions'],
  },
  rollworks: {
    capability: 'account-based-marketing',
    recordType: 'account',
    researchBasis: 'account targeting, buyer insights, orchestration, advertising, revenue analytics',
    modes: ['account-selection', 'abm-orchestration', 'buyer-signal-review'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'searchTerm', label: 'ABM Goal', required: false, example: 'high-fit target accounts' },
      { key: 'domain', label: 'Domain', required: false, example: 'acme.com' },
    ],
    outputFocus: ['target accounts', 'buyer signals', 'orchestration actions'],
  },
  pipedrive: {
    capability: 'crm-pipeline',
    recordType: 'deal',
    researchBasis: 'visual pipeline, deal tracking, automation, activity planning, insights',
    modes: ['pipeline-review', 'deal-prep', 'activity-planning'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'searchTerm', label: 'Deal Goal', required: false, example: 'renewal opportunity' },
      { key: 'targetRole', label: 'Buyer Role', required: false, example: 'Procurement Lead' },
    ],
    outputFocus: ['deal context', 'buyer contacts', 'next activities'],
  },
  'zendesk sell': {
    capability: 'crm-pipeline',
    recordType: 'deal',
    researchBasis: 'sales automation, pipeline tracking, communication workflows, lead management',
    modes: ['pipeline-review', 'lead-management', 'activity-review'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'searchTerm', label: 'Sales Goal', required: false, example: 'new business' },
      { key: 'targetRole', label: 'Buyer Role', required: false, example: 'IT Director' },
    ],
    outputFocus: ['sales-ready contacts', 'deal context', 'follow-up actions'],
  },
  'hubspot marketing hub': {
    capability: 'marketing-automation',
    recordType: 'campaign',
    researchBasis: 'inbound marketing, forms, automation, segmentation, CRM-connected campaigns',
    modes: ['inbound-campaign-review', 'content-conversion-audit', 'automation-planning'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'domain', label: 'Domain', required: false, example: 'acme.com' },
      { key: 'searchTerm', label: 'Campaign Goal', required: false, example: 'lead magnet nurture' },
    ],
    outputFocus: ['campaign surfaces', 'conversion pages', 'automation actions'],
  },
  mailchimp: {
    capability: 'marketing-automation',
    recordType: 'campaign',
    researchBasis: 'email campaigns, audience segmentation, automations, A/B testing',
    modes: ['email-campaign-review', 'audience-planning', 'nurture-planning'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'searchTerm', label: 'Email Goal', required: false, example: 'welcome sequence' },
      { key: 'domain', label: 'Domain', required: false, example: 'acme.com' },
    ],
    outputFocus: ['campaign opportunities', 'list-growth touchpoints', 'nurture actions'],
  },
  'apollo.io': {
    capability: 'contact-discovery',
    recordType: 'contact',
    researchBasis: 'prospecting database, contact discovery, enrichment, sequence-ready leads',
    modes: ['contact-search', 'company-prospecting'],
    inputFields: [
      { key: 'company', label: 'Company', required: false, example: 'Acme' },
      { key: 'searchTerm', label: 'Search Term', required: false, example: 'VP Marketing' },
    ],
    outputFocus: ['contact matches', 'company context', 'outreach-ready records'],
  },
}

const defaultProfile: ToolProfile = {
  capability: 'account-intelligence',
  recordType: 'page',
  researchBasis: 'public web discovery and account research',
  modes: ['research'],
  inputFields: [
    { key: 'company', label: 'Company', required: false, example: 'Acme' },
    { key: 'domain', label: 'Domain', required: false, example: 'acme.com' },
    { key: 'searchTerm', label: 'Search Term', required: false, example: 'buyer intent' },
  ],
  outputFocus: ['source-backed records', 'research summary', 'next actions'],
}

export function getToolProfile(toolName: string): ToolProfile {
  return profileMap[toolName.toLowerCase()] ?? defaultProfile
}