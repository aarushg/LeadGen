export type LeadTool = {
  name: string
  type: string
  bestFor: string
  keyFeatures: string[]
  summary: string
  website: string
}

export const leadGenerationIntro = {
  overview:
    'Lead generation tools help businesses identify, attract, and engage high-intent prospects using automation, analytics, and targeted outreach.',
  description:
    'They reduce manual prospecting effort while improving lead quality through better data, personalization, and sales-marketing alignment.',
}

export const leadGenerationBenefits: Array<{ title: string; description: string }> = [
  {
    title: 'Gain Better Customer Insights',
    description:
      'Track interactions and engagement patterns so teams can personalize outreach and segment audiences with more precision.',
  },
  {
    title: 'Prioritize High-Quality Leads',
    description:
      'Use enrichment, intent data, and scoring to focus on accounts and contacts that are more likely to convert.',
  },
  {
    title: 'Save Time Through Automation',
    description:
      'Automate repetitive steps like follow-ups, sequencing, routing, and CRM updates so reps can focus on closing.',
  },
  {
    title: 'Increase Conversion Rates',
    description:
      'Deliver relevant messaging at the right stage with faster response times and better multi-channel nurturing.',
  },
]

export const leadGenerationMustHaveFeatures = [
  'Prospecting and enrichment capabilities',
  'Automated email sequencing and follow-ups',
  'Lead scoring and qualification',
  'Pipeline and lead management',
  'Multi-channel outreach (email, phone, chat, social)',
  'CRM and marketing integrations',
  'AI-powered recommendations and timing insights',
]

export const leadGenerationTools: LeadTool[] = [
  {
    name: 'LeadGenScrape',
    type: 'Web Scraping & Data Platform',
    bestFor: 'Cloud scraping, actor-based automation, and AI-ready data pipelines',
    keyFeatures: ['Actor marketplace', 'Managed proxies and anti-blocking', 'Datasets, KV store, and request queues'],
    summary:
      'API-first scraping platform for running reusable actors, storing structured output, and feeding fresh web data into lead gen and AI workflows.',
    website: 'https://apify.com/',
  },
  {
    name: 'Salesforce Marketing Cloud',
    type: 'Marketing Automation',
    bestFor: 'Enterprise-level lead generation',
    keyFeatures: ['AI-driven automation', 'Multi-channel marketing', 'Deep analytics'],
    summary:
      'Advanced multi-channel platform with AI scoring, segmentation, and strong CRM integration for scale.',
    website: 'https://www.salesforce.com/products/marketing-cloud/overview/',
  },
  {
    name: 'Leadfeeder',
    type: 'Website Visitor Tracking',
    bestFor: 'Turning website visitors into leads',
    keyFeatures: ['Identifies website visitors', 'CRM integrations', 'Lead scoring'],
    summary:
      'Reveals anonymous company traffic and surfaces sales-ready website engagement signals.',
    website: 'https://www.leadfeeder.com/',
  },
  {
    name: 'UpLead',
    type: 'B2B Contact Database',
    bestFor: 'Finding verified B2B leads',
    keyFeatures: ['Real-time contact verification', 'Extensive B2B database', 'Data enrichment'],
    summary:
      'Prospecting database focused on verified contact details and accurate outreach data.',
    website: 'https://www.uplead.com/',
  },
  {
    name: 'Intercom',
    type: 'Conversational Marketing',
    bestFor: 'Live chat and inbound qualification',
    keyFeatures: ['Live chat', 'AI chatbots', 'Customer engagement workflows'],
    summary:
      'Captures and qualifies inbound leads in real time through chat and bot automation.',
    website: 'https://www.intercom.com/',
  },
  {
    name: 'Hunter',
    type: 'Email Finder and Verifier',
    bestFor: 'Finding and validating business emails',
    keyFeatures: ['Email verification', 'Bulk searches', 'Domain search'],
    summary:
      'Simple and reliable option for outbound teams that need verified contact emails quickly.',
    website: 'https://hunter.io/',
  },
  {
    name: 'Demio',
    type: 'Webinar Platform',
    bestFor: 'Hosting lead-generating webinars',
    keyFeatures: ['Interactive webinars', 'Automated follow-ups', 'Engagement analytics'],
    summary:
      'Webinar-first lead engine with registration flows, engagement tools, and post-event automation.',
    website: 'https://demio.com/',
  },
  {
    name: 'Overloop',
    type: 'Sales Engagement',
    bestFor: 'Outbound sales and prospecting',
    keyFeatures: ['Multi-channel outreach', 'Email tracking', 'Automation'],
    summary:
      'Outbound engagement platform combining sequence automation and cross-channel prospecting.',
    website: 'https://overloop.com/',
  },
  {
    name: 'D&B Hoovers',
    type: 'Business Database',
    bestFor: 'B2B data enrichment',
    keyFeatures: ['Financial firmographics', 'Decision-maker contacts', 'Analytics'],
    summary:
      'Deep company intelligence database useful for enterprise targeting and ABM programs.',
    website: 'https://www.dnb.com/products/dnb-hoovers.html',
  },
  {
    name: 'Agile CRM',
    type: 'CRM',
    bestFor: 'All-in-one CRM for small businesses',
    keyFeatures: ['Sales automation', 'Marketing integrations', 'Email tracking'],
    summary:
      'Affordable CRM with built-in lead management, workflows, and campaign support.',
    website: 'https://www.agilecrm.com/',
  },
  {
    name: 'CallPage',
    type: 'Call Tracking and Engagement',
    bestFor: 'Boosting inbound calls and conversions',
    keyFeatures: ['Instant callback tools', 'Conversion optimization', 'Call tracking'],
    summary:
      'Converts high-intent website visitors via immediate callback capture and routing.',
    website: 'https://www.callpage.io/',
  },
  {
    name: 'AeroLeads',
    type: 'Lead Prospecting',
    bestFor: 'Finding contact details',
    keyFeatures: ['Verified contact data', 'Lead enrichment', 'CRM sync'],
    summary:
      'Prospecting assistant for extracting and validating contact data across web sources.',
    website: 'https://aeroleads.com/',
  },
  {
    name: 'LeadFuze',
    type: 'AI Lead Sourcing',
    bestFor: 'Automating prospect list creation',
    keyFeatures: ['Automated sourcing', 'ABM targeting', 'Data validation'],
    summary:
      'AI-assisted list builder that continuously delivers leads based on targeting rules.',
    website: 'https://www.leadfuze.com/',
  },
  {
    name: 'LeadsBridge',
    type: 'Lead Integration',
    bestFor: 'Syncing ad and CRM lead data',
    keyFeatures: ['Real-time lead syncing', 'Audience retargeting', 'Attribution insights'],
    summary:
      'Bridge between paid channels and CRM systems to automate handoff and attribution.',
    website: 'https://leadsbridge.com/',
  },
  {
    name: 'SalesWings',
    type: 'Lead Scoring and Qualification',
    bestFor: 'Salesforce-native lead and account scoring',
    keyFeatures: ['Behavior tracking', 'Predictive scoring', 'Real-time alerts'],
    summary:
      'Salesforce-native scoring layer for first-party intent, fit grading, and sales alerts.',
    website: 'https://www.saleswingsapp.com/',
  },
  {
    name: 'OptinMonster',
    type: 'Lead Capture and Forms',
    bestFor: 'Website pop-ups and lead forms',
    keyFeatures: ['Exit-intent technology', 'Visual campaign builder', 'A/B testing'],
    summary:
      'Website conversion toolkit that turns visitor intent signals into captured leads.',
    website: 'https://optinmonster.com/',
  },
  {
    name: 'Dealfront',
    type: 'B2B Lead Intelligence',
    bestFor: 'Tracking visitors and buyer intent',
    keyFeatures: ['Visitor identification', 'Intent data', 'Lead enrichment'],
    summary:
      'Combines visitor intel and intent signals to help teams target accounts earlier.',
    website: 'https://www.dealfront.com/',
  },
  {
    name: 'Sumo',
    type: 'List Building and Pop-Ups',
    bestFor: 'Growing email lists from website traffic',
    keyFeatures: ['Smart popups', 'Exit-intent detection', 'Email follow-ups'],
    summary:
      'Inbound list-growth toolkit with lightweight forms and engagement prompts.',
    website: 'https://sumo.com/',
  },
  {
    name: 'Extole',
    type: 'Referral Marketing',
    bestFor: 'Turning customers into advocates',
    keyFeatures: ['Referral programs', 'Reward automation', 'Fraud prevention'],
    summary:
      'Referral engine for customer-led lead generation and advocacy campaigns.',
    website: 'https://www.extole.com/',
  },
  {
    name: 'RollWorks',
    type: 'Account-Based Marketing',
    bestFor: 'Targeting high-value accounts',
    keyFeatures: ['Account targeting', 'Intent data tracking', 'Automated scoring'],
    summary:
      'ABM platform focused on account selection, orchestration, and conversion tracking.',
    website: 'https://www.rollworks.com/',
  },
  {
    name: 'Pipedrive',
    type: 'CRM',
    bestFor: 'Sales pipeline management',
    keyFeatures: ['Visual pipeline', 'Deal tracking', 'Automation tools'],
    summary:
      'Sales-centric CRM with clear pipeline visibility and practical automation features.',
    website: 'https://www.pipedrive.com/',
  },
  {
    name: 'Zendesk Sell',
    type: 'CRM and Sales Automation',
    bestFor: 'Sales team automation',
    keyFeatures: ['Lead scoring', 'Email automation', 'Pipeline tracking'],
    summary:
      'CRM with built-in communication and workflow tooling for sales execution.',
    website: 'https://www.zendesk.com/sell/',
  },
  {
    name: 'HubSpot Marketing Hub',
    type: 'Marketing Automation',
    bestFor: 'Inbound marketing and automation',
    keyFeatures: ['Email campaigns', 'Lead tracking', 'CRM integration'],
    summary:
      'Inbound-focused automation platform combining content, workflows, and CRM connectivity.',
    website: 'https://www.hubspot.com/products/marketing',
  },
  {
    name: 'Mailchimp',
    type: 'Email Marketing',
    bestFor: 'Automated email marketing',
    keyFeatures: ['Triggered sequences', 'Audience segmentation', 'A/B testing'],
    summary:
      'Email-first automation platform for audience growth, nurturing, and campaign optimization.',
    website: 'https://mailchimp.com/',
  },
]
