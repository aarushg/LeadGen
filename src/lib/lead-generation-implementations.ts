export type ImplementedFeatureKey =
  | 'LGF-0001'
  | 'LGF-0002'
  | 'LGF-0003'
  | 'LGF-0004'
  | 'LGF-0005'
  | 'LGF-0006'
  | 'LGF-0007'
  | 'LGF-0008'
  | 'LGF-0009'
  | 'LGF-0010'

export type ImplementedFeatureDefinition = {
  key: ImplementedFeatureKey
  title: string
  description: string
  placeholder: string
}

export const implementedFeatureDefinitions: ImplementedFeatureDefinition[] = [
  {
    key: 'LGF-0001',
    title: 'Audience Targeting Intent Signals Optimizer',
    description: 'Scores audience intent signals and recommends budget focus.',
    placeholder: 'Enter one signal per line: signal,score (e.g. pricing-page-view,9)',
  },
  {
    key: 'LGF-0002',
    title: 'Offer Design CTA Variants Analyzer',
    description: 'Ranks CTA options using clarity, urgency, and specificity heuristics.',
    placeholder: 'Enter one CTA per line',
  },
  {
    key: 'LGF-0003',
    title: 'Landing Pages Follow-Up Cadence Builder',
    description: 'Builds a suggested follow-up cadence based on urgency and cycle length.',
    placeholder: 'Enter cycle days and urgency: 14,high',
  },
  {
    key: 'LGF-0004',
    title: 'Lead Capture Content Briefs Planner',
    description: 'Generates a lead magnet brief structure from topic and audience.',
    placeholder: 'Enter topic | audience (e.g. B2B SEO audit | SaaS founders)',
  },
  {
    key: 'LGF-0005',
    title: 'Email Outreach Churn Risk Generator',
    description: 'Estimates churn risk from inactivity and engagement signals.',
    placeholder: 'Enter inactivityDays,openRate,replyRate (e.g. 30,18,2)',
  },
  {
    key: 'LGF-0006',
    title: 'LinkedIn Outreach Attribution Paths Dashboard',
    description: 'Aggregates touchpoint paths into top conversion routes.',
    placeholder: 'Enter one path per line (e.g. connect>followup>meeting)',
  },
  {
    key: 'LGF-0007',
    title: 'Cold Calling Reactivation Triggers Tracker',
    description: 'Identifies reactivation triggers from stale lead reasons.',
    placeholder: 'Enter one stale reason per line',
  },
  {
    key: 'LGF-0008',
    title: 'Paid Ads ICP Match Playbook',
    description: 'Scores ad lead fit against ICP attributes and suggests actions.',
    placeholder: 'Enter lead attributes comma-separated (e.g. saas,50-200,us,decision-maker)',
  },
  {
    key: 'LGF-0009',
    title: 'SEO Form Flow Sequencer',
    description: 'Orders form fields to reduce friction and increase completion.',
    placeholder: 'Enter one field per line',
  },
  {
    key: 'LGF-0010',
    title: 'Content Marketing Creative Angles Assistant',
    description: 'Generates creative angles for content campaigns.',
    placeholder: 'Enter product | audience | pain point',
  },
]

function safeNum(value: string, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function rankLines(lines: string[]): Array<{ line: string; score: number }> {
  return lines
    .map((line) => {
      const words = line.trim().split(/\s+/).filter(Boolean).length
      const hasAction = /(book|start|get|download|claim|schedule|discover|generate)/i.test(line)
      const hasSpecific = /\d|%|today|now|free|minutes|days/i.test(line)
      const score = Math.min(100, words * 8 + (hasAction ? 25 : 0) + (hasSpecific ? 20 : 0))
      return { line, score }
    })
    .sort((a, b) => b.score - a.score)
}

export function runImplementedFeature(key: ImplementedFeatureKey, rawInput: string): string {
  const input = rawInput.trim()

  switch (key) {
    case 'LGF-0001': {
      const signals = input
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [name, score] = line.split(',')
          return { name: name?.trim() || 'unknown', score: safeNum(score ?? '0') }
        })
        .sort((a, b) => b.score - a.score)

      const top = signals.slice(0, 5)
      const avg = signals.length > 0 ? signals.reduce((sum, s) => sum + s.score, 0) / signals.length : 0
      return [
        'Intent Signal Optimization Report',
        `Average intent score: ${avg.toFixed(1)}`,
        'Top focus signals:',
        ...top.map((s, idx) => `${idx + 1}. ${s.name} (score ${s.score})`),
        'Recommendation: prioritize outreach and retargeting to top 3 signals first.',
      ].join('\n')
    }

    case 'LGF-0002': {
      const ctas = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
      const ranked = rankLines(ctas).slice(0, 5)
      return [
        'CTA Variant Analysis',
        ...ranked.map((item, idx) => `${idx + 1}. ${item.line} -> ${item.score}/100`),
        'Recommendation: test top 2 variants against current control for 7 days.',
      ].join('\n')
    }

    case 'LGF-0003': {
      const [daysStr, urgencyRaw] = input.split(',').map((v) => v?.trim())
      const days = Math.max(3, safeNum(daysStr ?? '14', 14))
      const urgency = (urgencyRaw || 'medium').toLowerCase()
      const cadence = urgency === 'high' ? [0, 1, 3, 6, 10] : urgency === 'low' ? [0, 3, 7, 14] : [0, 2, 5, 9, 14]
      const normalized = cadence.filter((d) => d <= days)
      return [
        'Follow-Up Cadence Plan',
        `Cycle length: ${days} days`,
        `Urgency: ${urgency}`,
        `Touchpoints: Day ${normalized.join(', Day ')}`,
        'Recommendation: use educational touchpoints before direct ask on final step.',
      ].join('\n')
    }

    case 'LGF-0004': {
      const [topicRaw, audienceRaw] = input.split('|')
      const topic = topicRaw?.trim() || 'Lead Generation Topic'
      const audience = audienceRaw?.trim() || 'Target Audience'
      return [
        'Lead Capture Content Brief',
        `Topic: ${topic}`,
        `Audience: ${audience}`,
        'Sections:',
        '1. Problem framing and urgency',
        '2. Framework or checklist',
        '3. Quick wins users can apply today',
        '4. Case example and proof',
        '5. CTA to book strategy call',
      ].join('\n')
    }

    case 'LGF-0005': {
      const [inactive, openRate, replyRate] = input.split(',').map((v) => safeNum(v ?? '0'))
      const riskScore = Math.min(100, inactive * 1.5 + Math.max(0, 30 - openRate) + Math.max(0, 10 - replyRate) * 3)
      const band = riskScore >= 70 ? 'High' : riskScore >= 40 ? 'Medium' : 'Low'
      return [
        'Email Churn Risk Estimate',
        `Risk score: ${riskScore.toFixed(1)} (${band})`,
        `Inputs: inactivity=${inactive}d, open=${openRate}%, reply=${replyRate}%`,
        band === 'High'
          ? 'Action: trigger reactivation campaign with new offer + human follow-up.'
          : 'Action: continue nurture with refreshed messaging and segmented content.',
      ].join('\n')
    }

    case 'LGF-0006': {
      const paths = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
      const counts = new Map<string, number>()
      for (const path of paths) {
        counts.set(path, (counts.get(path) ?? 0) + 1)
      }
      const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
      return [
        'LinkedIn Attribution Path Summary',
        ...ranked.map(([path, count], idx) => `${idx + 1}. ${path} -> ${count} conversions`),
        'Recommendation: reinforce top path with stronger CTA in step 2.',
      ].join('\n')
    }

    case 'LGF-0007': {
      const reasons = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
      const triggerMap = reasons.map((reason) => {
        const trigger = /budget|price/i.test(reason)
          ? 'Send ROI calculator + savings case study'
          : /timing|later/i.test(reason)
            ? 'Queue 30-day recheck with industry update'
            : /no response|ghost/i.test(reason)
              ? 'Move to multi-channel reactivation (email + LinkedIn)'
              : 'Send problem-reframing follow-up'
        return { reason, trigger }
      })

      return [
        'Reactivation Trigger Plan',
        ...triggerMap.map((item, idx) => `${idx + 1}. ${item.reason} -> ${item.trigger}`),
      ].join('\n')
    }

    case 'LGF-0008': {
      const attrs = input
        .split(',')
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean)
      const icp = ['saas', '50-200', 'us', 'decision-maker']
      const hits = icp.filter((item) => attrs.includes(item)).length
      const score = Math.round((hits / icp.length) * 100)
      return [
        'ICP Match Playbook',
        `Match score: ${score}%`,
        `Matched attributes: ${hits}/${icp.length}`,
        score >= 75
          ? 'Action: send high-intent sequence and route to senior closer.'
          : 'Action: place in nurture segment and enrich missing firmographics.',
      ].join('\n')
    }

    case 'LGF-0009': {
      const fields = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
      const priority = ['email', 'name', 'company', 'role', 'phone', 'budget']
      const sorted = [...fields].sort((a, b) => {
        const ia = priority.findIndex((p) => a.toLowerCase().includes(p))
        const ib = priority.findIndex((p) => b.toLowerCase().includes(p))
        const pa = ia === -1 ? 999 : ia
        const pb = ib === -1 ? 999 : ib
        return pa - pb
      })
      return [
        'SEO Form Field Sequence',
        ...sorted.map((field, idx) => `${idx + 1}. ${field}`),
        'Recommendation: keep required fields under 4 on first step.',
      ].join('\n')
    }

    case 'LGF-0010': {
      const [productRaw, audienceRaw, painRaw] = input.split('|')
      const product = productRaw?.trim() || 'Your Offer'
      const audience = audienceRaw?.trim() || 'Your Audience'
      const pain = painRaw?.trim() || 'slow lead flow'
      return [
        'Creative Angle Suggestions',
        `1. Outcome-first: "How ${audience} use ${product} to solve ${pain}"`,
        `2. Contrarian: "Why most teams fail at ${pain} and what to do instead"`,
        `3. Proof-first: "Case study: fixing ${pain} in 30 days"`,
        `4. Framework: "The 4-step ${product} method for ${audience}"`,
        `5. Objection-breaker: "You do not need more traffic to fix ${pain}"`,
      ].join('\n')
    }

    default:
      return 'No implementation found for selected feature.'
  }
}
