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

### 4. AI-Powered Tools Library (In Development)
Integrated lead generation and marketing tools built directly into the app. Access from **AI Tools** in the sidebar.

**✅ Implemented Tools (19/23):**
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

**Coming Next (4 remaining):**
- D&B Hoovers - Company intelligence and firmographics
- Agile CRM - Contact management and automation
- LeadsBridge - Ad and CRM integrations
- ... and 1 more tool from the Tools Library

### 5. Shared Persistence + Unified Tool Analytics
- Tool states are now stored in the database-backed JSON store via `/api/tools/state/[toolId]`.
- Tool events are tracked via `/api/tools/analytics` for usage/performance analysis.
- A unified dashboard at `/dashboard/tools-features/analytics` compares activity across all implemented tools.
- Previously client-only tools now persist data across refreshes/restarts (SalesWings, Mailchimp, OptinMonster, Demio, Intercom, CallPage, Leadfeeder, RollWorks, Pipedrive, HubSpot, Zendesk, Overloop, Extole).

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
