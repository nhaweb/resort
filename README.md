# Orilla

Resort marketing site + MVP booking with online payment (Next.js, Postgres, Stripe).

## Stack

- Next.js App Router, React, Tailwind, Lenis, GSAP
- PostgreSQL (availability, reservations, payment refs)
- Stripe Checkout (server-side) + webhook idempotency
- Locales: `vi` (default), `en`
- Preview: Vercel · Production: Fly.io

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/vi` or `/en`).  
Booking UI: `/vi/book` or `/en/book`.

Default local config uses `BOOKING_STORE=memory` and `PAYMENT_MODE=mock` (no Docker/Stripe required).

### Postgres (recommended before deploy)

```bash
# set BOOKING_STORE=postgres and DATABASE_URL in .env.local
docker compose up -d
npm run db:migrate
npm run db:seed
```

For real Checkout, set `PAYMENT_MODE=stripe` and Stripe secrets.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next dev server |
| `npm run build` / `start` | Production build |
| `npm run lint` / `format` | Biome |
| `npm run db:migrate` | Apply SQL migrations |
| `npm run db:seed` | Upsert villa rates |
| `npm run db:up` | `docker compose up -d` |

## Booking flow

1. Guest picks villa, dates, guests, contact → `POST /api/reservations` (status `held`, TTL 15m)
2. `POST /api/reservations/:id/checkout` creates Stripe Checkout (or mock pay)
3. Stripe webhook `checkout.session.completed` → status `paid` (idempotent via `stripe_events`)
4. Success page polls reservation status

### API

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/health` | DB + payment mode |
| GET | `/api/villas` | Active villas + nightly rates |
| GET | `/api/availability?checkIn&checkOut&villaId?` | Availability / quote |
| POST | `/api/reservations` | Create hold |
| GET | `/api/reservations/:id` | Status |
| POST | `/api/reservations/:id/checkout` | Start payment |
| POST | `/api/webhooks/stripe` | Stripe events (raw body) |
| POST | `/api/enquiry` | Sold-out enquiry (stored; emailed if `ENQUIRY_NOTIFY_EMAIL`) |
| POST/DELETE | `/api/admin/login` | Set / clear the admin session cookie |
| GET | `/api/admin/reservations?limit=` | Admin: reservations, newest first |
| GET/POST | `/api/admin/blocks` | Admin: list / create inventory blocks |
| GET | `/api/admin/enquiries` | Admin: enquiries |

### Email

A booking confirmation is sent when a reservation becomes `paid` (Stripe webhook or mock checkout). `EMAIL_MODE=mock` (default) logs to the server console; `EMAIL_MODE=resend` needs `RESEND_API_KEY` and `EMAIL_FROM`. Email failures are logged and never fail the payment response.

### Admin

Set `ADMIN_SECRET`, then open `/admin`. Admin APIs also accept `x-admin-secret` or `Authorization: Bearer <secret>`. With no secret set they return 503. Run `npm run db:migrate` for the `enquiries` table (migration `002`).

### Sanity (optional)

Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`, then open `/studio` (add the site URL under CORS origins in the Sanity project). Schemas: `villa` (`villaId` must match the inventory id), `gallery`, `faq`. Use `getMarketingVillas`, `getMarketingFaq` and `getMarketingGallery` from `lib/sanity/fetch.js`; they fall back to the dictionary when Sanity is not configured. Rates and availability stay in the booking store.

## Env checklist

Required for booking APIs:

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL` / `APP_URL` (success/cancel URLs)

Stripe mode:

- `PAYMENT_MODE=stripe`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Optional:

- `BOOKING_HOLD_TTL_MINUTES` (default 15)
- `BOOKING_MIN_STAY_NIGHTS` (default 2)
- `DATABASE_SSL=true` (managed Postgres)

## Deploy

### Vercel (preview)

1. Import the repo, set env vars (use a hosted Postgres URL).
2. Build command: `npm run build` (run migrations against the DB in CI or a release step).
3. Point Stripe webhook (test) to `https://<preview>/api/webhooks/stripe` when testing pay.

### Fly.io (production)

1. `fly launch` / set `app` in `fly.toml`
2. Attach Postgres (`fly postgres attach`) or set `DATABASE_URL`
3. Set secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `APP_URL`, `NEXT_PUBLIC_APP_URL`, `PAYMENT_MODE=stripe`
4. Release: migrate + seed, then `fly deploy`
5. Health check: `GET /api/health`

## Smoke test (local)

1. `GET /api/health` → `ok: true`
2. Open `/vi/book`, pick dates, submit with `PAYMENT_MODE=mock`
3. Land on success with status `paid`
4. Re-book same villa/dates → availability conflict (409)

## Notes

- Marketing copy lives in `lib/dictionaries/*`; Sanity content overrides it when configured.
- Exclusion constraint prevents overlapping `held`/`paid` stays per villa.
- Never put Stripe secret keys or card data in the client.
