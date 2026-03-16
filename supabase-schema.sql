-- La Grandezza Events — Supabase Schema
-- Run this in your Supabase project: SQL Editor → New Query → Paste → Run

-- Single-row config tables use id = 'singleton'

create table if not exists team_members (
  id text primary key,
  name text not null,
  role text not null,
  image text default '',
  bio text default '',
  sort_order integer default 0
);

create table if not exists portfolio_items (
  id text primary key,
  title text not null,
  category text not null,
  image text default '',
  description text default '',
  date text not null
);

create table if not exists services (
  id text primary key,
  title text not null,
  description text default '',
  image text default '',
  icon text default 'Sparkles',
  features jsonb default '[]',
  sort_order integer default 0
);

create table if not exists packages (
  id text primary key,
  name text not null,
  price numeric not null,
  description text default '',
  features jsonb default '[]'
);

create table if not exists bookings (
  id text primary key,
  client_name text not null,
  email text not null,
  phone text default '',
  event_date text not null,
  event_type text default '',
  package text default '',
  guests integer default 0,
  total_amount numeric default 0,
  deposit_amount numeric default 0,
  deposit_paid boolean default false,
  payment_method text default '',
  payment_status text default 'unpaid',
  transaction_id text default '',
  status text default 'pending',
  created_at timestamptz default now(),
  notes text default ''
);

create table if not exists testimonials (
  id text primary key,
  user_id text default '',
  user_name text not null,
  user_email text default '',
  event text default '',
  text text not null,
  rating integer default 5,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists site_config (
  key text primary key,
  value jsonb not null
);

-- Enable Row Level Security (public read, no public write)
alter table team_members enable row level security;
alter table portfolio_items enable row level security;
alter table services enable row level security;
alter table packages enable row level security;
alter table bookings enable row level security;
alter table testimonials enable row level security;
alter table site_config enable row level security;

-- Public can read everything
create policy "public read team_members" on team_members for select using (true);
create policy "public read portfolio_items" on portfolio_items for select using (true);
create policy "public read services" on services for select using (true);
create policy "public read packages" on packages for select using (true);
create policy "public read testimonials" on testimonials for select using (true);
create policy "public read site_config" on site_config for select using (true);
create policy "public read bookings" on bookings for select using (true);

-- Anon key can write everything (admin auth is handled by our app layer)
create policy "anon write team_members" on team_members for all using (true) with check (true);
create policy "anon write portfolio_items" on portfolio_items for all using (true) with check (true);
create policy "anon write services" on services for all using (true) with check (true);
create policy "anon write packages" on packages for all using (true) with check (true);
create policy "anon write bookings" on bookings for all using (true) with check (true);
create policy "anon write testimonials" on testimonials for all using (true) with check (true);
create policy "anon write site_config" on site_config for all using (true) with check (true);
