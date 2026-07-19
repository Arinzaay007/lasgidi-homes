-- Run this whole file in Supabase Dashboard > SQL Editor > New query > Run

-- 1. Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('agent', 'seeker')),
  full_name text not null,
  phone text not null,
  whatsapp text,
  avatar_url text,
  verified boolean default false,
  id_document_url text, -- NIN/CAC upload for agent verification
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- 2. Listings
create table listings (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  price numeric not null,
  listing_type text not null check (listing_type in ('rent', 'sale')),
  property_type text not null, -- self-con, 2-bed flat, duplex, land, etc.
  bedrooms int,
  area text not null, -- Yaba, Lekki, Ikeja...
  landmark text,
  agency_fee numeric default 0,
  caution_fee numeric default 0,
  images text[] default '{}',
  status text default 'available' check (status in ('available', 'taken')),
  created_at timestamptz default now()
);

alter table listings enable row level security;

create policy "Listings are viewable by everyone"
  on listings for select using (true);

create policy "Agents can insert their own listings"
  on listings for insert with check (auth.uid() = agent_id);

create policy "Agents can update their own listings"
  on listings for update using (auth.uid() = agent_id);

create policy "Agents can delete their own listings"
  on listings for delete using (auth.uid() = agent_id);

-- 3. Messages (per listing thread between a seeker and an agent)
create table messages (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references listings(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

alter table messages enable row level security;

create policy "Users can view their own conversations"
  on messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on messages for insert with check (auth.uid() = sender_id);

-- 4. Reviews (seeker reviews an agent)
create table reviews (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references profiles(id) on delete cascade not null,
  seeker_id uuid references profiles(id) on delete cascade not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  unique (agent_id, seeker_id)
);

alter table reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on reviews for select using (true);

create policy "Seekers can leave reviews"
  on reviews for insert with check (auth.uid() = seeker_id);

-- 5. Saved listings
create table saved_listings (
  seeker_id uuid references profiles(id) on delete cascade not null,
  listing_id uuid references listings(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (seeker_id, listing_id)
);

alter table saved_listings enable row level security;

create policy "Seekers manage their own saved listings"
  on saved_listings for all
  using (auth.uid() = seeker_id) with check (auth.uid() = seeker_id);

-- 6. Storage buckets (run once)
insert into storage.buckets (id, name, public) values ('listing-images', 'listing-images', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('verification-docs', 'verification-docs', false)
  on conflict (id) do nothing;

create policy "Anyone can view listing images"
  on storage.objects for select using (bucket_id = 'listing-images');

create policy "Authenticated users can upload listing images"
  on storage.objects for insert
  with check (bucket_id = 'listing-images' and auth.role() = 'authenticated');

-- 7. Enable realtime for chat
alter publication supabase_realtime add table messages;
