# LeadGen — AI-Powered Marketing Suite

A full-fledged lead generation and marketing platform for agencies, sales teams, and creators. Works on **desktop and mobile**. Powered by Claude AI.

---

## What It Does

Every business wants more leads. This suite gives them the tools to find, research, and close them — faster than anything manual.

---

## Core Features

### 1. Lead Research & Outreach Engine
Give it a target company or contact and it does the heavy lifting:
- Searches across social media, LinkedIn, recent news, and the company website (via Tavily)
- Builds a full intelligence brief: company background, contact profile, pain points, recent moves, conversation hooks
- Writes a **personalized outreach message** based on real, specific angles from the research
- Supports multiple tones (professional, casual, direct, warm) and channels (email, LinkedIn, Twitter/X)

Sales teams are paying **$2,000–$3,000** for a setup like this.

---

### 2. Proposal Generator
Client fills out a short 4-step intake form. The app generates a complete, formatted proposal — ready to send.

Includes:
- Executive summary + problem statement
- Scope of work + proposed solution
- Deliverables list
- Week-by-week timeline
- Pricing table with totals
- Payment terms
- Why us + next steps + T&Cs

Agencies are willing to pay **$1,000–$2,000** for a setup like this.

---

### 3. Lead Dashboard & CRM
- Full lead database with status tracking (New → Researched → Contacted → Replied → Qualified → Won/Lost)
- Stats bar: total leads, researched, contacted, proposals sent
- Notes per lead (auto-saved)
- Research history + intelligence brief per lead
- Quick link from lead to proposal generator

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

### 6. Growth Hub
- New in-app **Growth Hub** at `/dashboard/growth-hub`
- Includes **10,000 agency-focused next-step feature ideas** to help firms improve lead generation, conversion rate, attribution, retention, reporting, and client experience
- Searchable and grouped by category so agencies can use it as a forward-looking product roadmap or client growth planning tool

### 7. Paid Campaign Lead-Quality Reporting
- New paid media reporting page at `/dashboard/paid-campaigns`
- Tracks lead quality by **lead source**, **acquisition channel**, **campaign**, and **ad set**
- Shows paid lead volume, qualification rate, win rate, and estimated revenue
- Breaks down lead quality mix across **high**, **medium**, and **low** quality leads
- Helps agencies see which campaigns are driving pipeline, not just raw lead count
- Research flow now supports saving campaign tracking data directly into the CRM

### 8. Cross-Channel Performance Scoreboard
- New reporting page at `/dashboard/reporting`
- Unifies **ads**, **email**, **SEO**, **outbound**, **referral**, and **other** lead performance
- Compares tracked leads, qualification rate, win rate, and estimated revenue by channel
- Includes channel filters plus date windows for **this month**, **last 30 days**, **this quarter**, or a **custom range**
- Supports CSV export for the currently filtered report
- Includes a printable report view for client meetings and PDF-style handoff
- Supports branded printable headers with **agency name**, **client name**, and a custom **report title**
- Includes an executive summary that highlights the strongest and weakest channels in the filtered report
- Includes recommended actions based on filtered channel performance
- Supports custom client notes in the printable report
- Helps agencies make smarter channel mix decisions using one scoreboard instead of scattered reports

### 9. Agency Ops Workspace
- New operations workspace at `/dashboard/agency-ops`
- Includes **Offer-to-Page Personalization Rules**
- Includes **Lead-to-Close Time Dashboard**
- Includes **Competitor Ad Library Tracker**
- Includes **Campaign Launch Calendar**
- Includes **Client Renewal Risk Briefing**
- Includes **Interactive Objection Handling Widgets**
- Includes **Channel Margin Reporting**
- Includes **Creative Concept Approval Workflow**
- Includes **Client Decision Log**
- Includes **Expansion Playbook Recommender**
- Includes **Value Calculator Widgets**
- Includes **Client Cohort Retention Reporting**
- Includes **Ad Testing Velocity Tracker**
- Includes **Client Roadmap Milestone Tracker**
- Includes **Referral Activation Campaigns**
- Includes **Multi-Step Lead Capture Quiz**
- Includes **Exit-Intent Offer Builder**
- Includes **Pricing Sensitivity Tests**
- Includes **Client Benchmark Scorecards**
- Includes **Proposal Follow-Up Sequence Builder**
- Includes **Shared Growth Roadmap**
- Includes **Customer Advocacy Score**
- Includes **Progressive Lead Qualification Forms**
- Includes **On-Page Rescue Banner System**
- Includes **Offer Testing Dashboard**
- Includes **Lead Scoring Rules Engine**
- Includes **Forecast Accuracy Reporting**
- Includes **Lead Enrichment Workflow Queue**
- Includes **SEO Opportunity Scoring Model**
- Includes **Conversion Lag Analysis by Campaign**
- Includes **Client Request Intake Workspace**
- Includes **Review and Testimonial Capture Planner**
- Includes **Dynamic Scheduling Widget**
- Includes **Geo-Targeted Landing Page Personalization**
- Includes **Funnel Drop-Off Analysis**
- Includes **Pipeline SLA Tracking**
- Includes **Executive KPI Snapshot**
- Includes **Instant Lead Routing**
- Includes **Topic Cluster Planner**
- Includes **Budget Reallocation Recommendations**
- Includes **Client Onboarding Checklist Portal**
- Includes **Win-Back Campaigns**
- Includes **Chat-Based Qualification Flows**
- Includes **SMS Opt-In Capture**
- Includes **Call-to-Action Testing Workspace**
- Includes **Lost-Deal Reason Analysis**
- Includes **Weekly Wins and Risks Digest**
- Includes **Missed-Call Text-Back Automation**
- Includes **Search Intent Brief Generator**
- Includes **Audience Overlap Analyzer**
- Includes **Approval Queue**
- Includes **Success Plans Tied to Revenue Targets**
- Includes **Industry-Specific Intake Form Templates**
- Includes **Referral Source and UTM Auto-Capture**
- Includes **Testimonial and Proof Asset Manager**
- Includes **Reactivation Queue for Stale Leads**
- Includes **Forecasted Pipeline Projection**
- Includes **Lead Nurture Workflows by Funnel Stage**
- Includes **Local SEO Landing Page Template System**
- Includes **Retargeting Sequence Mapper**
- Includes **Monthly Strategy Recap Generator**
- Includes **Client Communication Timeline**
- Includes **Lead Magnet Library**
- Includes **Form Abandonment Recovery Workflows**
- Includes **Mobile Conversion Audit Checklist**
- Includes **Sales Handoff Summaries**
- Includes **Portfolio Benchmark Anomaly Alerts**
- Includes **No-Show Recovery Automations**
- Includes **Content Refresh Opportunity Finder**
- Includes **Underperforming Keyword Alerts**
- Includes **Client Request Intake Center**
- Includes **Churn-Risk Dashboard**
- Includes **Social Proof Block Manager**
- Includes **Progressive Consent and Compliance Prompts**
- Includes **Landing Page to Ad-Message Match Scoring**
- Includes **Win-Pattern Analysis**
- Includes **Goal Variance Alerts**
- Includes **Review and Testimonial Collection Automations**
- Includes **Competitor Content Gap Analyzer**
- Includes **Revenue per Lead by Campaign**
- Includes **Cross-Sell and Upsell Journey Builder**
- Includes **Post-Purchase Education and Onboarding Sequences**
- Includes **Heatmap Summary and Click-Pattern Review**
- Includes **Checkout Friction Detector**
- Includes **Risk-Reversal and Guarantee Section Generator**
- Includes **Page Speed Opportunity Scanner**
- Includes **Offer Packaging Comparison Workspace**
- Includes **Deal Health Scores**
- Includes **Persona Tagging**
- Includes **Expansion and Upsell Opportunity Tracking**
- Includes **Lead Source-to-Revenue Mapping**
- Includes **Landing Page Leaderboard**
- Includes **Lifecycle-Specific Callback Sequences**
- Includes **Response-Time Performance Board**
- Includes **Micro-Conversion Prompt Library**
- Includes **Buyer Objection Prompt Set**
- Includes **Proof Sequencing Optimizer**
- Includes **Interactive Proof Comparison Modules**
- Includes **Sales Velocity Benchmark Board**
- Includes **Opportunity Aging Heatmap**
- Includes **Lead Quality Trend Reporting**
- Includes **Content ROI Reporting Tied to Pipeline**
- Includes **Lead Enrichment on Form Submission**
- Includes **Auto-Reminders for Client Approvals and Missing Assets**
- Includes **CTA Consistency Checker**
- Includes **Case Study Publishing Workflow**
- Includes **Multi-Touch Attribution Views**
- Includes **Offline Conversion Import Tracking**
- Includes **Client-Specific Roadmap Builder**
- Includes **Proposal Add-Ons Generated from Identified Growth Gaps**
- Includes **Retention Milestone Scorecards**
- Includes **Customer Education Content Map**
- Includes an **Open Features From Growth Hub** section so teams can see what is already built and what is coming next
- Gives agencies a dedicated place for growth operations, launch planning, and account health workflows

---

## Feature Ideas To Help Agencies Grow Client Businesses

Below is a practical feature backlog you can add to LeadGen to make it more valuable for marketing agencies focused on client growth, retention, and reporting.

### Lead Capture & Qualification
- Intent drift alerts for top landing pages

### Conversion Rate Optimization
- Conversion friction heatmap

### CRM, Pipeline & Sales Enablement
- Stale lead prioritization board

### Reporting & Client Communication
- Client-ready anomaly summary generator

### Marketing Automation
- Approval chase automation
- Re-engagement sequences for cold leads

### Content, SEO & Organic Growth
- Topic decay detector
- Repurposing engine for blogs, lead magnets, and email

### Paid Media & Attribution
- Search query revenue map
- Call tracking source breakdown by campaign

### Client Experience & Retention
- Renewal countdown reminders
- Win-back campaigns for former customers
- Review and testimonial capture planner

### Productized Agency Features
- Reusable agency playbook library
- Lead source confidence scoring
- Saved implementation plans for different niches
- Task boards tied to campaigns and deliverables
- Approval logs and audit trails
- Recurring monthly growth opportunities list per client

### Highest-Impact Features To Add First
- Intent drift alerts for top landing pages
- Funnel drop-off and conversion diagnostics
- Executive KPI dashboard for clients
- Conversion friction heatmap
- Search query revenue map
- Renewal countdown reminders
- Lead source confidence scoring

These features would move LeadGen beyond lead generation into a fuller agency operating system for acquisition, conversion, reporting, and retention.

### Recently Added
- [x] Dockerized app with multi-stage production image (`Dockerfile`), `.dockerignore`, and `docker-compose.yml`
- [x] Windows Docker launcher script (`runondocker.bat`) for one-click container startup
- [x] Windows Docker stop script (`stopondocker.bat`) to shut down the stack cleanly
- [x] Growth Hub expanded to 10,000 agency-ready feature ideas
- [x] Growth Hub refreshed to remove shipped items and focus on next-step backlog ideas
- [x] Growth Hub refreshed with 5 new roadmap ideas and 5 weaker backlog items removed
- [x] Agency Ops workspace with 5 implemented growth operations features
- [x] Agency Ops expanded with 5 additional implemented growth features
- [x] Agency Ops expanded again with 5 more implemented roadmap features
- [x] Agency Ops now surfaces open Growth Hub features directly in the workspace
- [x] Agency Ops now includes Multi-Step Lead Capture Quiz and Exit-Intent Offer Builder
- [x] Agency Ops now includes Pricing Sensitivity Tests, Client Benchmark Scorecards, Proposal Follow-Up Sequence Builder, Shared Growth Roadmap, and Customer Advocacy Score
- [x] Agency Ops now includes 10 more backlog features across qualification, conversion, reporting, automation, SEO, retention, and client operations
- [x] Agency Ops now includes 10 more backlog features across intake templates, attribution capture, nurture, retargeting, strategy recaps, and communication tracking
- [x] Agency Ops now includes 10 additional backlog features across scheduling, personalization, funnel analytics, routing, onboarding, and win-back workflows
- [x] Agency Ops now includes 10 more backlog features across chat qualification, automation, SEO briefs, approval workflows, and client success planning
- [x] Agency Ops now includes 10 more backlog features across lead magnets, recovery flows, sales handoff, anomaly alerts, keyword monitoring, and churn visibility
- [x] Agency Ops now includes 10 more backlog features across proof management, ad-message match, win patterns, KPI variance, content gaps, revenue quality, and expansion journeys
- [x] Agency Ops now includes 10 more backlog features across CRO diagnostics, deal health, persona tagging, source-to-revenue mapping, and leaderboard reporting
- [x] Agency Ops now includes 10 more backlog features across callback flows, proof sequencing, lead quality trends, attribution views, roadmap planning, and retention scorecards
- [x] Agency Ops now includes 10 more backlog features across response-time visibility, objection handling, proof modules, content ROI, approval reminders, offline conversions, and customer education
- [x] Agency Ops now includes 10 more backlog features across intent drift, conversion friction, stale leads, anomaly summaries, approvals, topic decay, search revenue, renewal reminders, playbooks, and source confidence
- [x] Paid campaign lead-quality reporting dashboard
- [x] Cross-channel performance scoreboard for ads, email, SEO, and outbound
- [x] Channel filters and date ranges for monthly client reporting
- [x] CSV export for filtered cross-channel reports
- [x] Printable client report view for filtered cross-channel reporting
- [x] Agency name, client name, and custom report title for branded print headers
- [x] Executive summary block with strongest and weakest channel insights
- [x] Recommended actions section for next-step agency guidance
- [x] Client notes field for printable report handoff
- [x] Campaign metadata fields in lead research and CRM
- [x] Paid lead reporting by campaign, ad set, quality, and estimated revenue

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (dark theme) |
| AI | Claude API (`claude-sonnet-4-6`) |
| Research | Tavily API (web search) |
<<<<<<< Updated upstream
| Database | Supabase (Postgres) |
| Auth | API backend (JWT + HTTP-only cookies) |
| PDF Export | @react-pdf/renderer |
| Mobile | Fully responsive — works on any device |
=======
| Database | Supabase (Postgres + Auth + RLS) |
| Mobile | Fully responsive + bottom nav on mobile |
| Auth | Supabase Auth (email/password + Google OAuth) |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── (auth)/
│   │   ├── login/page.tsx              # Sign in
│   │   ├── signup/page.tsx             # Sign up
│   │   └── callback/route.ts           # OAuth callback
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Sidebar + mobile nav shell
│   │   ├── dashboard/page.tsx          # CRM overview + stats
│   │   ├── research/
│   │   │   ├── page.tsx                # Lead research + outreach composer
│   │   │   └── [leadId]/page.tsx       # Individual lead detail
│   │   ├── proposals/
│   │   │   ├── page.tsx                # Proposals list
│   │   │   ├── new/page.tsx            # 4-step intake wizard
│   │   │   └── [proposalId]/page.tsx   # Full proposal view
│   │   └── settings/page.tsx           # Profile + API key info
│   └── api/
│       ├── research/route.ts           # POST: Tavily + Claude research
│       ├── outreach/route.ts           # POST: Claude outreach message
│       ├── leads/route.ts              # GET/POST leads
│       ├── leads/[id]/route.ts         # GET/PUT/DELETE lead
│       ├── proposals/route.ts          # GET/POST proposals
│       └── proposals/[id]/route.ts     # GET/PUT/DELETE proposal
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx                 # Desktop nav sidebar
│   │   └── MobileNav.tsx              # Bottom tab bar (mobile)
│   └── ...
├── lib/
│   ├── claude.ts                       # Anthropic SDK + AI prompts
│   ├── tavily.ts                       # Tavily web search wrapper
│   ├── supabase/client.ts              # Browser Supabase client
│   ├── supabase/server.ts              # Server Supabase client
│   ├── validations.ts                  # Zod schemas
│   └── utils.ts                        # Helpers
├── types/
│   ├── lead.ts                         # Lead types + status colors
│   └── proposal.ts                     # Proposal types + labels
└── middleware.ts                        # Auth route protection
supabase/
└── migrations/001_initial_schema.sql   # Full DB schema + RLS
```
>>>>>>> Stashed changes

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env.local` and fill in:
```env
<<<<<<< Updated upstream
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
=======
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
>>>>>>> Stashed changes
ANTHROPIC_API_KEY=your_anthropic_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Get your keys:
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com)
- **Tavily**: [tavily.com](https://tavily.com) (free tier available)
- **Supabase**: [supabase.com](https://supabase.com) (free tier available)

### 3. Set up the database
1. Create a new Supabase project
2. Go to **SQL Editor** in your Supabase dashboard
3. Paste and run the contents of `supabase/migrations/001_initial_schema.sql`

### 4. Start the dev server
```bash
npm run dev
```

LeadGen frontend runs on [http://localhost:3001](http://localhost:3001).

### Docker (Production Container)
Use Docker Desktop (Windows) and run from the project root.

1. Create your container env file:
```powershell
copy .env.example .env.local
```

2. Add/update values in `.env.local` as needed for your environment.

3. Start with the Windows helper script (builds + runs in detached mode):
```bat
runondocker.bat
```

4. Open:
- `http://localhost:3001`

5. Stop with the matching helper script:
```bat
stopondocker.bat
```

Manual Docker Compose commands (alternative):
```bash
docker compose up --build -d
docker compose logs -f
docker compose down
```

Manual Docker image run (alternative):
```bash
docker build -t leadgen:latest .
docker run --rm -p 3001:3001 --env-file .env.local leadgen:latest
```

Notes:
- The container runs the production Next.js server on port `3001`.
- `docker-compose.yml` reads `.env.local` if present (it is optional).
- If your backend API runs on the host machine, use a host-reachable URL in `.env.local` for `NEXT_PUBLIC_API_BASE_URL` (example: `http://host.docker.internal:4000/api`).

#### Troubleshooting Docker
- **Port 3001 already in use**
	- Error example: `Bind for 0.0.0.0:3001 failed: port is already allocated`
	- Fix: stop the process/container using 3001, or change the host port in `docker-compose.yml` from `3001:3001` to `3002:3001`, then open `http://localhost:3002`.
- **Old container/image state causes weird behavior**
	- Fix: run `docker compose down --remove-orphans`, then `docker compose up --build -d`.
- **Environment variable changes are not applied**
	- Fix: after editing `.env.local`, rebuild and restart with `docker compose up --build -d`.
- **App cannot reach backend API running on your machine**
	- Fix: set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to `http://host.docker.internal:4000/api` (or your backend port), then rebuild.

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

## How the AI Pipeline Works

### Lead Research
1. User enters company name + optional contact name
2. App runs **5 parallel Tavily searches**: company overview, recent news, LinkedIn/contact background, tech stack, pain points
3. All results are deduplicated and formatted
4. **Claude synthesizes** a structured intelligence brief: company summary, pain points, conversation hooks, recent news, funding stage
5. User picks tone + channel → Claude writes a **personalized outreach message**

### Proposal Generator
1. User fills 4-step intake form: client info → project type → goals/budget/timeline → review
2. **Claude generates** a full structured proposal: exec summary, deliverables, timeline, pricing, terms
3. Saved to Supabase, viewable as formatted document
4. Status tracking: Draft → Sent → Accepted/Rejected

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

- [x] Lead research pipeline (Tavily + Claude)
- [x] Personalized outreach message generator (5 tones, 3 channels)
- [x] Proposal intake form + AI generation
- [x] Proposal detail view (full formatted document)
- [x] Lead CRM with status tracking
- [x] Dashboard stats and recent activity
- [x] Auth (email + Google OAuth)
- [x] Mobile-responsive layout + bottom nav
- [x] Landing/marketing page
- [ ] PDF proposal export
<<<<<<< Updated upstream
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
=======
- [ ] Kanban board (drag-and-drop pipeline)
- [ ] Bulk lead import (CSV)
- [ ] Email sending integration
- [ ] Stripe billing
>>>>>>> Stashed changes
