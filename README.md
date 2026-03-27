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

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| AI | Claude API (claude-sonnet-4-6) |
| Research | Tavily API (web search) |
| Database | Supabase (Postgres + Auth) |
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
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
TAVILY_API_KEY=your_tavily_api_key
```

### 3. Run the database migration
Run the SQL in `supabase/migrations/001_initial_schema.sql` in your Supabase project.

### 4. Start the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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
- [ ] Auth (email + Google OAuth)
- [ ] Mobile-responsive layout
- [ ] Landing/marketing page
- [ ] Stripe billing integration
