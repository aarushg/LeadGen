# LeadGen — AI-Powered Marketing Suite

A full-fledged lead generation and marketing platform for agencies, sales teams, and creators. Works on **desktop and mobile**. Powered by Claude AI.

---

## What It Does

Every business wants more leads. This suite gives them the tools to find, research, and close them — faster than anything manual.

---

## Core Features

### 1. Lead Research & Outreach Engine
Give it a target company or contact and it does the heavy lifting:
- Searches across social media, LinkedIn, recent news, and the company website
- Builds a full intelligence brief: company background, contact profile, pain points, recent moves
- Writes a **personalized outreach message** based on real, specific angles from the research
- Supports multiple tones (professional, casual, direct, warm) and channels (email, LinkedIn, Twitter/X)

Sales teams are paying **$2,000–$3,000** for a setup like this.

---

### 2. Proposal Generator
Client fills out a short intake form. The app spits out a complete, formatted proposal — ready to send.

Includes:
- Executive summary
- Scope of work
- Deliverables list
- Week-by-week timeline
- Pricing table
- Terms and call to action
- PDF export

Agencies are willing to pay **$1,000–$2,000** for a setup like this.

---

### 3. Lead Dashboard & CRM
- Full lead database with status tracking
- Kanban board (drag-and-drop pipeline: New → Contacted → Replied → Closed)
- Notes, tags, and activity history per lead
- Stats: total leads, contacted this week, reply rate, proposals sent

---

### 4. AI-Powered Tools Library (Fully Implemented)
Integrated lead generation and marketing tools built directly into the app. Access from **Tools Library** in the sidebar.

**✅ Implemented Tools Library Coverage (23/23) + 1 Bonus Tool:**
- ✅ **Hunter - Email Finder** - Find professional email addresses for any domain
- ✅ **UpLead - Contact Enrichment** - Verify and enrich contacts with B2B data
- ✅ **Overloop - Email Sequences** - Create and automate multi-step email campaigns
- ✅ **LeadFuze - AI Lead Sourcing** - AI-powered prospect list generation
- ✅ **SalesWings - Lead Scoring** - Automatic lead qualification and prioritization
- ✅ **Mailchimp - Email Campaigns** - Email marketing creation and delivery
- ✅ **OptinMonster - Form Builder** - Drag-and-drop lead capture forms & pop-ups
- ✅ **Demio - Webinar Scheduler** - Create and host webinars for lead generation
- ✅ **Intercom - Live Chat** - Real-time chat and customer engagement
- ✅ **CallPage - Call Tracking** - Phone number tracking and call analytics
- ✅ **Leadfeeder - Visitor Intelligence** - B2B company tracking on website
- ✅ **AeroLeads - B2B Email Finder** - Verified professional email database
- ✅ **RollWorks - Account-Based Marketing** - Target and prioritize high-value accounts
- ✅ **Pipedrive - Sales CRM** - Sales pipeline management and deal tracking
- ✅ **HubSpot Marketing Hub** - Marketing automation and CRM platform
- ✅ **Zendesk Sell - Sales CRM** - Account management and activity tracking
- ✅ **Apollo.io - B2B Lead Database** - Prospect discovery and email verification
- ✅ **Salesforce Marketing Cloud** - Enterprise campaign orchestration across channels
- ✅ **Extole - Referral and Advocacy Platform** - Referral programs, advocate tracking, and rewards
- ✅ **D&B Hoovers - Company Intelligence** - Firmographics, account intelligence, and ICP fit signals
- ✅ **Agile CRM - Contact and Pipeline Manager** - Contact lifecycle management with deal stage progression
- ✅ **LeadsBridge - Lead Sync Integrations** - Real-time ad-to-CRM lead routing and mapping workflows
- ✅ **Dealfront - Intent Intelligence** - Buying intent watchlists and account prioritization
- ✅ **Sumo - List Building and Popups** - Triggered list capture campaigns with submission tracking

### 5. Shared Persistence + Unified Tool Analytics
- Tool states are now stored in the database-backed JSON store via `/api/tools/state/[toolId]`.
- Tool events are tracked via `/api/tools/analytics` for usage/performance analysis.
- A unified dashboard at `/dashboard/tools/analytics` compares activity across all implemented tools.
- Tools Library detail pages now support direct in-app execution via custom endpoint `/api/tools/[id]/run`.
- All 23 Tools Library tools now publish the same normalized app-owned run contract: capability profile, input schema, record list, metrics, actions, and crawl-backed source evidence.
- Previously client-only tools now persist data across refreshes/restarts (SalesWings, Mailchimp, OptinMonster, Demio, Intercom, CallPage, Leadfeeder, RollWorks, Pipedrive, HubSpot, Zendesk, Overloop, Extole, D&B Hoovers, Agile CRM, LeadsBridge, Dealfront, Sumo).

---

## Feature Ideas To Help Agencies Grow Client Businesses

Below is a practical feature backlog you can add to LeadGen to make it more valuable for marketing agencies focused on client growth, retention, and reporting.

### Lead Capture & Qualification
- Multi-step lead capture quiz with conditional logic
- Exit-intent offers and popup campaign builder
- Dynamic scheduling widget for booked calls and demos
- Geo-targeted landing page personalization
- Chat-based qualification flows for high-intent visitors
- SMS opt-in capture for faster follow-up
- Industry-specific intake form templates
- Referral source and UTM auto-capture on every form
- Lead magnet library for gated assets and offers
- Form abandonment recovery workflows

### Conversion Rate Optimization
- Funnel drop-off analysis by step and page
- Call-to-action testing workspace
- Testimonial and proof asset manager
- Mobile conversion audit checklist
- Offer testing dashboard for pricing, guarantees, and hooks
- Landing page to ad-message match scoring
- Heatmap summary and click-pattern review
- Checkout friction detector for ecommerce and service flows
- Risk-reversal and guarantee section generator
- Page speed opportunity scanner tied to conversion impact

### CRM, Pipeline & Sales Enablement
- Lead scoring engine based on fit and behavior
- Pipeline SLA tracking for response-time accountability
- Lost-deal reason analysis and objection tracking
- Reactivation queue for stale leads
- Sales handoff summaries generated from lead research
- Win-pattern analysis across industries and campaigns
- Deal health scores for active opportunities
- Persona tagging inside the CRM
- Expansion and upsell opportunity tracking
- Lead source-to-revenue mapping

### Reporting & Client Communication
- Executive KPI snapshot for clients
- Weekly wins and risks digest
- Forecasted pipeline projection based on current lead flow
- Cross-channel performance scoreboard
- Goal variance alerts when KPIs slip
- Landing page leaderboard by conversion rate
- Lead quality trend reporting
- Content ROI reporting tied to pipeline
- Budget pacing monitor for ad accounts
- Creative fatigue warnings for paid media

### Marketing Automation
- Instant lead routing to sales reps or inboxes
- Missed-call text-back automation
- Proposal follow-up sequence builder
- Lead nurture workflows by funnel stage
- No-show recovery automations
- Review request and testimonial collection automations
- High-intent visit alerts for key pages
- Lead enrichment on form submission
- Auto-reminders for client approvals and missing assets
- Re-engagement sequences for cold leads

### Content, SEO & Organic Growth
- Topic cluster planner for SEO campaigns
- Search intent brief generator for writers
- Local SEO landing page template system
- Content refresh opportunity finder
- Competitor content gap analyzer
- Schema markup recommendations
- SEO opportunity scoring by business value
- CTA consistency checker across blog and resource content
- Case study publishing workflow
- Repurposing engine for blogs, lead magnets, and email

### Paid Media & Attribution
- Creative testing tracker
- Audience overlap analyzer
- Budget reallocation recommendations
- Lead quality by ad set and campaign
- Retargeting sequence mapper
- Underperforming keyword alerts
- Revenue per lead by campaign
- First-touch, last-touch, and multi-touch attribution views
- Offline conversion import tracking
- Call tracking source breakdown by campaign

### Client Experience & Retention
- Client onboarding checklist portal
- Shared growth roadmap by business goal
- Approval queue for ads, landing pages, and content
- Client request intake center
- Monthly strategy recap generator
- Success plans tied to revenue targets
- Churn-risk dashboard for subscription clients
- Win-back campaigns for former customers
- Cross-sell and upsell journey builder
- Post-purchase education and onboarding sequences

### Productized Agency Features
- White-label client portal
- Reusable campaign playbook templates
- Multi-client dashboard with roll-up reporting
- Role-based access for agency teams and clients
- Saved implementation plans for different niches
- Client-specific roadmap builder from Growth Hub ideas
- Proposal add-ons generated from identified growth gaps
- Task boards tied to campaigns and deliverables
- Approval logs and audit trails
- Recurring monthly growth opportunities list per client

### Highest-Impact Features To Add First
- Lead scoring and qualification engine
- Funnel drop-off and conversion diagnostics
- Proposal follow-up automation
- Executive KPI dashboard for clients
- Lead source-to-revenue attribution
- Reactivation workflows for stale leads
- Shared client growth roadmap
- Paid campaign lead-quality reporting
- SEO opportunity scoring
- White-label client portal

These features would move LeadGen beyond lead generation into a fuller agency operating system for acquisition, conversion, reporting, and retention.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| AI | Claude API (claude-sonnet-4-6) |
| Research | Tavily API (web search) |
| Database | Supabase (Postgres) |
| Auth | API backend (JWT + HTTP-only cookies) |
| PDF Export | @react-pdf/renderer |
| Mobile | Fully responsive — works on any device |

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
ANTHROPIC_API_KEY=your_anthropic_api_key
TAVILY_API_KEY=your_tavily_api_key
```

### 3. Run the database migration
Run the SQL in `supabase/migrations/001_initial_schema.sql` in your Supabase project.

### 4. Start the dev server
```bash
npm run dev
```

LeadGen frontend runs on [http://localhost:3001](http://localhost:3001).

### Local data persistence
- Local app data is stored in `data/db.json`.
- The tools library is seeded on first call to `/api/tools` if empty.
- After seeding, tool records persist and are reused across sessions.

### 5. Start Auth/API backend (NurseApp style)
Run your backend API separately on `http://localhost:4000`.

Example backend env:
```env
PORT=4000
APP_ORIGIN=http://localhost:3001
```

### 6. Authentication routes
- `http://localhost:3001/login` → Sign in
- `http://localhost:3001/signin` → Alias to sign in
- `http://localhost:3001/signup` → Create account
- `http://localhost:3001/reset` → Redirects to login

Auth expects these backend endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me`
- Optional: `POST /api/auth/refresh`

Login screen is simplified:
- Title: `Login`
- Fields: `Username`, `Password`
- Action: `Login`

Signup screen is simplified:
- Title: `Signup`
- Fields: `Username`, `Password`
- Action: `Create account`
- Includes a link back to `/login`

Demo mode behavior:
- New demo signups are stored locally in the browser.
- You can log in using the same username/password you just created.

---

## Business Model

This platform is designed to be sold as a **done-for-you setup service** to agencies and sales teams:

| Package | Price |
|---|---|
| Lead Research + Outreach Tool | $2,000–$3,000 |
| Proposal Generator | $1,000–$2,000 |
| Full Suite (both + CRM) | $3,500–$5,000 |

Built by **CyberRush** — tools for creators and marketers who are serious about growth.

---

## Roadmap

- [ ] Lead research pipeline (Tavily + Claude)
- [ ] Personalized outreach message generator
- [ ] Proposal intake form + AI generation
- [ ] PDF proposal export
- [ ] Lead CRM with Kanban board
- [ ] Dashboard stats and analytics
- [x] Persisted lead tools library with in-app detail pages
- [x] Auth (email + password via API/JWT cookies)
- [ ] Mobile-responsive layout
- [ ] Landing/marketing page
- [ ] Stripe billing integration

## Marketing TODOs

- [ ] Add public landing page (hero, features, CTAs) — src/app/page.tsx
- [ ] Per-page SEO: meta, canonical tags, structured data (schema.org)
- [ ] Generate sitemap.xml and robots.txt
- [ ] Add Open Graph & Twitter Card metadata for rich previews
- [ ] Integrate analytics (GA4/Matomo) and conversion/event tracking
- [ ] Cookie consent / GDPR consent manager and privacy page
- [ ] Newsletter signup (double opt-in) + provider integration (Mailchimp/SendGrid)
- [ ] Pricing & billing pages + Stripe integration for subscriptions/trials
- [ ] Add testimonials, logos, and case studies sections
- [ ] Create lead magnets / gated content flow
- [ ] Public contact form and demo booking (Calendly integration)
- [ ] A/B testing framework for landing pages
- [ ] First-run onboarding / in-app product tour
- [ ] Content hub / blog / FAQ for SEO and organic traffic
- [ ] Social sharing buttons and referral hooks
- [ ] CRM / Zapier / webhook integrations for leads API
- [ ] Accessibility and Core Web Vitals improvements (Lighthouse audit)
- [ ] Legal pages: Terms of Service, Privacy Policy, Refund Policy
