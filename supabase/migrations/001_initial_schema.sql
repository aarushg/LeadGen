-- ============================================================
-- LeadGen Marketing Suite — Initial Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- ── Profiles ──────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  company     text,
  plan        text default 'free' check (plan in ('free', 'pro', 'agency')),
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ── Leads ─────────────────────────────────────────────────
create table public.leads (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  -- Identity
  full_name           text,
  title               text,
  company             text not null,
  company_website     text,
  linkedin_url        text,
  twitter_url         text,
  email               text,
  -- Research
  research_data       jsonb,
  outreach_message    text,
  outreach_tone       text default 'professional',
  outreach_channel    text default 'email',
  -- CRM
  status              text default 'new' check (
    status in ('new','researched','contacted','replied','qualified','closed_won','closed_lost')
  ),
  tags                text[] default '{}',
  notes               text,
  last_contacted_at   timestamptz,
  -- Meta
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table public.leads enable row level security;

create policy "Users can manage own leads"
  on public.leads for all
  using (auth.uid() = user_id);

create index leads_user_id_idx on public.leads(user_id);
create index leads_status_idx on public.leads(status);
create index leads_created_at_idx on public.leads(created_at desc);

-- ── Proposals ─────────────────────────────────────────────
create table public.proposals (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  lead_id          uuid references public.leads(id) on delete set null,
  -- Client info
  client_name      text not null,
  client_company   text not null,
  client_email     text,
  project_type     text,
  project_goals    text,
  budget_range     text,
  timeline_weeks   int,
  additional_context text,
  -- Generated content (structured JSON)
  content          jsonb not null default '{}',
  -- Status
  status           text default 'draft' check (
    status in ('draft','sent','accepted','rejected')
  ),
  sent_at          timestamptz,
  -- Meta
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table public.proposals enable row level security;

create policy "Users can manage own proposals"
  on public.proposals for all
  using (auth.uid() = user_id);

create index proposals_user_id_idx on public.proposals(user_id);
create index proposals_lead_id_idx on public.proposals(lead_id);

-- ── Research Sessions (audit trail) ───────────────────────
create table public.research_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  lead_id     uuid references public.leads(id) on delete set null,
  query       text not null,
  sources     jsonb,
  created_at  timestamptz default now()
);

alter table public.research_sessions enable row level security;

create policy "Users can view own research sessions"
  on public.research_sessions for all
  using (auth.uid() = user_id);

-- ── Triggers: auto-update updated_at ──────────────────────
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.update_updated_at();

create trigger proposals_updated_at
  before update on public.proposals
  for each row execute function public.update_updated_at();

-- ── Trigger: auto-create profile on signup ────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
