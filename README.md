# Timezone — Remote Tech Jobs for African Developers

MVP job board built for PRD #35. Employers pay to post a role; developers browse
and filter for free. No login required on either side — payment is the gate.

## Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS, hand-built Radix-based UI primitives
- **Database:** Neon (serverless Postgres) via Drizzle ORM
- **Payments:** Lemon Squeezy (hosted checkout + webhook)
- **Hosting:** Vercel
- No auth provider — admin screen is gated by a single shared password (see below)

## What's in the MVP (per the PRD)

- Public job board: browse, filter by role type / seniority / remote-or-hybrid / free-text search
- Job detail page with apply-out link
- Employer "Post a job" form → Lemon Squeezy checkout → listing goes live on payment
- $49 standard listing (30 days) / +$50 featured add-on ($99 total), pinned to the top
- `/admin` — manually approve a pending listing, toggle featured, or remove a listing
  (useful for your first 10 postings from direct outreach, before Lemon Squeezy is wired up)

**Deliberately not built** (per the PRD's "Out of Scope"): applicant tracking, candidate
profile/resume database, employer accounts/login. Don't add these until paying customers
ask for them.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run db:push              # creates the jobs table on your Neon DB
npm run db:seed              # optional: adds 3 sample listings so the board isn't empty
npm run dev
```

### 1. Database (Neon)

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the pooled connection string into `DATABASE_URL` in `.env.local`.
3. Run `npm run db:push` to create the `jobs` table (no manual SQL needed).

### 2. Payments (Lemon Squeezy)

1. Create a store at [lemonsqueezy.com](https://lemonsqueezy.com).
2. Create a product called "Job Posting" with a **$49** variant — copy its variant ID
   into `LEMONSQUEEZY_VARIANT_STANDARD`.
3. Optionally add a second **$99** variant ("Job Posting + Featured") and copy its ID
   into `LEMONSQUEEZY_VARIANT_FEATURED`. If you skip this, featured checkouts still
   work but bill the standard $49 price — bump `PRICING` in `src/lib/constants.ts`
   and add the second variant when you're ready to charge for it.
4. Store settings → API → create an API key → `LEMONSQUEEZY_API_KEY`.
5. Store settings → the URL/dashboard shows your Store ID → `LEMONSQUEEZY_STORE_ID`.
6. Store settings → Webhooks → add `https://yourdomain.com/api/webhooks/lemonsqueezy`,
   subscribe to `order_created`, copy the signing secret → `LEMONSQUEEZY_WEBHOOK_SECRET`.

Until this is configured, the "Post a job" form will surface a clear error instead of
failing silently — you can still use `/admin` to manually publish listings sent to you
directly (which the PRD recommends for your first 10 sales anyway).

### 3. Admin access

Set `ADMIN_PASSWORD` (what you type in to sign in) and `ADMIN_SESSION_SECRET` (a random
string used to sign the session cookie) in `.env.local`. Visit `/admin`.

### 4. Deploy

Push to GitHub, import into Vercel, paste the same env vars into the Vercel project
settings, set `NEXT_PUBLIC_SITE_URL` to your production URL. No build config changes
needed.

## Extending later (v2, not now)

- Employer accounts (Clerk) if manual edit-token links stop being enough
- Applicant tracking / candidate resume database (explicitly out of scope for MVP)
- Slack/email digest of new listings
- Auto-expiry cron (`expireStaleJobs()` in `src/lib/db/queries.ts` is already written —
  just needs a Vercel Cron hitting a small route handler daily)

## Project structure

```
src/
  app/
    page.tsx                  Homepage — hero + filterable listings
    jobs/[slug]/page.tsx       Job detail
    post-job/page.tsx          Employer submission form
    post-job/success/page.tsx  Post-checkout redirect target
    admin/page.tsx              Password-gated moderation dashboard
    api/jobs/route.ts           GET (list+filter) / POST (create + checkout)
    api/webhooks/lemonsqueezy/  Payment webhook → activates listing
    api/admin/                  Login + per-job moderation actions
  components/                   UI primitives + job-card, filter-bar, timezone-bar
  lib/
    db/schema.ts                 Drizzle schema
    db/queries.ts                 All DB access
    lemonsqueezy.ts               Checkout + webhook signature verification
    constants.ts                  Role types, stack tags, pricing
```