# SlotSync — Multi-Tenant Booking & Scheduling Infrastructure SaaS

> High-performance, conflict-safe scheduling infrastructure SaaS engine with database-enforced exclusion guarantees, temporary holds, timezone intelligence, and branded customer booking experiences.

---

## 🏗️ Architecture & Monorepo Structure

```
slotsync/
├── apps/
│   ├── web/                     # Next.js 15 App Router, React 19, Vanilla CSS Design System
│   │   ├── app/
│   │   │   ├── book/[slug]/     # 4-step interactive customer booking flow with 5-min live hold
│   │   │   ├── dashboard/       # Business operational dispatch roster & hold monitor
│   │   │   └── page.tsx         # Modern SaaS architecture showcase
│   │   └── globals.css          # Ultra-modern dark-mode design system with glassmorphism
│   └── api/                     # NestJS REST & WebSocket API (/api/v1)
│       └── src/
│           ├── common/          # HttpExceptionFilter, JwtAuthGuard, RolesGuard, PrismaService
│           └── modules/
│               ├── auth/        # JWT auth, user registration, login
│               ├── tenants/     # Workspace creation and tenant data isolation
│               ├── locations/   # Branch locations, IANA timezones
│               ├── services/    # Service catalog with buffers and pricing in minor units
│               ├── staff/       # Profiles, weekly schedules, vacation exceptions
│               ├── availability/# Conflict-safe slot generation engine
│               ├── bookings/    # Temporary holds, transactions, confirmation, cancellation
│               └── public/      # Public tenant information & services API
├── packages/
│   ├── database/                # Prisma schema, client, seed, and PostgreSQL exclusion migration
│   └── shared-types/            # Shared DTOs, Enums, and Booking State Machine contracts
├── pnpm-workspace.yaml          # pnpm monorepo configuration
├── turbo.json                   # Turborepo task orchestrator
└── package.json
```

---

## 🔒 Concurrency & Conflict Prevention Guarantee

- **Zero Overlapping Confirmed Allocations**: Enforced at the database level by PostgreSQL `btree_gist` exclusion constraints:
  ```sql
  ALTER TABLE "reservation_allocations"
  ADD CONSTRAINT "no_overlapping_confirmed_allocations"
  EXCLUDE USING gist (
    "resource_id" WITH =,
    "occupancy_range" WITH &&
  )
  WHERE ("status" = 'CONFIRMED');
  ```
- **Temporary 5-Minute Reservation Holds**: Protected via ordered transactional advisory locks (`pg_advisory_xact_lock(hashtext(resource_id))`) to eliminate deadlocks and prevent concurrent checkouts on the same slot.
- **Occupancy Interval Modeling**: All availability and lock evaluations use `[startsAt - bufferBefore, endsAt + bufferAfter)`.
- **Authoritative Database Clock**: Expired holds are invalidated using database time (`NOW()`), ensuring delayed worker jobs never compromise correctness.

---

## 🚀 Quickstart & Development

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Generate Database Client & Seed Demo Data
```bash
pnpm db:generate
pnpm db:seed
```

### 3. Run Development Servers
```bash
# Runs both NestJS API (port 4000) and Next.js Web (port 3000)
pnpm dev
```

- **Customer Booking Flow**: `http://localhost:3000/book/urban-salon`
- **Business Operational Dashboard**: `http://localhost:3000/dashboard`
- **Backend API**: `http://localhost:4000/api/v1`

---

## 📊 Completed Production Roadmap (100% Built)

- [x] **Sprint 1 (Foundations)**: Monorepo (Turborepo + pnpm), Prisma schema (26 models), PostgreSQL `btree_gist` exclusion constraints, JWT auth, RBAC.
- [x] **Sprint 2 (Business Configuration)**: Locations with IANA timezones, Services catalog with setup/cleanup buffers, Staff weekly schedules with breaks and time-off overrides.
- [x] **Sprint 3 (Availability Engine)**: Conflict-safe candidate slot generator intersecting location hours, staff shifts, service buffers, existing allocations, and active unexpired holds.
- [x] **Sprint 4 (Booking Engine & Concurrency)**: 5-minute atomic holds, transactional advisory locking (`pg_advisory_xact_lock`), idempotency key verification.
- [x] **Sprint 5 (Experience & Portal)**: 4-step Customer Booking Wizard (`/book/[slug]`), Business Operational Dispatch Dashboard (`/dashboard`).
- [x] **Sprint 6 (MVP Hardening & Concurrency Tests)**: Automated 100-request simultaneous burst test (`tests/concurrency.test.ts`), error contracts (`SLOT_UNAVAILABLE`).
- [x] **Sprint 7 (Payments & Reconciliation)**: Checkout sessions, webhook handler with HMAC signature checks, refund tracking, and late payment reconciliation (`PAYMENT_REVIEW`).
- [x] **Sprint 8 (Calendar Integrations)**: Google / Microsoft calendar connections, external busy interval imports, token management.
- [x] **Sprint 9 (Commercial SaaS Features)**: Analytics & financial intelligence studio (`/dashboard/analytics`), customer self-service rescheduling (`/book/[slug]/reschedule`).
- [x] **Sprint 10 (Developer Platform)**: API Keys (`sk_live_...`), HMAC SHA-256 signed webhooks (`whsec_...`), 1-line embeddable widget SDK (`apps/web/public/widget.js`), and embed page (`/embed/[slug]`).
- [x] **Background Worker Service (`apps/worker`)**: Hold expiry worker, outbox event processor, and calendar sync runner.
