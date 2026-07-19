-- T3 — Supporters schema, verification tokens, email events.
--
-- SECURITY MODEL (read before adding any RLS policy):
--   Row Level Security is ENABLED on every table below with NO policies. For the
--   `anon` and `authenticated` roles that means default-deny: they can neither
--   select nor mutate any row. All application reads/writes go through server
--   code using the Supabase SERVICE ROLE, which bypasses RLS entirely. We also
--   REVOKE table privileges from anon/authenticated as defense in depth.
--   Do NOT add permissive policies for anon/authenticated — there is no
--   client-side data access in this project.

create extension if not exists moddatetime schema extensions;

-- moddatetime keeps updated_at current on any UPDATE (ships with Supabase; reads
-- the target column name from the trigger argument).

create type public.supporter_status as enum (
  'pending',
  'verified',
  'unsubscribed'
);

create type public.email_event_type as enum (
  'delivered',
  'bounced',
  'complained',
  'failed'
);

-- ---------------------------------------------------------------------------
-- supporters
-- ---------------------------------------------------------------------------
create table public.supporters (
  id uuid primary key default gen_random_uuid(),
  name text not null
    check (char_length(name) between 1 and 80),
  email_normalized text not null unique
    check (char_length(email_normalized) <= 254),
  country_code text not null
    check (char_length(country_code) = 2),
  city text not null
    check (char_length(city) between 1 and 80),
  instagram text
    check (instagram is null or char_length(instagram) <= 30),
  status public.supporter_status not null default 'pending',
  -- Exactly what the signup form submitted (may be a typo or an as-yet-unknown
  -- code); never blocks a signup.
  referral_code_used text
    check (referral_code_used is null or char_length(referral_code_used) <= 32),
  -- Resolved referrer, populated by app code only when referral_code_used
  -- matches a verified supporter's personal_referral_code.
  referred_by uuid references public.supporters (id) on delete set null,
  -- Assigned at verification time; unique across all supporters.
  personal_referral_code text unique
    check (personal_referral_code is null or char_length(personal_referral_code) <= 32),
  acquisition_source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_path text,
  referrer text,
  consent_version text not null,
  consent_at timestamptz not null,
  verification_sent_at timestamptz,
  verified_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index supporters_referred_by_idx on public.supporters (referred_by);

create trigger supporters_set_updated_at
  before update on public.supporters
  for each row
  execute function extensions.moddatetime (updated_at);

-- ---------------------------------------------------------------------------
-- verification_tokens
-- ---------------------------------------------------------------------------
-- token_hash stores HMAC-SHA256(rawToken, EMAIL_TOKEN_SECRET). The raw token
-- lives only in the emailed verification URL and is never persisted, so a DB
-- read alone cannot forge or replay a verification link.
create table public.verification_tokens (
  id uuid primary key default gen_random_uuid(),
  supporter_id uuid not null references public.supporters (id) on delete cascade,
  token_hash bytea not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index verification_tokens_token_hash_idx
  on public.verification_tokens (token_hash);
create index verification_tokens_supporter_id_idx
  on public.verification_tokens (supporter_id);

-- ---------------------------------------------------------------------------
-- rate_limit_events
-- ---------------------------------------------------------------------------
create table public.rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_events_key_created_at_idx
  on public.rate_limit_events (key, created_at);

-- ---------------------------------------------------------------------------
-- email_events
-- ---------------------------------------------------------------------------
create table public.email_events (
  id uuid primary key default gen_random_uuid(),
  supporter_id uuid not null references public.supporters (id) on delete cascade,
  type public.email_event_type not null,
  provider_payload jsonb,
  created_at timestamptz not null default now()
);

create index email_events_supporter_id_idx
  on public.email_events (supporter_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — enable + default deny (see SECURITY MODEL above)
-- ---------------------------------------------------------------------------
alter table public.supporters enable row level security;
alter table public.verification_tokens enable row level security;
alter table public.email_events enable row level security;
alter table public.rate_limit_events enable row level security;

revoke all on public.supporters from anon, authenticated;
revoke all on public.verification_tokens from anon, authenticated;
revoke all on public.email_events from anon, authenticated;
revoke all on public.rate_limit_events from anon, authenticated;
