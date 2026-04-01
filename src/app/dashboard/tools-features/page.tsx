'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Mail,
  Users,
  Send,
  TrendingUp,
  Zap,
  MessageSquare,
  Calendar,
  Layers,
  CheckCircle2,
  Phone,
  Globe,
  Database,
  Briefcase,
  Settings,
  Headset,
  Search,
  Cloud,
  BarChart3,
  Gift,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ToolCard {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  category: string
  status: 'implemented' | 'coming-soon'
  features: string[]
}

const tools: ToolCard[] = [
  {
    id: 'hunter',
    name: 'Hunter - Email Finder',
    description: 'Find professional email addresses for any domain',
    icon: Mail,
    href: '/dashboard/tools-features/hunter',
    category: 'Email & Contact',
    status: 'implemented',
    features: ['Domain search', 'Email patterns', 'Confidence scoring'],
  },
  {
    id: 'uplead',
    name: 'UpLead - Contact Enrichment',
    description: 'Enrich contacts with verified B2B data',
    icon: Users,
    href: '/dashboard/tools-features/uplead',
    category: 'Data & Intelligence',
    status: 'implemented',
    features: ['Contact enrichment', 'Verification', 'Data validation'],
  },
  {
    id: 'overloop',
    name: 'Overloop - Email Sequences',
    description: 'Create and manage automated email sequences',
    icon: Send,
    href: '/dashboard/tools-features/overloop',
    category: 'Automation',
    status: 'implemented',
    features: ['Email sequences', 'Follow-ups', 'Automation rules'],
  },
  {
    id: 'leadfuze',
    name: 'LeadFuze - AI Lead Sourcing',
    description: 'AI-powered lead generation and prospect sourcing',
    icon: Zap,
    href: '/dashboard/tools-features/leadfuze',
    category: 'AI & Automation',
    status: 'implemented',
    features: ['AI prospecting', 'Lead filtering', 'Bulk export'],
  },
  {
    id: 'saleswings',
    name: 'SalesWings - Lead Scoring',
    description: 'Score and prioritize leads automatically',
    icon: TrendingUp,
    href: '/dashboard/tools-features/saleswings',
    category: 'Lead Scoring',
    status: 'implemented',
    features: ['Lead scoring', 'Behavioral tracking', 'Alerts'],
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp - Email Campaigns',
    description: 'Create and send email marketing campaigns',
    icon: Send,
    href: '/dashboard/tools-features/mailchimp',
    category: 'Email Marketing',
    status: 'implemented',
    features: ['Campaign creation', 'Send campaigns', 'Analytics tracking'],
  },
  {
    id: 'optinmonster',
    name: 'OptinMonster - Form Builder',
    description: 'Create lead capture forms and pop-ups',
    icon: Layers,
    href: '/dashboard/tools-features/optinmonster',
    category: 'Lead Capture',
    status: 'implemented',
    features: ['Form builder', 'Pop-ups', 'Multiple display types'],
  },
  {
    id: 'demio',
    name: 'Demio - Webinar Scheduler',
    description: 'Create and schedule webinars for lead generation',
    icon: Calendar,
    href: '/dashboard/tools-features/demio',
    category: 'Events',
    status: 'implemented',
    features: ['Webinar scheduling', 'Registration tracking', 'Live hosting'],
  },
  {
    id: 'intercom',
    name: 'Intercom - Live Chat',
    description: 'Engage leads with real-time chat and messaging',
    icon: MessageSquare,
    href: '/dashboard/tools-features/intercom',
    category: 'Communication',
    status: 'implemented',
    features: ['Live chat', 'Auto-responses', 'Visitor engagement'],
  },
  {
    id: 'callpage',
    name: 'CallPage - Call Tracking',
    description: 'Track and optimize phone calls from campaigns',
    icon: Phone,
    href: '/dashboard/tools-features/callpage',
    category: 'Call Tracking',
    status: 'implemented',
    features: ['Phone tracking', 'Call recording', 'Call analytics'],
  },
  {
    id: 'leadfeeder',
    name: 'Leadfeeder - Visitor Intelligence',
    description: 'Track B2B companies visiting your website',
    icon: Globe,
    href: '/dashboard/tools-features/leadfeeder',
    category: 'Website Intelligence',
    status: 'implemented',
    features: ['Company tracking', 'Intent signals', 'Decision maker identification'],
  },
  {
    id: 'aeroleads',
    name: 'AeroLeads - B2B Email Finder',
    description: 'Find verified B2B professional emails quickly',
    icon: Database,
    href: '/dashboard/tools-features/aeroleads',
    category: 'Email & Contact',
    status: 'implemented',
    features: ['Email search', 'B2B database', 'Verification scoring'],
  },
  {
    id: 'rollworks',
    name: 'RollWorks - ABM',
    description: 'Target and engage high-value accounts strategically',
    icon: Briefcase,
    href: '/dashboard/tools-features/rollworks',
    category: 'Account-Based Marketing',
    status: 'implemented',
    features: ['Account targeting', 'Priority scoring', 'Campaign tracking'],
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive - Sales CRM',
    description: 'Manage deals and track your sales pipeline',
    icon: TrendingUp,
    href: '/dashboard/tools-features/pipedrive',
    category: 'Sales Pipeline',
    status: 'implemented',
    features: ['Deal pipeline', 'Sales forecasting', 'Performance tracking'],
  },
  {
    id: 'hubspot',
    name: 'HubSpot Marketing Hub',
    description: 'Marketing automation and CRM platform',
    icon: Settings,
    href: '/dashboard/tools-features/hubspot',
    category: 'Marketing Automation',
    status: 'implemented',
    features: ['Email campaigns', 'Workflow automation', 'Contact management'],
  },
  {
    id: 'zendesk',
    name: 'Zendesk Sell - Sales CRM',
    description: 'Manage accounts, contacts, and sales activities',
    icon: Headset,
    href: '/dashboard/tools-features/zendesk',
    category: 'Sales CRM',
    status: 'implemented',
    features: ['Account management', 'Activity logging', 'Sales operations'],
  },
  {
    id: 'apollo',
    name: 'Apollo.io - B2B Lead Database',
    description: 'Find and verify B2B professional contact information',
    icon: Search,
    href: '/dashboard/tools-features/apollo',
    category: 'Lead Intelligence',
    status: 'implemented',
    features: ['Lead search', 'Email verification', 'CSV export'],
  },
  {
    id: 'salesforce-marketing-cloud',
    name: 'Salesforce Marketing Cloud',
    description: 'Enterprise campaign orchestration across channels',
    icon: Cloud,
    href: '/dashboard/tools-features/salesforce-marketing-cloud',
    category: 'Enterprise Automation',
    status: 'implemented',
    features: ['Journey campaigns', 'Cross-channel messaging', 'Performance reporting'],
  },
  {
    id: 'extole',
    name: 'Extole - Referral & Advocacy',
    description: 'Build referral programs and track advocate performance',
    icon: Gift,
    href: '/dashboard/tools-features/extole',
    category: 'Referral Marketing',
    status: 'implemented',
    features: ['Referral programs', 'Advocate tracking', 'Reward management'],
  },
]

export default function ToolsFeaturesPage() {
  const implementedTools = tools.filter(t => t.status === 'implemented')
  const comingSoonTools = tools.filter(t => t.status === 'coming-soon')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">AI-Powered Tools Library</h1>
        <p className="text-muted-foreground mt-2">
          Integrated lead generation and marketing tools built directly into LeadGen
        </p>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/dashboard/tools-features/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Open Unified Analytics Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {implementedTools.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            Available Now ({implementedTools.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {implementedTools.map(tool => {
              const Icon = tool.icon
              return (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">{tool.category}</p>
                        </div>
                      </div>
                      <Badge>Live</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">Key Features:</p>
                      <ul className="space-y-1">
                        {tool.features.map((feature, idx) => (
                          <li key={idx} className="text-xs flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button asChild className="w-full mt-4">
                      <Link href={tool.href}>Open Tool</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {comingSoonTools.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Coming Soon ({comingSoonTools.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {comingSoonTools.map(tool => {
              const Icon = tool.icon
              return (
                <Card key={tool.id} className="opacity-60">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-muted rounded-lg">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">{tool.category}</p>
                        </div>
                      </div>
                      <Badge variant="outline">Soon</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">Key Features:</p>
                      <ul className="space-y-1">
                        {tool.features.map((feature, idx) => (
                          <li key={idx} className="text-xs flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full mt-4" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
