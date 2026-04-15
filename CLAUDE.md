# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server (Next.js, no Turbopack)
npm run build      # Production build (runs prisma generate via postinstall)
npm run start      # Start production server
npm run lint       # Run ESLint
npx prisma studio  # Open Prisma database GUI
npx prisma db push # Push schema changes to database
npx prisma generate # Regenerate Prisma client
```

## Architecture

**DS Hydrocarbure Pro** is a mobile-first PWA booking platform for automotive diagnostics and maintenance. It supports two client types: `PARTICULIER` (individual) and `PROFESSIONNEL` (business).

### Stack

- **Next.js 16** (App Router) + **TypeScript 5** + **Tailwind CSS 4**
- **Prisma 7** ORM → **PostgreSQL** via Supabase (pooled + direct URL)
- **NextAuth 4** (CredentialsProvider + Prisma Adapter, JWT session strategy)
- **Resend** for transactional emails via React Email components
- **@ducanh2912/next-pwa** for PWA/service worker support

### Directory layout

```
app/
  api/                         # All API routes (Next.js route handlers)
    auth/[...nextauth]/        # NextAuth handler
    reserver/                  # POST: create reservation + send emails
    disponibilites/            # GET: available time slots for a date
    reset-password/            # Password reset flow
    admin/
      utilisateurs/            # Client management (DELETE, reset password)
      tarifications/           # Dynamic pricing CRUD
      indisponibilites/        # Blackout date management
      terminer-rdv/            # Mark reservation complete, generate invoice
  (routes)/                    # Page components for each route
components/
  Providers.tsx                # SessionProvider wrapper
  emails/                      # React Email templates (confirmation, admin alert)
lib/
  prisma.ts                    # Singleton Prisma client
prisma/
  schema.prisma                # Database schema
```

### Data model (key models)

- **User** — role: `ADMIN | CLIENT`, typeClient: `PARTICULIER | PROFESSIONNEL`
- **Vehicule** — linked to User (cascade delete)
- **Reservation** — links User + Vehicule, holds service, statut, date/heure, prix, symptoms, paiement
- **Facture** — created on reservation completion, linked to Reservation
- **Parrainage** — referral records with statut (`EN_ATTENTE | VALIDE | EXPIRE`)
- **Indisponibilite** — admin-blocked dates
- **Tarification** — per-service pricing overrides

### Key flows

**Booking** (`/reserver` page + `/api/reserver`): Multi-step form (service → vehicle → date/time → contact → payment → referral code). The API route uses a Prisma transaction, applies dynamic pricing, deducts referral discounts (€10), creates the reservation, and sends emails via Resend.

**Available slots**: Fixed daily slots `[09:00, 11:00, 14:00, 16:00]` filtered against existing reservations and `Indisponibilite` records.

**Admin dashboard** (`/admin`): Manage reservations (confirm/complete/cancel), clients, pricing, blackout dates, invoices.

**Auth**: Session JWT carries `user.role` and `user.id` via NextAuth callbacks. Admin routes check `session.user.role === "ADMIN"`.

**Referrals**: Auto-generated codes (`PREFIX-XXXX`). Applying a code at booking links the referral, triggers credits to the referrer, and applies a discount to the new client.

### Environment variables required

```
DATABASE_URL=postgresql://...?pgbouncer=true   # Pooled connection (runtime)
DIRECT_URL=postgresql://...                    # Direct connection (migrations)
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=re_...
```

### Notes

- `next.config.ts` has `typescript.ignoreBuildErrors: true` — TypeScript errors won't block builds.
- Path alias `@/*` maps to the repository root.
- PWA is configured with aggressive caching; service worker is enabled in production.
- Resend email sender is `onboarding@resend.dev` (dev default) — update for production.
