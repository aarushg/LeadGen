import { getToolProfile, type ToolProfile } from '@/lib/tool-profiles'

export interface ToolExecutionResult {
  tool: string
  executedAt: string
  input: Record<string, unknown>
  output: ToolContractResult
}

interface SearchResult {
  title: string
  url: string
  content: string
}

interface CorpusEntry extends SearchResult {
  pageText: string
  host: string
}

interface SourceReference {
  title: string
  url: string
}

interface DiscoveryItem {
  id: string
  kind: string
  label: string
  company?: string
  email?: string
  title?: string
  location?: string
  url?: string
  confidence?: number
  verified?: boolean
  source: string
}

interface DiscoveryBundle {
  mode: 'public-web-discovery'
  query: Record<string, string>
  totalFound: number
  items: DiscoveryItem[]
  sources: SourceReference[]
}

interface ToolContractRecord extends Record<string, unknown> {
  id: string
  type: string
  name: string
  company?: string
  email?: string
  title?: string
  location?: string
  url?: string
  confidence?: number
  verified?: boolean
  status?: string
  source?: string
}

interface ToolContractMetric {
  key: string
  label: string
  value: number | string
}

interface ToolContractAction {
  type: string
  label: string
  status: 'ready' | 'review'
}

interface ToolContractResult extends Record<string, unknown> {
  resultVersion: 'tools-library-v1'
  tool: string
  capability: string
  mode: 'public-web-discovery'
  researchBasis: string
  modes: string[]
  inputSchema: ToolProfile['inputFields']
  outputSchema: {
    recordType: ToolProfile['recordType']
    primaryCollections: string[]
  }
  query: Record<string, string>
  totalFound: number
  records: ToolContractRecord[]
  sources: SourceReference[]
  metrics: ToolContractMetric[]
  actions: ToolContractAction[]
  summary: string
  discovery: DiscoveryBundle
}

interface PublicLead {
  id: string
  firstName: string
  lastName: string
  contactName: string
  email: string
  company: string
  title: string
  industry: string
  seniority: string
  companySize: string
  location: string
  phone: string
  phoneNumber: string
  linkedinUrl: string | undefined
  linkedinURL: string | undefined
  buyingIntent: string
  engagementScore: number
  dataQuality: string
  quality: string
  verified: boolean
  source: string
}

const ROLE_HINTS = ['ceo', 'founder', 'manager', 'director', 'head', 'vp', 'marketing', 'sales']
const INDUSTRY_HINTS = [
  'technology',
  'software',
  'healthcare',
  'finance',
  'manufacturing',
  'retail',
  'education',
  'marketing',
]

function stripProtocol(value: string) {
  return value.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase()
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)]
}

function decodeDuckDuckGoUrl(url: string) {
  try {
    if (url.startsWith('//')) {
      return `https:${url}`
    }

    if (url.startsWith('/l/?')) {
      const parsed = new URL(`https://duckduckgo.com${url}`)
      const uddg = parsed.searchParams.get('uddg')
      return uddg ? decodeURIComponent(uddg) : ''
    }

    return url
  } catch {
    return ''
  }
}

function getString(input: Record<string, unknown>, key: string, fallback = ''): string {
  const value = input[key]
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

async function tavilySearch(query: string, maxResults = 5): Promise<SearchResult[]> {
  if (!process.env.TAVILY_API_KEY) return []

  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        max_results: maxResults,
        search_depth: 'advanced',
      }),
      cache: 'no-store',
    })

    if (!res.ok) return []
    const data = await res.json()
    return ((data.results ?? []) as Array<{ title?: string; url?: string; content?: string }>)
      .filter(result => Boolean(result.url) && Boolean(result.title))
      .map(result => ({
        title: result.title || '',
        url: result.url || '',
        content: result.content || '',
      }))
  } catch {
    return []
  }
}

async function duckDuckGoSearch(query: string, maxResults = 5): Promise<SearchResult[]> {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      cache: 'no-store',
    })

    if (!res.ok) return []

    const html = await res.text()
    const matches = [...html.matchAll(/<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]

    const results: SearchResult[] = []

    for (const match of matches) {
      const resolvedUrl = decodeDuckDuckGoUrl(match[1] || '')
      const title = (match[2] || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      if (!resolvedUrl || !title) continue

      results.push({
        title,
        url: resolvedUrl,
        content: '',
      })

      if (results.length >= maxResults) break
    }

    return results
  } catch {
    return []
  }
}

async function fetchPageText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LeadGenBot/1.0' },
      cache: 'no-store',
    })

    if (!res.ok) return ''
    const html = await res.text()
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  } catch {
    return ''
  }
}

async function fetchWebsitePages(domainOrUrl: string): Promise<SearchResult[]> {
  const host = stripProtocol(domainOrUrl)
  if (!host) return []

  const baseUrl = `https://${host}`
  const candidatePaths = ['', '/contact', '/contact-us', '/about', '/about-us', '/team', '/company']
  const pages = await Promise.all(
    candidatePaths.map(async path => {
      const url = `${baseUrl}${path}`
      const text = await fetchPageText(url)
      if (!text) return null
      return {
        title: path ? `${host}${path}` : host,
        url,
        content: text.slice(0, 1200),
      }
    })
  )

  return pages.reduce<SearchResult[]>((acc, page) => {
    if (page) acc.push(page)
    return acc
  }, [])
}

function extractEmails(text: string, domain?: string): string[] {
  const matches = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []
  return unique(
    matches
      .map(email => email.toLowerCase())
      .filter(email => !domain || email.endsWith(`@${domain}`))
  )
}

function getUrlHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function parseEmailPattern(localPart: string, firstName: string, lastName: string): string {
  const first = firstName.toLowerCase()
  const last = lastName.toLowerCase()
  if (localPart === `${first}.${last}`) return 'first.last'
  if (localPart === `${first}${last}`) return 'firstlast'
  if (localPart === `${first[0]}${last}`) return 'flast'
  if (localPart === `${first}${last[0]}`) return 'firstl'
  if (localPart === first) return 'first'
  return 'custom'
}

function inferNameFromEmail(email: string) {
  const local = email.split('@')[0] || ''
  const [first = '', last = ''] = local.split(/[._-]/)
  return {
    firstName: first ? first.charAt(0).toUpperCase() + first.slice(1) : '',
    lastName: last ? last.charAt(0).toUpperCase() + last.slice(1) : '',
  }
}

function inferIndustryFromText(text: string): string {
  const normalized = text.toLowerCase()
  const found = INDUSTRY_HINTS.find(industry => normalized.includes(industry))
  if (!found) return ''
  return found.charAt(0).toUpperCase() + found.slice(1)
}

function inferRoleFromText(text: string, fallback: string): string {
  const normalized = text.toLowerCase()
  const found = ROLE_HINTS.find(role => normalized.includes(role))
  if (!found) return fallback || ''
  return found
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function confidenceFromSignals(signals: { exactEmail?: boolean; publicEmail?: boolean; publicProfile?: boolean; sourceCount: number }) {
  let score = 35
  if (signals.exactEmail) score += 30
  if (signals.publicEmail) score += 20
  if (signals.publicProfile) score += 10
  score += Math.min(20, signals.sourceCount * 5)
  return Math.min(100, score)
}

function toSourceReferences(entries: CorpusEntry[], limit = 6): SourceReference[] {
  return entries.map(result => ({ title: result.title, url: result.url })).slice(0, limit)
}

function toDiscoveryBundle(query: Record<string, string>, items: DiscoveryItem[], sources: SourceReference[]): DiscoveryBundle {
  return {
    mode: 'public-web-discovery',
    query,
    totalFound: items.length,
    items,
    sources,
  }
}

function toStringMap(input: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(input)
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : String(value ?? '').trim()])
      .filter(([, value]) => Boolean(value))
  ) as Record<string, string>
}

function buildToolActions(profile: ToolProfile, totalFound: number): ToolContractAction[] {
  const baseActionByCapability: Record<string, string[]> = {
    'contact-discovery': ['Review highest-confidence contacts', 'Validate best-fit outreach targets', 'Export source-backed contacts'],
    'contact-enrichment': ['Review enriched contact profile', 'Confirm verification status', 'Push verified contact into outreach'],
    'outreach-automation': ['Draft sequence using discovered signals', 'Prioritize best-fit prospects', 'Launch follow-up workflow'],
    'lead-scoring': ['Prioritize highest-intent accounts', 'Route strongest signals to sales', 'Review scoring assumptions'],
    'marketing-automation': ['Review campaign-ready pages', 'Map audience and message', 'Plan next nurture step'],
    'lead-capture': ['Review capture entry points', 'Test strongest conversion prompt', 'Add follow-up workflow'],
    'webinar-engagement': ['Review event signals', 'Plan registration flow', 'Schedule follow-up sequence'],
    'conversational-engagement': ['Review conversation entry points', 'Define qualification path', 'Prepare handoff rules'],
    'callback-automation': ['Review callback touchpoints', 'Define routing logic', 'Prioritize fast-response pages'],
    'visitor-intelligence': ['Review identified accounts', 'Prioritize intent-heavy visitors', 'Create follow-up watchlist'],
    'account-intelligence': ['Review target accounts', 'Identify buying signals', 'Prioritize account research'],
    'crm-pipeline': ['Review deal-ready accounts', 'Create next activity plan', 'Attach research to pipeline record'],
    'lead-sync': ['Review sync sources', 'Map routing destinations', 'Confirm conversion handoff'],
    'referral-marketing': ['Review advocacy surfaces', 'Design referral trigger', 'Plan reward follow-up'],
    'account-based-marketing': ['Review target account list', 'Prioritize account signals', 'Plan coordinated outreach'],
  }

  return (baseActionByCapability[profile.capability] ?? ['Review source-backed records', 'Prepare next step', 'Continue workflow'])
    .map((label, index) => ({
      type: profile.modes[index] ?? profile.modes[0] ?? 'review',
      label,
      status: (totalFound > 0 || index === 0 ? 'ready' : 'review') as 'ready' | 'review',
    }))
    .slice(0, 3)
}

function buildToolMetrics(
  profile: ToolProfile,
  totalFound: number,
  sources: SourceReference[],
  input: Record<string, unknown>
): ToolContractMetric[] {
  const filledInputs = profile.inputFields.filter(field => Boolean(getString(input, field.key))).length
  return [
    { key: 'recordsFound', label: 'Records Found', value: totalFound },
    { key: 'sourcesReviewed', label: 'Sources Reviewed', value: sources.length },
    { key: 'inputsMatched', label: 'Inputs Matched', value: `${filledInputs}/${profile.inputFields.length}` },
  ]
}

function wrapToolOutput(args: {
  toolName: string
  input: Record<string, unknown>
  records: ToolContractRecord[]
  totalFound: number
  sources: SourceReference[]
  discovery: DiscoveryBundle
  summary: string
  legacy: Record<string, unknown>
}): ToolContractResult {
  const profile = getToolProfile(args.toolName)
  const query = { tool: args.toolName, ...toStringMap(args.input) }

  return {
    ...args.legacy,
    resultVersion: 'tools-library-v1',
    tool: args.toolName,
    capability: profile.capability,
    mode: 'public-web-discovery',
    researchBasis: profile.researchBasis,
    modes: profile.modes,
    inputSchema: profile.inputFields,
    outputSchema: {
      recordType: profile.recordType,
      primaryCollections: ['records', 'sources', 'metrics', 'actions'],
    },
    query,
    totalFound: args.totalFound,
    records: args.records,
    sources: args.sources,
    metrics: buildToolMetrics(profile, args.totalFound, args.sources, args.input),
    actions: buildToolActions(profile, args.totalFound),
    summary: args.summary,
    discovery: args.discovery,
  }
}

function publicLeadToRecord(lead: PublicLead): ToolContractRecord {
  return {
    id: lead.id,
    type: 'contact',
    name: lead.contactName,
    company: lead.company,
    email: lead.email,
    title: lead.title,
    location: lead.location,
    url: lead.linkedinURL,
    confidence: lead.engagementScore,
    verified: lead.verified,
    status: lead.quality,
    source: lead.source,
  }
}

async function collectSearchCorpus(queries: string[], maxResults = 5) {
  const searchGroups = await Promise.all(
    queries.map(async query => {
      const [tavilyResults, ddgResults] = await Promise.all([
        tavilySearch(query, maxResults),
        duckDuckGoSearch(query, maxResults),
      ])
      return [...tavilyResults, ...ddgResults]
    })
  )

  const merged = searchGroups.flat().filter(result => result.url)
  const deduped = unique(merged.map(result => result.url)).map(
    url => merged.find(item => item.url === url) as SearchResult
  )

  const pageTexts = await Promise.all(deduped.slice(0, 8).map(result => fetchPageText(result.url)))

  return deduped.slice(0, 8).map((result, index) => ({
    ...result,
    pageText: pageTexts[index] ?? '',
    host: getUrlHost(result.url),
  }))
}

async function enrichWithWebsitePages(entries: CorpusEntry[], domainOrUrl?: string) {
  if (!domainOrUrl) return entries

  const websitePages = await fetchWebsitePages(domainOrUrl)
  const existingUrls = new Set(entries.map(entry => entry.url))
  const appended = websitePages.filter(page => !existingUrls.has(page.url))
  const pageTexts = await Promise.all(appended.map(page => fetchPageText(page.url)))

  return [
    ...entries,
    ...appended.map((page, index) => ({
      ...page,
      pageText: pageTexts[index] ?? page.content ?? '',
      host: getUrlHost(page.url),
    })),
  ]
}

async function buildHunterResult(input: Record<string, unknown>) {
  const domain = stripProtocol(getString(input, 'domain'))
  const firstName = getString(input, 'firstName').toLowerCase()
  const lastName = getString(input, 'lastName').toLowerCase()

  let corpus = await collectSearchCorpus([
    `site:${domain} email contact`,
    `"@${domain}"`,
    firstName && lastName ? `"${firstName} ${lastName}" "${domain}"` : `"${domain}" team`,
  ])
  corpus = await enrichWithWebsitePages(corpus, domain)

  const allEmails = unique(
    corpus.flatMap(result => extractEmails(`${result.content ?? ''} ${result.pageText}`, domain))
  )

  const emails = allEmails.slice(0, 10).map(email => {
    const localPart = email.split('@')[0] || ''
    const matchingSources = corpus.filter(result => `${result.content ?? ''} ${result.pageText}`.toLowerCase().includes(email))
    return {
      email,
      confidence: confidenceFromSignals({ publicEmail: true, sourceCount: matchingSources.length }),
      source: matchingSources[0]?.host || domain,
      pattern: firstName && lastName ? parseEmailPattern(localPart, firstName, lastName) : 'publicly-found',
    }
  })

  const discovery = toDiscoveryBundle(
    {
      tool: 'Hunter',
      domain,
      firstName,
      lastName,
    },
    emails.map((item, index) => ({
      id: `hunter-${index + 1}`,
      kind: 'email',
      label: item.email,
      email: item.email,
      confidence: item.confidence,
      verified: true,
      source: item.source,
    })),
    toSourceReferences(corpus)
  )

  return {
    emails,
    patterns: unique(emails.map(item => `${item.pattern}@${domain}`)),
    confidence: String(confidenceFromSignals({ publicEmail: emails.length > 0, sourceCount: corpus.length })),
    sources: discovery.sources,
    discovery,
  }
}

async function buildUpleadResult(input: Record<string, unknown>) {
  const email = getString(input, 'email').toLowerCase()
  const [local, host] = email.split('@')
  const companySlug = host?.split('.')[0] || ''
  const inferredName = inferNameFromEmail(email)

  let corpus = await collectSearchCorpus([
    `"${email}"`,
    host ? `"${host}" company industry headquarters` : '',
    host ? `site:${host} about` : '',
  ].filter(Boolean))
  corpus = await enrichWithWebsitePages(corpus, host)

  const exactEmailMatch = corpus.some(result => `${result.content ?? ''} ${result.pageText}`.toLowerCase().includes(email))
  const publicSources = corpus.map(result => result.host).filter(Boolean)
  const textBlob = corpus.map(result => `${result.title} ${result.content ?? ''} ${result.pageText}`).join(' ')

  const companyNameFromTitle = corpus[0]?.title.split(/[-|:]/)[0]?.trim() || companySlug
  const industry = inferIndustryFromText(textBlob)
  const title = inferRoleFromText(textBlob, '')

  const sources = toSourceReferences(corpus)
  const discovery = toDiscoveryBundle(
    {
      tool: 'UpLead',
      email,
      domain: host || '',
    },
    [
      {
        id: 'uplead-1',
        kind: 'contact',
        label: `${inferredName.firstName || ''} ${inferredName.lastName || ''}`.trim() || email,
        company: companyNameFromTitle,
        email,
        title,
        location: textBlob.match(/\b(?:[A-Z][a-z]+,\s?[A-Z]{2}|United States|United Kingdom|Canada|Australia)\b/)?.[0] || '',
        confidence: confidenceFromSignals({ exactEmail: exactEmailMatch, publicProfile: corpus.length > 0, sourceCount: corpus.length }),
        verified: exactEmailMatch,
        source: sources[0]?.url || host || '',
      },
    ],
    sources
  )

  return {
    email,
    confidence: confidenceFromSignals({ exactEmail: exactEmailMatch, publicProfile: corpus.length > 0, sourceCount: corpus.length }),
    person: {
      firstName: inferredName.firstName || '',
      lastName: inferredName.lastName || '',
      title,
      seniority: title.toLowerCase().includes('chief') || title.toLowerCase().includes('vp') ? 'Executive' : title ? 'Manager' : '',
      linkedinUrl: corpus.find(result => result.url.includes('linkedin.com/in'))?.url,
    },
    company: {
      name: companyNameFromTitle,
      domain: host || '',
      industry,
      size: '',
      location: textBlob.match(/\b(?:[A-Z][a-z]+,\s?[A-Z]{2}|United States|United Kingdom|Canada|Australia)\b/)?.[0] || '',
      website: host || '',
      linkedinUrl: corpus.find(result => result.url.includes('linkedin.com/company'))?.url,
    },
    verification: {
      emailValid: exactEmailMatch,
      webSignals: corpus.length,
      sources: unique(publicSources).slice(0, 6),
    },
    enrichmentLevel: exactEmailMatch ? 'complete' : corpus.length > 0 ? 'partial' : 'limited',
    lastUpdated: new Date().toISOString(),
    sources,
    discovery,
  }
}

async function discoverPublicLeads(input: Record<string, unknown>, countDefault = 8) {
  const role = getString(input, 'targetRole', getString(input, 'searchTerm', ''))
  const industry = getString(input, 'industry', '')
  const company = getString(input, 'company', '')
  const location = getString(input, 'location', '')
  const maxResults = Number(input.maxResults ?? countDefault)
  const total = Number.isFinite(maxResults) ? Math.min(Math.max(maxResults, 3), 25) : countDefault

  let corpus = await collectSearchCorpus([
    [company, role, location].filter(Boolean).join(' '),
    [industry, role, location, 'contact'].filter(Boolean).join(' '),
    company && role ? `site:linkedin.com/in "${company}" "${role}"` : [industry, role, 'linkedin'].filter(Boolean).join(' '),
  ].filter(Boolean), Math.min(total, 8))

  const companyDomainGuess = company ? `${company.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com` : ''
  corpus = await enrichWithWebsitePages(corpus, companyDomainGuess)

  const leads = corpus
    .map((result, index) => {
      const text = `${result.title} ${result.content ?? ''} ${result.pageText}`
      const publicEmails = extractEmails(text)
      const nameMatch = result.title.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/)
      const inferredCompany = company || result.title.split(/[-|]/)[1]?.trim() || result.host.split('.')[0]
      const email = publicEmails[0] || ''

      if (!nameMatch && !email) return null

      const inferred = inferNameFromEmail(email)
      const fullName = nameMatch?.[1] || [inferred.firstName, inferred.lastName].filter(Boolean).join(' ') || email.split('@')[0]
      const [firstName = fullName, lastName = ''] = fullName.split(' ')
      const leadTitle = inferRoleFromText(text, role || '')
      const leadIndustry = industry || inferIndustryFromText(text)
      const confidence = confidenceFromSignals({
        publicEmail: Boolean(email),
        publicProfile: result.url.includes('linkedin.com'),
        sourceCount: 1,
      })

      return {
        id: `${index + 1}-${stripProtocol(result.host || result.url)}`,
        firstName,
        lastName,
        contactName: fullName,
        email,
        company: inferredCompany,
        title: leadTitle,
        industry: leadIndustry,
        seniority: leadTitle.toLowerCase().includes('chief') || leadTitle.toLowerCase().includes('vp') ? 'executive' : leadTitle ? 'manager' : '',
        companySize: getString(input, 'companySize', ''),
        location: location || text.match(/\b(?:[A-Z][a-z]+,\s?[A-Z]{2}|United States|United Kingdom|Canada|Australia)\b/)?.[0] || '',
        phone: '',
        phoneNumber: '',
        linkedinUrl: result.url.includes('linkedin.com') ? result.url : undefined,
        linkedinURL: result.url.includes('linkedin.com') ? result.url : undefined,
        buyingIntent: publicEmails.length > 0 ? 'high' : 'medium',
        engagementScore: Math.min(100, 40 + confidence),
        dataQuality: email ? 'verified' : 'potential',
        quality: email ? 'verified' : 'potential',
        verified: Boolean(email),
        source: result.url,
      } satisfies PublicLead
    })
    .filter((lead): lead is PublicLead => Boolean(lead))
    .slice(0, total)

  const sources = toSourceReferences(corpus, total)
  const discovery = toDiscoveryBundle(
    {
      tool: 'lead-search',
      company,
      role,
      industry,
      location,
    },
    leads.map(lead => ({
      id: lead.id,
      kind: 'lead',
      label: lead.contactName,
      company: lead.company,
      email: lead.email,
      title: lead.title,
      location: lead.location,
      url: lead.linkedinURL,
      confidence: lead.engagementScore,
      verified: lead.verified,
      source: lead.source,
    })),
    sources
  )

  return {
    leads,
    role,
    industry,
    company,
    location,
    total: leads.length,
    sources,
    discovery,
  }
}

async function buildGenericResult(toolName: string, input: Record<string, unknown>) {
  const profile = getToolProfile(toolName)
  const company = getString(input, 'company')
  const domain = stripProtocol(getString(input, 'domain', getString(input, 'website')))
  const searchTerm = getString(input, 'searchTerm', getString(input, 'targetRole'))
  let corpus = await collectSearchCorpus(
    [
      [company, searchTerm, toolName].filter(Boolean).join(' '),
      domain ? `site:${domain} ${searchTerm || toolName}` : '',
      company ? `${company} ${toolName} contact team` : `${toolName} public company information`,
    ].filter(Boolean),
    6
  )
  corpus = await enrichWithWebsitePages(corpus, domain)

  const records: ToolContractRecord[] = corpus.slice(0, 10).map((entry, index) => {
    const text = `${entry.title} ${entry.content} ${entry.pageText}`
    const emails = extractEmails(text)
    const inferredCompany = company || entry.host.split('.')[0].replace(/[-_]/g, ' ')

    return {
      id: `${toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index + 1}`,
      type: profile.recordType,
      name: entry.title.split(/[-|:]/)[0]?.trim() || inferredCompany || toolName,
      company: inferredCompany || undefined,
      email: emails[0],
      title: inferRoleFromText(text, searchTerm || profile.capability),
      location: text.match(/\b(?:[A-Z][a-z]+,\s?[A-Z]{2}|United States|United Kingdom|Canada|Australia)\b/)?.[0] || undefined,
      url: entry.url,
      confidence: Math.min(95, 55 + Math.min(20, emails.length * 10)),
      verified: emails.length > 0,
      status: 'source-backed',
      source: entry.url,
      snippet: text.slice(0, 220),
    }
  })

  const items: DiscoveryItem[] = records.map(record => ({
    id: record.id,
    kind: record.type,
    label: record.name,
    company: record.company,
    email: record.email,
    title: record.title,
    location: record.location,
    url: record.url,
    confidence: record.confidence,
    verified: record.verified,
    source: record.source || record.url || '',
  }))

  const discovery = toDiscoveryBundle(
    {
      tool: toolName,
      company,
      domain,
      searchTerm,
    },
    items,
    toSourceReferences(corpus)
  )

  return {
    summary: `Executed ${toolName} using public web discovery aligned to ${profile.capability}`,
    estimatedImpact: `${discovery.totalFound} source-backed records discovered`,
    nextActions: [
      'Review source-backed records',
      'Open the strongest matching sources',
      'Continue in the tool workflow with the normalized contract',
    ],
    discovery,
    sources: discovery.sources,
    items: discovery.items,
    records,
    totalFound: discovery.totalFound,
  }
}

export async function runToolByName(toolName: string, input: Record<string, unknown>): Promise<ToolExecutionResult> {
  const normalized = toolName.toLowerCase()
  let output: ToolContractResult

  if (normalized.includes('hunter')) {
    const hunter = await buildHunterResult(input)
    const domain = stripProtocol(getString(input, 'domain'))
    output = wrapToolOutput({
      toolName,
      input,
      records: hunter.emails.map((item, index) => ({
        id: `hunter-${index + 1}`,
        type: 'contact',
        name: item.email,
        company: domain || undefined,
        email: item.email,
        confidence: item.confidence,
        verified: true,
        status: item.pattern,
        source: item.source,
      })),
      totalFound: hunter.emails.length,
      sources: hunter.sources,
      discovery: hunter.discovery,
      summary: hunter.emails.length
        ? `Hunter-style domain discovery found ${hunter.emails.length} public email matches`
        : 'Hunter-style domain discovery found no public email matches',
      legacy: hunter,
    })
  } else if (normalized.includes('uplead')) {
    const uplead = await buildUpleadResult(input)
    output = wrapToolOutput({
      toolName,
      input,
      records: [
        {
          id: 'uplead-1',
          type: 'contact',
          name: `${uplead.person.firstName} ${uplead.person.lastName}`.trim(),
          company: uplead.company.name,
          email: uplead.email,
          title: uplead.person.title,
          location: uplead.company.location,
          url: (uplead.person.linkedinUrl as string | undefined) || (uplead.company.linkedinUrl as string | undefined),
          confidence: Number(uplead.confidence),
          verified: Boolean(uplead.verification.emailValid),
          status: String(uplead.enrichmentLevel),
          source: (uplead.sources[0]?.url as string | undefined) || '',
        },
      ],
      totalFound: 1,
      sources: uplead.sources,
      discovery: uplead.discovery,
      summary: `UpLead-style enrichment ${uplead.enrichmentLevel} for ${uplead.email}`,
      legacy: uplead,
    })
  } else if (normalized.includes('leadfuze')) {
    const leadData = await discoverPublicLeads(input, 10)
    output = wrapToolOutput({
      toolName,
      input,
      records: leadData.leads.map(publicLeadToRecord),
      totalFound: leadData.total,
      sources: leadData.sources,
      discovery: leadData.discovery,
      summary: `LeadFuze-style list building found ${leadData.total} source-backed contacts`,
      legacy: {
      leads: leadData.leads,
        totalFound: leadData.total,
        filters: {
          role: leadData.role,
          industry: leadData.industry,
          companySize: getString(input, 'companySize', 'Any'),
          location: leadData.location,
        },
        sourceQuality: 'Public web discovery via LeadGen',
        sources: leadData.sources,
        discovery: leadData.discovery,
      },
    })
  } else if (normalized.includes('apollo') || normalized.includes('aeroleads')) {
    const leadData = await discoverPublicLeads(input, 8)
    output = wrapToolOutput({
      toolName,
      input,
      records: leadData.leads.map(publicLeadToRecord),
      totalFound: leadData.total,
      sources: leadData.sources,
      discovery: leadData.discovery,
      summary: `${toolName} contact discovery found ${leadData.total} source-backed matches`,
      legacy: {
        leads: leadData.leads,
        sources: leadData.sources,
        discovery: leadData.discovery,
        totalFound: leadData.total,
      },
    })
  } else {
    const generic = await buildGenericResult(toolName, input)
    output = wrapToolOutput({
      toolName,
      input,
      records: (generic.records as ToolContractRecord[]) ?? [],
      totalFound: Number(generic.totalFound ?? 0),
      sources: (generic.sources as SourceReference[]) ?? [],
      discovery: generic.discovery as DiscoveryBundle,
      summary: String(generic.summary ?? `Executed ${toolName}`),
      legacy: generic,
    })
  }

  return {
    tool: toolName,
    executedAt: new Date().toISOString(),
    input,
    output,
  }
}
