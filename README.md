# Lasgidi Homes

Full agent-seeker house platform for Lagos. Next.js 14 + Supabase (auth, DB, storage, realtime chat).

## 1. Supabase setup (5 min)

1. Go to https://supabase.com → New project (free tier).
2. Once created, go to **SQL Editor → New query**, paste the entire contents of
   `supabase/schema.sql`, and run it. This creates all tables, RLS policies,
   storage buckets, and enables realtime for chat.
3. Go to **Project Settings → API** and copy:
   - Project URL
   - `anon` public key

## 2. Local setup (Termux or any machine)

```bash
pkg install nodejs git -y      # Termux only, skip on Windows/Mac
git clone <your-repo-url> lasgidi-homes   # or unzip this project
cd lasgidi-homes
cp .env.local.example .env.local
```

Edit `.env.local` and paste your Supabase URL + anon key:

```bash
nano .env.local
```

Then install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 3. Deploy free on Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts, then add your two env vars in the Vercel dashboard
(Project → Settings → Environment Variables) and redeploy:

```bash
vercel --prod
```

## What's built (v1)

- Sign up as **agent** or **seeker**, role stored in `profiles`
- Agents post listings with photo, price, area, fees → `app/post`
- Seekers browse/filter by area, price, rent vs sale → `app/listings`
- Realtime chat per listing between seeker and agent (Supabase Realtime)
- WhatsApp deep link as a fallback contact method
- Agent dashboard: mark listings Available/Taken → `app/dashboard`
- Signboard-style status badges (To Let / Taken / Verified Agent)

## Not yet built (v2 — flag if you want these next)

- Agent verification flow (NIN/CAC upload → admin approval). The `id_document_url`
  and `verified` columns already exist in `profiles` — just needs an upload UI +
  a simple admin page to flip `verified = true`.
- Reviews UI (table exists, no page yet)
- Saved/shortlisted listings UI (table exists, no page yet)
- Multiple photos per listing (currently 1; `images` column is already an array)
- Duplicate listing detection
- Boosted/featured listings for monetization

## Notes

- All tables have Row Level Security on — agents can only edit their own
  listings, users can only read their own chat threads.
- Image uploads go to the public `listing-images` Supabase Storage bucket.
- `verification-docs` bucket is private, ready for the NIN/CAC flow above.
