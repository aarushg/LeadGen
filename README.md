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

### 4. Lead Generation Tools Library (Persisted)
- 23 lead generation tools are stored as real app data (not static UI-only cards)
- Tools are loaded from `GET /api/tools` and persisted in local storage (`data/db.json`)
- Each tool has a dedicated in-app page: `/dashboard/tools/[id]`
- Cards are actionable and support:
	- Open in app (tool details page)
	- Research fit flow (`/research?company=...`)
	- Visit official vendor website
- Includes searchable/filterable library and comparison workspace in `/dashboard/tools`

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
