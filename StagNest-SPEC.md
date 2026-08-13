# StagNest — Full-Stack App Spec

Companion to `StagNest-WEBSITE-SPEC.md.pdf` (the static marketing/demo site). That spec's own §12
called this out in advance: *"When you need real accounts, a database, verified sign-in, and Stripe
rent payments, that's a separate Next.js project."* This is that project.

Source of truth for the data model, API surface, auth rules, and payment architecture. The static
site's design (tokens, layouts, copy, real-estate look) carries over unchanged — only the plumbing
underneath changes.

## 1. Product recap

Same product as the static site: a verified off-campus housing marketplace for Fairfield University
students. What changes here: listings, accounts, applications, leases, rent, and reviews become real
and persisted, instead of hardcoded JS arrays and `localStorage`. Landlords go through real Stripe
Connect onboarding and get paid directly; StagNest can take a cut.

## 2. Where this project lives

This is a **separate codebase** from the static site, not an in-place rewrite of the current folder.
Reasons: Next.js needs its own `package.json`/`node_modules`/build output/`app/` directory that would
collide with the static site's `netlify.toml` (`publish = "."`) and its existing minimal
`package.json` (just `stripe`, for the static site's own Netlify Function). Keeping them separate
means the current static site keeps deploying to Netlify untouched while this is built, and this new
app deploys to **Vercel** (Next.js's native target) under its own git repo.

Proposed path: a sibling directory, e.g. `~/Desktop/StagNest-App/`, own git history, own Vercel
project.

## 3. Stack

- **Next.js 14, App Router, TypeScript.**
- **Tailwind CSS** — theme extended with the exact tokens from `assets/styles.css :root` (see §4), so
  visual output is pixel-identical to the static site.
- **PostgreSQL + Prisma** — Supabase's own Postgres instance doubles as the app database (one fewer
  service to run).
- **Supabase Auth**, email OTP (6-digit code, matching the static site's sign-in UX exactly — not
  magic links), sessions via `@supabase/ssr` cookies (server-readable, no client-side token juggling).
- **Supabase Storage** — one **private** bucket for listing photos and lease/tenant documents,
  accessed only via short-lived **signed URLs** generated server-side. Nothing in Storage is public
  by default.
- **Stripe Connect** — landlords are Express connected accounts; rent is a destination charge from
  tenant to landlord, with an optional application fee to StagNest.
- **Deploy**: Vercel (app) + Supabase (DB/Auth/Storage) + Stripe. No secret key ever ships to the
  browser — enforced by keeping all Stripe/Supabase-service-role calls inside Server Components,
  Route Handlers, or Server Actions, never Client Components.

## 4. Design tokens (unchanged — ported, not reinvented)

Straight from `assets/styles.css :root`, becoming Tailwind `theme.extend` values and CSS variables in
`globals.css` simultaneously (variables stay so any hand-written CSS/inline style still works; Tailwind
keys so components can use `bg-brand-red`, `font-display`, etc.):

| Token | Value | Tailwind key (proposed) |
|---|---|---|
| `--red` | `#BA0C2F` | `brand.red` |
| `--red-dark` | `#8E0923` | `brand.redDark` |
| `--red-bg` | `#FCEAEE` | `brand.redBg` |
| `--ink` | `#16130F` | `ink.DEFAULT` |
| `--ink-2` | `#201C17` | `ink.2` |
| `--muted` | `#625C54` | `ink.muted` |
| `--faint` | `#9A948C` | `ink.faint` |
| `--bg` | `#FBFAF8` | `bg.DEFAULT` |
| `--surface` | `#FFFFFF` | `surface.DEFAULT` |
| `--surface-2` | `#F3F1EC` | `surface.2` |
| `--border` | `#E7E3DB` | `border.DEFAULT` |
| `--emerald` / `-bg` | `#0F6E56` / `#E7F4F0` | `status.emerald` / `.emeraldBg` |
| `--blue` / `-bg` | `#1F5FA6` / `#EAF2FA` | `status.blue` / `.blueBg` |
| `--amber` / `-bg` | `#8A5206` / `#FBF0DF` | `status.amber` / `.amberBg` |
| `--radius` / `-sm` / `-photo` | `12px` / `10px` / `3px` | `borderRadius.card/.sm/.photo` |
| `--shadow` / `-lg` | as defined | `boxShadow.card/.cardLg` |
| Body font | Plus Jakarta Sans | `fontFamily.sans` |
| Display font | Fraunces | `fontFamily.display` |

The stag logo SVG (currently the `STAG` string in `assets/app.js`) becomes a `<StagLogo />` React
component with the same path data. Nav/footer become `<SiteHeader />` / `<SiteFooter />` Server
Components with the same structure (active-link state, dark multi-column footer, mobile drawer).

## 5. Pages → routes

| Static page | App Router route | Notes |
|---|---|---|
| `index.html` | `/` | Featured listings now a real DB query, not `slice(0,3)`. |
| `browse.html` | `/browse` | Filters become search params (`?rentMax=2500&beds=2...`), server-rendered results + client interactivity for the map toggle. |
| `listing.html?id=` | `/listings/[id]` | Dynamic route; photos/reviews/amenities from DB. |
| `about.html` | `/about` | Static content, no data needs. |
| `list-property.html` | `/landlord/listings/new` | Now requires an **approved** landlord session (§8). |
| `signin.html` | `/signin` | Real OTP flow (§8), not a client-only demo gate. |
| `dashboard.html` | `/dashboard` | Real favorites/applications/documents/alerts, per logged-in student. |
| `rental.html` | `/rental` | Real lease, real roommate split, real Stripe payment (§9). |
| `manage.html` | `/landlord` | Real rent roll/maintenance/applications/listings for the logged-in landlord. |
| `manage.html` (new) | `/landlord/payouts` | New — Stripe Connect onboarding + payout status (§9). |
| `admin.html` | `/admin` | Still excluded from nav; now actually access-controlled (§8), not just hidden. |

## 6. Data model (Prisma schema, `schema.prisma`)

Money stored as `Int` cents throughout (Stripe convention, avoids float rounding).

```prisma
enum UserRole {
  STUDENT
  LANDLORD
  ADMIN
}

enum ListingStatus {
  DRAFT
  PENDING_REVIEW
  LIVE
  REMOVED
}

enum ApplicationStatus {
  PENDING
  ACCEPTED
  DECLINED
  WAITLISTED
}

enum LeaseStatus {
  ACTIVE
  ENDED
  TERMINATED
}

enum RentPaymentStatus {
  DUE
  PROCESSING
  PAID
  FAILED
}

enum MaintenanceStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
}

enum ReviewStatus {
  PENDING
  PUBLISHED
  REMOVED
}

enum DocumentKind {
  LEASE_AGREEMENT
  INSPECTION_REPORT
  INSURANCE
  OTHER
}

model University {
  id        String   @id @default(cuid())
  name      String
  emailDomain String  @unique   // "student.fairfield.edu"
  campusLat Float
  campusLng Float
  createdAt DateTime @default(now())

  students  StudentProfile[]
  listings  Listing[]
}

model User {
  id        String   @id                // matches Supabase auth.users.id
  email     String   @unique
  role      UserRole
  createdAt DateTime @default(now())

  student   StudentProfile?
  landlord  LandlordProfile?
  favorites Favorite[]
  applications Application[]
  sentMessages Message[] @relation("MessageSender")
  maintenanceReports MaintenanceRequest[]
  reviews   Review[]
}

model StudentProfile {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  universityId  String
  university    University @relation(fields: [universityId], references: [id])
  verifiedAt    DateTime?   // domain-verified via OTP
  phone         String?

  leaseTenancies LeaseTenant[]
}

model LandlordProfile {
  id                    String   @id @default(cuid())
  userId                String   @unique
  user                  User     @relation(fields: [userId], references: [id])
  companyName           String?
  phone                 String?
  approvedAt            DateTime?          // null = pending admin approval
  stripeAccountId       String?  @unique
  stripeChargesEnabled  Boolean  @default(false)
  stripePayoutsEnabled  Boolean  @default(false)
  createdAt             DateTime @default(now())

  listings              Listing[]
  leases                Lease[]
}

model Listing {
  id            String   @id @default(cuid())
  landlordId    String
  landlord      LandlordProfile @relation(fields: [landlordId], references: [id])
  universityId  String
  university    University @relation(fields: [universityId], references: [id])
  status        ListingStatus @default(DRAFT)
  title         String
  address       String
  lat           Float
  lng           Float
  rentCents     Int
  depositCents  Int
  beds          Int
  baths         Decimal
  furnished     Boolean  @default(false)
  petsAllowed   Boolean  @default(false)
  availableOn   DateTime
  leaseTermMonths Int
  parking       String
  description   String
  amenities     String[]
  walkCampusMin Int
  walkBarsMin   Int
  walkRestMin   Int
  walkGroceryMin Int
  safetyScore   Int
  quietScore    Int
  convenienceScore Int
  verified      Boolean  @default(false)   // "Verified landlord" badge
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  photos        ListingPhoto[]
  reviews       Review[]
  favorites     Favorite[]
  applications  Application[]
  leases        Lease[]
}

model ListingPhoto {
  id         String  @id @default(cuid())
  listingId  String
  listing    Listing @relation(fields: [listingId], references: [id])
  storagePath String  // Supabase Storage path, private bucket
  sortOrder  Int
}

model Review {
  id         String   @id @default(cuid())
  listingId  String
  listing    Listing  @relation(fields: [listingId], references: [id])
  authorId   String
  author     User     @relation(fields: [authorId], references: [id])
  rating     Int
  text       String
  status     ReviewStatus @default(PENDING)
  createdAt  DateTime @default(now())
}

model Favorite {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  listingId  String
  listing    Listing  @relation(fields: [listingId], references: [id])
  createdAt  DateTime @default(now())

  @@unique([userId, listingId])
}

model Application {
  id          String   @id @default(cuid())
  listingId   String
  listing     Listing  @relation(fields: [listingId], references: [id])
  studentId   String
  student     User     @relation(fields: [studentId], references: [id])
  status      ApplicationStatus @default(PENDING)
  profileSnapshot Json          // universal-application data at time of submission
  submittedAt DateTime @default(now())
}

model Lease {
  id             String   @id @default(cuid())
  listingId      String
  listing        Listing  @relation(fields: [listingId], references: [id])
  landlordId     String
  landlord       LandlordProfile @relation(fields: [landlordId], references: [id])
  startDate      DateTime
  endDate        DateTime
  monthlyRentCents Int
  depositCents   Int
  status         LeaseStatus @default(ACTIVE)
  createdAt      DateTime @default(now())

  tenants        LeaseTenant[]
  rentPayments   RentPayment[]
  maintenance    MaintenanceRequest[]
  documents      Document[]
}

model LeaseTenant {
  id             String   @id @default(cuid())
  leaseId        String
  lease          Lease    @relation(fields: [leaseId], references: [id])
  studentId      String
  student        StudentProfile @relation(fields: [studentId], references: [id])
  rentShareCents Int              // this tenant's monthly slice of monthlyRentCents

  @@unique([leaseId, studentId])
}

model RentPayment {
  id                  String   @id @default(cuid())
  leaseId             String
  lease               Lease    @relation(fields: [leaseId], references: [id])
  tenantUserId        String   // References User.id of the paying roommate
  amountDueCents      Int
  amountPaidCents     Int?
  dueDate             DateTime
  status              RentPaymentStatus @default(DUE)
  stripePaymentIntentId String? @unique
  paidAt              DateTime?
  method              String?          // e.g. "card"
  createdAt           DateTime @default(now())
}

model MaintenanceRequest {
  id           String   @id @default(cuid())
  leaseId      String
  lease        Lease    @relation(fields: [leaseId], references: [id])
  reportedById String
  reportedBy   User     @relation(fields: [reportedById], references: [id])
  title        String
  detail       String
  status       MaintenanceStatus @default(OPEN)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Message {
  id           String   @id @default(cuid())
  listingId    String?
  senderId     String
  sender       User     @relation("MessageSender", fields: [senderId], references: [id])
  recipientId  String
  body         String
  createdAt    DateTime @default(now())
  readAt       DateTime?
}

model Document {
  id            String   @id @default(cuid())
  leaseId       String
  lease         Lease    @relation(fields: [leaseId], references: [id])
  uploaderId    String
  kind          DocumentKind
  storagePath   String            // Supabase Storage path, private bucket
  filename      String
  uploadedAt    DateTime @default(now())
}

model SavedSearch {
  id          String   @id @default(cuid())
  studentId   String
  label       String
  filterJson  Json
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

## 7. API surface (Route Handlers, `app/api/**/route.ts`, unless noted as Server Actions)

**Auth**
- `POST /api/auth/otp/request` — `{ email, role }`. If `role === "student"`, reject server-side unless
  `email` ends with the `University.emailDomain` (§8) *before* calling Supabase — never trust a
  client-side check alone.
- `POST /api/auth/otp/verify` — `{ email, code }`. On first success, creates `User` +
  `StudentProfile`/`LandlordProfile`.
- `POST /api/auth/signout`

**Listings (public read, landlord/admin write)**
- `GET /api/listings` — filters as query params (`rentMin`, `rentMax`, `beds`, `maxWalk`, `furnished`,
  `pets`, `category`); returns `LIVE` only for anonymous/student callers.
- `GET /api/listings/:id`
- `POST /api/listings` — landlord only, requires `LandlordProfile.approvedAt != null` (§8); creates as
  `PENDING_REVIEW`.
- `PATCH /api/listings/:id` — owning landlord or admin.
- `DELETE /api/listings/:id` — owning landlord or admin (moderation "remove").
- `POST /api/listings/:id/photos/sign-upload` — returns a signed Storage upload URL.

**Favorites**
- `GET /api/favorites`, `POST /api/favorites/:listingId`, `DELETE /api/favorites/:listingId`

**Applications**
- `POST /api/applications` — student.
- `GET /api/applications` — student's own, or (as landlord) incoming to their listings.
- `PATCH /api/applications/:id` — owning landlord, accept/decline/waitlist.

**Reviews**
- `POST /api/reviews` — student with a `Lease` (past or active) on that listing → `PENDING`.
- `GET /api/listings/:id/reviews` — `PUBLISHED` only, public.
- `PATCH /api/admin/reviews/:id` — admin publish/remove.

**Rental (tenant)**
- `GET /api/rental/lease` — current student's active lease + roommates + rent status.
- `GET /api/rental/payments` — history.
- `POST /api/rental/pay` — creates/returns a Stripe PaymentIntent for the caller's next-due
  `RentPayment` (§9).

**Landlord**
- `GET /api/landlord/rent-roll`
- `GET /api/landlord/applications`, `PATCH .../:id`
- `GET /api/landlord/maintenance`, `PATCH .../:id`
- `POST /api/landlord/stripe/onboard` — creates Express account + Account Link (§9).
- `GET /api/landlord/stripe/status`

**Maintenance / Messages / Documents**
- `POST /api/maintenance`, `GET /api/maintenance`, `PATCH /api/maintenance/:id`
- `GET /api/messages?with=:userId&listingId=`, `POST /api/messages`
- `POST /api/documents/sign-upload`, `GET /api/documents/:id/signed-url`

**Admin** (all require `requireRole("ADMIN")`, §8)
- `GET /api/admin/landlords`, `PATCH /api/admin/landlords/:id/approve`, `.../reject`
- `GET /api/admin/listings`, `PATCH /api/admin/listings/:id/remove`
- `GET /api/admin/reviews`
- `GET /api/admin/users`

**Webhooks**
- `POST /api/webhooks/stripe` — single endpoint, switches on `event.type`:
  `account.updated` (sync `LandlordProfile.stripe*Enabled`), `payment_intent.succeeded` /
  `.payment_failed` (update the matching `RentPayment`).

## 8. Auth & guardrails

1. **Fairfield-email gate is server-side, not just UI.** `POST /api/auth/otp/request` checks the
   email domain against `University.emailDomain` *before* asking Supabase to send a code — a student
   picking "Student" in the UI and typing a Gmail address must fail on the server, full stop.
2. **`getSessionUser()`** — server-only helper (Server Component / Route Handler / Server Action) that
   reads the Supabase session from `@supabase/ssr` cookies and returns `{ user, role, studentProfile?,
   landlordProfile? }` or `null`.
3. **`requireRole(role)`** — throws/redirects if `getSessionUser()` doesn't match; used at the top of
   every protected Route Handler and Server Component page.
4. **Landlord approval gate.** New `LandlordProfile` rows are created with `approvedAt: null`. Every
   listing-creation path (`POST /api/listings`, the `/landlord/listings/new` page) calls
   `requireRole("LANDLORD")` *and* checks `approvedAt != null` — unapproved landlords see a "pending
   review" state instead of the create-listing form.
5. **Admin is an allowlist, not just a role column.** `ADMIN_EMAILS` env var (comma-separated). On
   login, if the email matches, the session is treated as admin for that request regardless of what's
   stored on `User.role` — defense in depth against a compromised/mistaken DB row silently granting
   admin.
6. **`middleware.ts`** — protects `/dashboard`, `/rental`, `/landlord/*`, `/admin/*` at the edge:
   no session → redirect to `/signin`; wrong role → redirect to `/` with a toast, never a silent 200
   with empty data.

## 9. Payments (Stripe Connect)

**Onboarding** (`/landlord/payouts`)
- `POST /api/landlord/stripe/onboard`: if `LandlordProfile.stripeAccountId` is null, create a Stripe
  **Express** connected account, save the id; either way, create an **Account Link** (hosted onboarding)
  and return its URL for the client to redirect to.
- Page shows `stripeChargesEnabled` / `stripePayoutsEnabled` (kept in sync by the webhook below), plus
  a re-onboard link if Stripe reports outstanding `requirements`.
- `account.updated` webhook → look up `LandlordProfile` by `stripeAccountId`, update the two boolean
  flags.

**Rent payment** (`/rental`, "Pay rent")
- One `RentPayment` row already exists per tenant per due period (seeded when the `Lease` is created,
  split via each `LeaseTenant.rentShareCents`).
- `POST /api/rental/pay` creates a **PaymentIntent**:
  ```ts
  stripe.paymentIntents.create({
    amount: rentPayment.amountDueCents,
    currency: "usd",
    transfer_data: { destination: landlord.stripeAccountId },
    application_fee_amount: platformFeeCents, // optional, e.g. Math.round(amount * 0.03)
    metadata: { rentPaymentId: rentPayment.id },
  });
  ```
  Returns `client_secret` to the client — **never the secret key itself**.
- Client uses `@stripe/stripe-js` + `@stripe/react-stripe-js` Elements, initialized with
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, to collect card details and confirm the PaymentIntent in-page
  (no redirect to a Stripe-hosted page this time — a deliberate change from the static site's Checkout
  Session approach, since we're now inside a real app shell instead of a plain static page).
- `payment_intent.succeeded` webhook reads `metadata.rentPaymentId`, sets that `RentPayment.status =
  PAID`, `amountPaidCents`, `paidAt`, `stripePaymentIntentId`. `.payment_failed` sets `FAILED`.
- The Stripe secret key is read only inside Route Handlers/webhook handlers (`process.env.STRIPE_SECRET_KEY`,
  server-only) — identical rule to the static site's Netlify Function, just relocated.

## 10. Environment variables (`.env.example`)

```
# Database (Supabase Postgres)
DATABASE_URL=            # pooled connection, used at runtime
DIRECT_URL=               # direct connection, used by `prisma migrate`

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-only — Storage signed URLs, admin ops

# Stripe
STRIPE_SECRET_KEY=            # server-only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# App
ADMIN_EMAILS=you@example.com,other-admin@example.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional — matches the static site's CONFIG.MAPS_KEY, public by nature (restrict by HTTP referrer
# in Google Cloud console instead of treating as secret)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Rule, restated: any variable without `NEXT_PUBLIC_` never appears in client code, ever — enforced by
only reading it inside Server Components, Route Handlers, Server Actions, or webhook handlers.
