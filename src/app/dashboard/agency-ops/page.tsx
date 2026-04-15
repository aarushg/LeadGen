import Link from 'next/link'
import { BarChart3, CalendarRange, CheckSquare, ClipboardList, DollarSign, Gauge, LayoutTemplate, LineChart, ListChecks, MessageSquareMore, MousePointerClick, Percent, Send, ShieldAlert, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { growthFeatureIdeas } from '@/lib/growth-feature-ideas'
import { getGrowthFeatureRoute, isGrowthFeatureImplemented } from '@/lib/growth-feature-links'

const features = [
  {
    href: '/dashboard/agency-ops/personalization-rules',
    title: 'Offer-to-Page Personalization Rules',
    description: 'Map traffic segments to page changes so conversion messaging matches intent.',
    icon: LayoutTemplate,
  },
  {
    href: '/dashboard/agency-ops/lead-to-close',
    title: 'Lead-to-Close Time Dashboard',
    description: 'See which channels close quickly and which ones drag out your revenue cycle.',
    icon: Gauge,
  },
  {
    href: '/dashboard/agency-ops/competitor-ads',
    title: 'Competitor Ad Library Tracker',
    description: 'Track competitor angles, offers, and positioning shifts across paid channels.',
    icon: Target,
  },
  {
    href: '/dashboard/agency-ops/launch-calendar',
    title: 'Campaign Launch Calendar',
    description: 'Coordinate campaign timing, approvals, and launch readiness across accounts.',
    icon: CalendarRange,
  },
  {
    href: '/dashboard/agency-ops/renewal-risk',
    title: 'Client Renewal Risk Briefing',
    description: 'Flag accounts that need proactive attention before renewal conversations happen.',
    icon: ShieldAlert,
  },
  {
    href: '/dashboard/agency-ops/objection-widgets',
    title: 'Interactive Objection Handling Widgets',
    description: 'Map objections to on-page answers so sales pages resolve doubts faster.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/channel-margin',
    title: 'Channel Margin Reporting',
    description: 'Compare revenue, estimated cost, and margin by channel.',
    icon: DollarSign,
  },
  {
    href: '/dashboard/agency-ops/creative-approvals',
    title: 'Creative Concept Approval Workflow',
    description: 'Track which campaign concepts are drafting, blocked, or approved.',
    icon: CheckSquare,
  },
  {
    href: '/dashboard/agency-ops/decision-log',
    title: 'Client Decision Log',
    description: 'Keep key client decisions and scope changes in one visible timeline.',
    icon: ClipboardList,
  },
  {
    href: '/dashboard/agency-ops/expansion-playbook',
    title: 'Expansion Playbook Recommender',
    description: 'Spot the next best upsell or cross-sell motion by client.',
    icon: Target,
  },
  {
    href: '/dashboard/agency-ops/value-calculators',
    title: 'Value Calculator Widgets',
    description: 'Turn ROI math into a sales asset for landing pages and qualification flows.',
    icon: Percent,
  },
  {
    href: '/dashboard/agency-ops/pricing-sensitivity',
    title: 'Pricing Sensitivity Tests',
    description: 'Test packaging and pricing presentation without defaulting to margin-eroding discounts.',
    icon: Percent,
  },
  {
    href: '/dashboard/agency-ops/lead-capture-quiz',
    title: 'Multi-Step Lead Capture Quiz',
    description: 'Qualify leads before handoff with staged questions and routing logic.',
    icon: ListChecks,
  },
  {
    href: '/dashboard/agency-ops/progressive-qualification',
    title: 'Progressive Lead Qualification Forms',
    description: 'Stage form fields by intent so teams capture better context with less friction.',
    icon: ListChecks,
  },
  {
    href: '/dashboard/agency-ops/dynamic-scheduling',
    title: 'Dynamic Scheduling Widget',
    description: 'Route different lead types into the right calendar flow automatically.',
    icon: CalendarRange,
  },
  {
    href: '/dashboard/agency-ops/geo-personalization',
    title: 'Geo-Targeted Landing Page Personalization',
    description: 'Localize proof, messaging, and CTA framing by market or city.',
    icon: LayoutTemplate,
  },
  {
    href: '/dashboard/agency-ops/chat-qualification',
    title: 'Chat-Based Qualification Flows',
    description: 'Qualify high-intent visitors conversationally before pushing them into a full form.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/exit-intent-offers',
    title: 'Exit-Intent Offer Builder',
    description: 'Plan bounce-recovery offers that convert abandoning visitors into leads.',
    icon: MousePointerClick,
  },
  {
    href: '/dashboard/agency-ops/rescue-banners',
    title: 'On-Page Rescue Banner System',
    description: 'Recover distracted visitors with lighter-weight rescue messages before they bounce.',
    icon: MousePointerClick,
  },
  {
    href: '/dashboard/agency-ops/offer-testing',
    title: 'Offer Testing Dashboard',
    description: 'Compare hooks, guarantees, and audit offers to see which framing wins.',
    icon: Percent,
  },
  {
    href: '/dashboard/agency-ops/proof-assets',
    title: 'Testimonial and Proof Asset Manager',
    description: 'Organize trust assets so they are easier to deploy across campaigns and pages.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/funnel-dropoff',
    title: 'Funnel Drop-Off Analysis',
    description: 'See exactly where visitors disappear in the path from click to booked call.',
    icon: Gauge,
  },
  {
    href: '/dashboard/agency-ops/cta-testing',
    title: 'Call-to-Action Testing Workspace',
    description: 'Compare CTA language and next-step framing across key pages.',
    icon: Percent,
  },
  {
    href: '/dashboard/agency-ops/cohort-retention',
    title: 'Client Cohort Retention Reporting',
    description: 'Track how client cohorts retain and perform over time.',
    icon: LineChart,
  },
  {
    href: '/dashboard/agency-ops/benchmark-scorecards',
    title: 'Client Benchmark Scorecards',
    description: 'Compare each account against portfolio-wide qualification, win, and revenue benchmarks.',
    icon: BarChart3,
  },
  {
    href: '/dashboard/agency-ops/ad-testing-velocity',
    title: 'Ad Testing Velocity Tracker',
    description: 'Measure whether enough experiments are launching each month.',
    icon: Target,
  },
  {
    href: '/dashboard/agency-ops/lead-scoring',
    title: 'Lead Scoring Rules Engine',
    description: 'Prioritize leads using fit, value, freshness, and channel signals.',
    icon: Target,
  },
  {
    href: '/dashboard/agency-ops/pipeline-sla',
    title: 'Pipeline SLA Tracking',
    description: 'Keep response-time accountability visible on new and qualified leads.',
    icon: Gauge,
  },
  {
    href: '/dashboard/agency-ops/lost-deal-analysis',
    title: 'Lost-Deal Reason Analysis',
    description: 'Surface the objections and blockers causing deals to stall or die.',
    icon: ClipboardList,
  },
  {
    href: '/dashboard/agency-ops/reactivation-queue',
    title: 'Reactivation Queue for Stale Leads',
    description: 'Turn old pipeline into a visible recovery workflow.',
    icon: Gauge,
  },
  {
    href: '/dashboard/agency-ops/proposal-follow-up',
    title: 'Proposal Follow-Up Sequence Builder',
    description: 'Standardize post-proposal follow-up plays so more opportunities turn into signed deals.',
    icon: Send,
  },
  {
    href: '/dashboard/agency-ops/executive-kpi',
    title: 'Executive KPI Snapshot',
    description: 'Package lead volume, quality, wins, and revenue into a client-friendly summary.',
    icon: BarChart3,
  },
  {
    href: '/dashboard/agency-ops/weekly-digest',
    title: 'Weekly Wins and Risks Digest',
    description: 'Summarize client momentum, blockers, and next moves in one weekly view.',
    icon: BarChart3,
  },
  {
    href: '/dashboard/agency-ops/pipeline-projection',
    title: 'Forecasted Pipeline Projection',
    description: 'Project likely lead and revenue outcomes from current momentum.',
    icon: BarChart3,
  },
  {
    href: '/dashboard/agency-ops/lead-enrichment',
    title: 'Lead Enrichment Workflow Queue',
    description: 'Keep enrichment visible before handoff so sales gets better context.',
    icon: ClipboardList,
  },
  {
    href: '/dashboard/agency-ops/nurture-workflows',
    title: 'Lead Nurture Workflows by Funnel Stage',
    description: 'Match follow-up sequences to where the buyer is in the funnel.',
    icon: Send,
  },
  {
    href: '/dashboard/agency-ops/lead-routing',
    title: 'Instant Lead Routing',
    description: 'Push hot leads to the right rep or workflow immediately.',
    icon: Send,
  },
  {
    href: '/dashboard/agency-ops/sms-opt-in',
    title: 'SMS Opt-In Capture',
    description: 'Add a faster text-based follow-up path for high-intent leads.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/industry-intake',
    title: 'Industry-Specific Intake Form Templates',
    description: 'Use niche-tailored intake structures for healthcare, SaaS, home services, and more.',
    icon: ClipboardList,
  },
  {
    href: '/dashboard/agency-ops/attribution-capture',
    title: 'Referral Source and UTM Auto-Capture',
    description: 'Preserve source and campaign context across the full lead journey.',
    icon: Target,
  },
  {
    href: '/dashboard/agency-ops/lead-magnets',
    title: 'Lead Magnet Library',
    description: 'Organize gated assets and offers so teams can launch campaigns faster.',
    icon: ClipboardList,
  },
  {
    href: '/dashboard/agency-ops/form-recovery',
    title: 'Form Abandonment Recovery Workflows',
    description: 'Recover incomplete submissions before warm leads disappear.',
    icon: MousePointerClick,
  },
  {
    href: '/dashboard/agency-ops/social-proof-blocks',
    title: 'Social Proof Block Manager',
    description: 'Organize reusable trust blocks for capture pages and offers.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/callback-sequences',
    title: 'Lifecycle-Specific Callback Sequences',
    description: 'Tailor callback flows by visitor stage and urgency.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/response-time-board',
    title: 'Response-Time Performance Board',
    description: 'See where first-response speed is slipping across channels and lead types.',
    icon: Gauge,
  },
  {
    href: '/dashboard/agency-ops/micro-conversions',
    title: 'Micro-Conversion Prompt Library',
    description: 'Use lighter prompts for visitors not ready for a full conversion.',
    icon: MousePointerClick,
  },
  {
    href: '/dashboard/agency-ops/buyer-objection-prompts',
    title: 'Buyer Objection Prompt Set',
    description: 'Equip pages and teams with reusable responses to common buyer hesitation.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/consent-prompts',
    title: 'Progressive Consent and Compliance Prompts',
    description: 'Handle consent more cleanly without overloading the form experience.',
    icon: CheckSquare,
  },
  {
    href: '/dashboard/agency-ops/missed-call-text',
    title: 'Missed-Call Text-Back Automation',
    description: 'Recover inbound phone demand automatically when the team misses a call.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/roadmap-milestones',
    title: 'Client Roadmap Milestone Tracker',
    description: 'Show progress against strategic milestones in a client-friendly view.',
    icon: CalendarRange,
  },
  {
    href: '/dashboard/agency-ops/forecast-accuracy',
    title: 'Forecast Accuracy Reporting',
    description: 'Compare projected leads and revenue against actual results.',
    icon: BarChart3,
  },
  {
    href: '/dashboard/agency-ops/shared-roadmap',
    title: 'Shared Growth Roadmap',
    description: 'Align agencies and clients around the next priorities, owners, and success targets.',
    icon: CalendarRange,
  },
  {
    href: '/dashboard/agency-ops/referral-activation',
    title: 'Referral Activation Campaigns',
    description: 'Track advocate campaigns that turn happy customers into growth.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/client-request-intake',
    title: 'Client Request Intake Workspace',
    description: 'Centralize one-off client asks so they can be triaged and delivered.',
    icon: CheckSquare,
  },
  {
    href: '/dashboard/agency-ops/advocacy-score',
    title: 'Customer Advocacy Score',
    description: 'Spot which client accounts are ready for referrals, reviews, and testimonial asks.',
    icon: ShieldAlert,
  },
  {
    href: '/dashboard/agency-ops/testimonial-capture',
    title: 'Review and Testimonial Capture Planner',
    description: 'Track customer proof requests so reviews, testimonials, and case studies ship faster.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/seo-opportunity-scoring',
    title: 'SEO Opportunity Scoring Model',
    description: 'Rank organic opportunities by business value so content effort goes to the right pages.',
    icon: LineChart,
  },
  {
    href: '/dashboard/agency-ops/topic-cluster-planner',
    title: 'Topic Cluster Planner',
    description: 'Build connected SEO campaigns around pillar themes and supporting topics.',
    icon: LineChart,
  },
  {
    href: '/dashboard/agency-ops/search-intent-briefs',
    title: 'Search Intent Brief Generator',
    description: 'Turn target keywords into writer-ready briefs with angle and CTA guidance.',
    icon: LineChart,
  },
  {
    href: '/dashboard/agency-ops/local-seo-templates',
    title: 'Local SEO Landing Page Template System',
    description: 'Scale city, neighborhood, and multi-location SEO pages faster.',
    icon: LayoutTemplate,
  },
  {
    href: '/dashboard/agency-ops/mobile-audit',
    title: 'Mobile Conversion Audit Checklist',
    description: 'Review the mobile frictions most likely to reduce conversion rate.',
    icon: Percent,
  },
  {
    href: '/dashboard/agency-ops/message-match',
    title: 'Landing Page to Ad-Message Match Scoring',
    description: 'Spot where paid promise and on-page experience drift apart.',
    icon: Percent,
  },
  {
    href: '/dashboard/agency-ops/heatmap-review',
    title: 'Heatmap Summary and Click-Pattern Review',
    description: 'Turn click behavior into clearer page optimization recommendations.',
    icon: Percent,
  },
  {
    href: '/dashboard/agency-ops/checkout-friction',
    title: 'Checkout Friction Detector',
    description: 'Spot where booking or checkout flow friction is reducing conversion.',
    icon: Gauge,
  },
  {
    href: '/dashboard/agency-ops/guarantee-sections',
    title: 'Risk-Reversal and Guarantee Section Generator',
    description: 'Frame guarantees more clearly so offers feel lower risk.',
    icon: ShieldAlert,
  },
  {
    href: '/dashboard/agency-ops/proof-sequencing',
    title: 'Proof Sequencing Optimizer',
    description: 'Decide what trust signals should appear first in the persuasion flow.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/proof-comparison',
    title: 'Interactive Proof Comparison Modules',
    description: 'Compare credibility stacks and choose the right proof mix for each campaign.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/page-speed-opportunities',
    title: 'Page Speed Opportunity Scanner',
    description: 'Highlight speed issues likely to affect conversion most.',
    icon: Gauge,
  },
  {
    href: '/dashboard/agency-ops/offer-packaging',
    title: 'Offer Packaging Comparison Workspace',
    description: 'Compare packaging models for different buyer and delivery situations.',
    icon: Percent,
  },
  {
    href: '/dashboard/agency-ops/sales-handoff',
    title: 'Sales Handoff Summaries',
    description: 'Package lead context so sales can move faster with better relevance.',
    icon: ClipboardList,
  },
  {
    href: '/dashboard/agency-ops/win-patterns',
    title: 'Win-Pattern Analysis',
    description: 'See which offer, industry, and channel combinations are closing best.',
    icon: Target,
  },
  {
    href: '/dashboard/agency-ops/sales-velocity',
    title: 'Sales Velocity Benchmark Board',
    description: 'Compare how quickly opportunities move by segment and source.',
    icon: Gauge,
  },
  {
    href: '/dashboard/agency-ops/opportunity-aging',
    title: 'Opportunity Aging Heatmap',
    description: 'Spot stalled deals before pipeline value quietly decays.',
    icon: Gauge,
  },
  {
    href: '/dashboard/agency-ops/deal-health',
    title: 'Deal Health Scores',
    description: 'Keep active opportunity quality visible before deals stall.',
    icon: Gauge,
  },
  {
    href: '/dashboard/agency-ops/persona-tags',
    title: 'Persona Tagging',
    description: 'Standardize persona tags across offers, outreach, and reporting.',
    icon: ClipboardList,
  },
  {
    href: '/dashboard/agency-ops/expansion-opportunities',
    title: 'Expansion and Upsell Opportunity Tracking',
    description: 'See which clients are ready for broader service adoption.',
    icon: ShieldAlert,
  },
  {
    href: '/dashboard/agency-ops/source-revenue',
    title: 'Lead Source-to-Revenue Mapping',
    description: 'Connect channel and source activity to actual revenue outcomes.',
    icon: DollarSign,
  },
  {
    href: '/dashboard/agency-ops/benchmark-alerts',
    title: 'Portfolio Benchmark Anomaly Alerts',
    description: 'Flag accounts that are drifting outside healthy portfolio ranges.',
    icon: BarChart3,
  },
  {
    href: '/dashboard/agency-ops/goal-variance',
    title: 'Goal Variance Alerts',
    description: 'Keep KPI misses visible before reporting cycles close.',
    icon: BarChart3,
  },
  {
    href: '/dashboard/agency-ops/lead-quality-trends',
    title: 'Lead Quality Trend Reporting',
    description: 'Track whether high, medium, and low lead mix is improving over time.',
    icon: BarChart3,
  },
  {
    href: '/dashboard/agency-ops/content-roi',
    title: 'Content ROI Reporting',
    description: 'Tie content assets to influenced leads, pipeline, and estimated revenue.',
    icon: BarChart3,
  },
  {
    href: '/dashboard/agency-ops/landing-page-leaderboard',
    title: 'Landing Page Leaderboard',
    description: 'Rank pages by conversion performance and source efficiency.',
    icon: BarChart3,
  },
  {
    href: '/dashboard/agency-ops/no-show-recovery',
    title: 'No-Show Recovery Automations',
    description: 'Recover booked meetings after a no-show with automated follow-up.',
    icon: Send,
  },
  {
    href: '/dashboard/agency-ops/review-automations',
    title: 'Review and Testimonial Collection Automations',
    description: 'Collect proof more consistently after positive delivery milestones.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/submission-enrichment',
    title: 'Lead Enrichment on Form Submission',
    description: 'Add richer context immediately at the point of capture.',
    icon: ClipboardList,
  },
  {
    href: '/dashboard/agency-ops/approval-reminders',
    title: 'Approval and Asset Reminders',
    description: 'Keep launch blockers visible when approvals or client assets are still missing.',
    icon: CheckSquare,
  },
  {
    href: '/dashboard/agency-ops/content-refresh',
    title: 'Content Refresh Opportunity Finder',
    description: 'Surface existing pages that could win more traffic or leads with faster refresh work.',
    icon: LineChart,
  },
  {
    href: '/dashboard/agency-ops/case-study-workflow',
    title: 'Case Study Publishing Workflow',
    description: 'Turn client wins into approved proof assets with a repeatable publishing flow.',
    icon: LineChart,
  },
  {
    href: '/dashboard/agency-ops/content-gaps',
    title: 'Competitor Content Gap Analyzer',
    description: 'Spot where competitors are winning content attention first.',
    icon: LineChart,
  },
  {
    href: '/dashboard/agency-ops/cta-consistency',
    title: 'CTA Consistency Checker',
    description: 'Keep content-to-offer paths more consistent across blog and resource pages.',
    icon: LineChart,
  },
  {
    href: '/dashboard/agency-ops/keyword-alerts',
    title: 'Underperforming Keyword Alerts',
    description: 'Flag wasted paid search spend on low-fit or low-intent queries.',
    icon: DollarSign,
  },
  {
    href: '/dashboard/agency-ops/revenue-per-lead',
    title: 'Revenue per Lead by Campaign',
    description: 'Compare campaigns by revenue quality instead of just lead count.',
    icon: DollarSign,
  },
  {
    href: '/dashboard/agency-ops/offline-conversions',
    title: 'Offline Conversion Import Tracking',
    description: 'Bring site visits, deals, and offline wins back into paid reporting.',
    icon: DollarSign,
  },
  {
    href: '/dashboard/agency-ops/attribution-views',
    title: 'Multi-Touch Attribution Views',
    description: 'Compare first-touch, last-touch, and multi-touch channel views.',
    icon: DollarSign,
  },
  {
    href: '/dashboard/agency-ops/request-center',
    title: 'Client Request Intake Center',
    description: 'Centralize asks from Slack, email, and meetings into one visible stream.',
    icon: CheckSquare,
  },
  {
    href: '/dashboard/agency-ops/cross-sell-journeys',
    title: 'Cross-Sell and Upsell Journey Builder',
    description: 'Plan expansion motions based on account maturity and delivery signals.',
    icon: ShieldAlert,
  },
  {
    href: '/dashboard/agency-ops/client-roadmap-builder',
    title: 'Client-Specific Roadmap Builder',
    description: 'Turn Growth Hub ideas into account-specific roadmaps faster.',
    icon: CalendarRange,
  },
  {
    href: '/dashboard/agency-ops/proposal-addons',
    title: 'Proposal Add-On Generator',
    description: 'Convert identified growth gaps into upsell-ready proposal modules.',
    icon: DollarSign,
  },
  {
    href: '/dashboard/agency-ops/churn-risk',
    title: 'Churn-Risk Dashboard',
    description: 'Spot at-risk subscription clients before renewals get shaky.',
    icon: ShieldAlert,
  },
  {
    href: '/dashboard/agency-ops/post-purchase-sequences',
    title: 'Post-Purchase Education and Onboarding Sequences',
    description: 'Keep new clients engaged after conversion with clearer onboarding milestones.',
    icon: CalendarRange,
  },
  {
    href: '/dashboard/agency-ops/customer-education',
    title: 'Customer Education Content Map',
    description: 'Map the onboarding, adoption, and renewal education clients need most.',
    icon: CalendarRange,
  },
  {
    href: '/dashboard/agency-ops/retention-scorecards',
    title: 'Retention Milestone Scorecards',
    description: 'Track account health through milestone-based retention signals.',
    icon: ShieldAlert,
  },
  {
    href: '/dashboard/agency-ops/conversion-lag',
    title: 'Conversion Lag Analysis by Campaign',
    description: 'See which campaigns convert slower so strong long-lag channels are not cut too early.',
    icon: Gauge,
  },
  {
    href: '/dashboard/agency-ops/budget-reallocation',
    title: 'Budget Reallocation Recommendations',
    description: 'Shift spend toward channels with stronger revenue and win-rate performance.',
    icon: DollarSign,
  },
  {
    href: '/dashboard/agency-ops/audience-overlap',
    title: 'Audience Overlap Analyzer',
    description: 'Spot duplicated audience reach and reduce paid media cannibalization.',
    icon: Target,
  },
  {
    href: '/dashboard/agency-ops/retargeting-mapper',
    title: 'Retargeting Sequence Mapper',
    description: 'Plan how retargeting messages should evolve by audience warmth and recency.',
    icon: Target,
  },
  {
    href: '/dashboard/agency-ops/onboarding-portal',
    title: 'Client Onboarding Checklist Portal',
    description: 'Standardize account kickoff so missing setup steps do not delay launches.',
    icon: CheckSquare,
  },
  {
    href: '/dashboard/agency-ops/approval-queue',
    title: 'Approval Queue',
    description: 'Keep ads, pages, and content approvals visible so launches do not stall.',
    icon: CheckSquare,
  },
  {
    href: '/dashboard/agency-ops/strategy-recaps',
    title: 'Monthly Strategy Recap Generator',
    description: 'Package wins, lessons, and next priorities into a cleaner monthly client update.',
    icon: ClipboardList,
  },
  {
    href: '/dashboard/agency-ops/win-back-campaigns',
    title: 'Win-Back Campaigns',
    description: 'Recover dormant accounts and former customers with lower-friction offers.',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/agency-ops/success-plans',
    title: 'Success Plans Tied to Revenue Targets',
    description: 'Track client milestones against explicit revenue-linked outcomes.',
    icon: ShieldAlert,
  },
  {
    href: '/dashboard/agency-ops/communication-timeline',
    title: 'Client Communication Timeline',
    description: 'Preserve meeting, approval, and update history across the account lifecycle.',
    icon: CalendarRange,
  },
  {
    href: '/dashboard/agency-ops/intent-drift-alerts',
    title: 'Intent Drift Alerts for Top Landing Pages',
    description: 'Flag when visitor intent weakens on pages that should be converting well.',
    icon: ShieldAlert,
  },
  {
    href: '/dashboard/agency-ops/conversion-friction-heatmap',
    title: 'Conversion Friction Heatmap',
    description: 'Highlight the page areas and steps creating the most hesitation.',
    icon: Gauge,
  },
  {
    href: '/dashboard/agency-ops/stale-lead-board',
    title: 'Stale Lead Prioritization Board',
    description: 'Keep the oldest unworked opportunities visible and actionable.',
    icon: ClipboardList,
  },
  {
    href: '/dashboard/agency-ops/anomaly-summaries',
    title: 'Client-Ready Anomaly Summary Generator',
    description: 'Turn performance swings into client-facing explanations quickly.',
    icon: BarChart3,
  },
  {
    href: '/dashboard/agency-ops/approval-chase',
    title: 'Approval Chase Automation',
    description: 'Follow up automatically when approvals or assets are still missing.',
    icon: CheckSquare,
  },
  {
    href: '/dashboard/agency-ops/topic-decay',
    title: 'Topic Decay Detector',
    description: 'Spot when content starts losing momentum and needs a refresh.',
    icon: LineChart,
  },
  {
    href: '/dashboard/agency-ops/search-query-revenue',
    title: 'Search Query Revenue Map',
    description: 'Connect search demand to downstream revenue more clearly.',
    icon: DollarSign,
  },
  {
    href: '/dashboard/agency-ops/renewal-countdown',
    title: 'Renewal Countdown Reminders',
    description: 'Keep client renewal timing visible before outreach gets urgent.',
    icon: CalendarRange,
  },
  {
    href: '/dashboard/agency-ops/playbook-library',
    title: 'Reusable Agency Playbook Library',
    description: 'Store repeatable delivery workflows in one reusable library.',
    icon: ClipboardList,
  },
  {
    href: '/dashboard/agency-ops/source-confidence',
    title: 'Lead Source Confidence Scoring',
    description: 'Score which sources have the cleanest and most reliable attribution.',
    icon: Target,
  },
]

const openFeatures = growthFeatureIdeas
  .filter((feature) =>
    ['Lead Capture', 'Conversion', 'Reporting', 'Paid Media', 'Client Experience', 'Retention'].includes(feature.category)
  )
  .sort((a, b) => {
    const priorityScore = { High: 3, Medium: 2, Low: 1 }
    return priorityScore[b.priority] - priorityScore[a.priority]
  })
  .slice(0, 12)

export default function AgencyOpsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6">
        <Badge variant="secondary" className="w-fit">Agency Ops</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Agency Growth Operations</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          A workspace for strategy and operations features that help agencies improve client performance, launch faster,
          and keep more accounts healthy.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map(({ href, title, description, icon: Icon }) => (
          <Card key={href} className="h-full">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{description}</p>
              <Button asChild>
                <Link href={href}>Open feature</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Open Features From Growth Hub</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              The next highest-signal ideas still open for implementation inside Agency Ops.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/growth-hub">View full backlog</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {openFeatures.map((feature) => (
            <div key={feature.id} className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{feature.category}</Badge>
                  <Badge variant={isGrowthFeatureImplemented(feature) ? 'success' : 'outline'}>
                    {isGrowthFeatureImplemented(feature) ? 'Implemented' : 'Backlog'}
                  </Badge>
                </div>
                <Badge variant={feature.priority === 'High' ? 'default' : feature.priority === 'Medium' ? 'secondary' : 'outline'}>
                  {feature.priority}
                </Badge>
              </div>
              <p className="mt-3 font-semibold">{feature.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{feature.agencyValue}</p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link href={getGrowthFeatureRoute(feature)}>
                  {isGrowthFeatureImplemented(feature) ? 'Open feature' : 'View brief'}
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
