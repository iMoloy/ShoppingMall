# ShoppingMall — Full-Stack SaaS Plan

## Tech Stack

| Layer            | Choice                                                          |
| ---------------- | --------------------------------------------------------------- |
| Frontend         | Next.js 16 (Turbopack, App Router, React 19 RSC) + TypeScript   |
| Styling          | Tailwind CSS v4 (CSS variables, Dark mode, Semi-rounded)        |
| State Management | Zustand with `persist` middleware                               |
| Backend          | NestJS + TypeScript (Modular Architecture)                      |
| Database         | PostgreSQL + Prisma ORM                                         |
| Auth             | Raw JWT — `jsonwebtoken` + `bcrypt` with Refresh Token Rotation |
| Validation       | Zod (frontend) + class-validator (NestJS)                       |
| Monorepo         | Turborepo + pnpm workspaces                                     |
| Images           | ImgBB API / Unsplash CDN                                        |
| Payment          | SSLCommerz (BD) + Stripe (International)                        |
| Email            | Nodemailer / Resend                                             |
| Logging          | pino (structured JSON, no console.log in prod)                  |
| Error Tracking   | Sentry (frontend + backend)                                     |
| Deployment       | Vercel (Next.js) + Railway (NestJS + PostgreSQL)                |

---

## Folder Structure

```
ShoppingMall/
├── apps/
│   ├── web/                          # Next.js 16 frontend
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── (shop)/
│   │   │   │   ├── page.tsx                 # Homepage / hero seasonal slider
│   │   │   │   ├── hero-slider.tsx          # Autoplay buttonless Summer & Winter slider
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx             # Product listing + faceted catalog filters
│   │   │   │   │   ├── catalog-filters.tsx
│   │   │   │   │   └── [slug]/page.tsx      # PDP (Zoom, Lightbox, Urgency, Reviews, Size)
│   │   │   │   ├── cart/page.tsx
│   │   │   │   ├── checkout/page.tsx        # 3-stage luxury checkout simulator
│   │   │   │   ├── wishlist/page.tsx        # Wishlist dossier & "Move to Bag"
│   │   │   │   ├── lookbook/page.tsx        # Editorial runway lookbook with hotspot pins
│   │   │   │   ├── tracking/page.tsx        # Live 5-stage shipment order tracking
│   │   │   │   ├── orders/page.tsx          # Customer order history
│   │   │   │   ├── stores/page.tsx
│   │   │   │   └── [content-pages]/         # sizing-guide, sustainability, press, returns, shipping, cookies, terms, privacy
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx               # Admin operations layout
│   │   │   │   ├── page.tsx                 # Atelier revenue telemetry & stock alert banner
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx             # Inventory SKU management & search
│   │   │   │   │   └── new/page.tsx         # Add new product form
│   │   │   │   └── orders/page.tsx          # Order dispatch & fulfillment tracker
│   │   │   ├── layout.tsx                   # Root layout (ThemeProvider, CartDrawer, Currency)
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   └── not-found.tsx
│   │   ├── components/
│   │   │   ├── ui/                          # Button, Input, Badge, Modal, Toast, Skeleton, Newsletter
│   │   │   ├── layout/                      # Navbar, Footer, HeaderSearch, CurrencySelector
│   │   │   ├── product/                     # ProductCard, ProductGallery, StockUrgencyTimer, ProductSizePicker, SizeCalculatorModal, ProductReviews, RecentlyViewed, QuickViewModal
│   │   │   ├── cart/                        # CartDrawer, CartItem, FreeShippingBar, PromoCode
│   │   │   ├── dashboard/                   # DashboardShell
│   │   │   └── theme/                       # ThemeToggle
│   │   ├── lib/
│   │   │   ├── api.ts                       # Typed fetch wrapper
│   │   │   ├── auth.ts                      # Token memory store + refresh logic
│   │   │   └── validations.ts               # Zod schemas
│   │   ├── actions/                         # Server Actions
│   │   ├── store/
│   │   │   ├── cart.ts                      # Zustand cart store with promo & shipping calc
│   │   │   ├── currency.ts                  # Zustand multi-currency store (USD, EUR, GBP, BDT, JPY)
│   │   │   └── wishlist.ts                  # Zustand persistent wishlist store
│   │   ├── types/
│   │   └── proxy.ts                         # Route protection (Next.js 16 convention)
│   │
│   └── api/                          # NestJS backend
│       ├── src/
│       │   ├── auth/
│       │   │   ├── auth.module.ts
│       │   │   ├── auth.controller.ts
│       │   │   ├── auth.service.ts
│       │   │   ├── dto/
│       │   │   └── guards/jwt.guard.ts
│       │   ├── users/
│       │   ├── products/
│       │   ├── categories/
│       │   ├── cart/
│       │   ├── wishlist/
│       │   ├── reviews/
│       │   ├── orders/
│       │   ├── tracking/
│       │   ├── uploads/
│       │   ├── health/                      # GET /api/health
│       │   ├── common/
│       │   │   ├── filters/                 # Global exception filter
│       │   │   ├── interceptors/            # Response transform + correlation ID
│       │   │   └── pipes/                   # Validation pipe
│       │   ├── config/
│       │   │   └── env.validation.ts        # Zod env schema (fail fast)
│       │   ├── prisma/
│       │   │   └── prisma.service.ts
│       │   └── main.ts
│       └── prisma/
│           ├── schema.prisma
│           ├── seed.ts
│           └── migrations/
│
├── packages/
│   └── shared-types/                  # Shared TS types (enums, DTOs)
│       └── src/
│           ├── enums.ts               # Role, OrderStatus, Currency
│           ├── api/                   # Request/Response shapes
│           └── index.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml                     # Lint + type-check + build on PR
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── .gitignore
```

---

## Database Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String
  passwordHash  String
  role          Role           @default(BUYER)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  orders        Order[]
  cart          CartItem[]
  wishlist      WishlistItem[]
  reviews       Review[]
  addresses     Address[]
  refreshTokens RefreshToken[]

  @@index([email])
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  familyId  String   # For reuse-detection
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([expiresAt])
}

model Address {
  id         String  @id @default(cuid())
  userId     String
  label      String  # "Home", "Office"
  line1      String
  line2      String?
  city       String
  country    String  @default("Bangladesh")
  isDefault  Boolean @default(false)
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Category {
  id       String    @id @default(cuid())
  name     String    @unique
  slug     String    @unique
  products Product[]
}

model Product {
  id          String         @id @default(cuid())
  name        String
  slug        String         @unique
  description String
  price       Decimal        @db.Decimal(10, 2)
  stock       Int            @default(0)
  images      String[]       # CDN image URLs array
  season      String?        # "summer" | "winter"
  isFeatured  Boolean        @default(false)
  categoryId  String
  category    Category       @relation(fields: [categoryId], references: [id])
  cartItems   CartItem[]
  wishlist    WishlistItem[]
  reviews     Review[]
  orderItems  OrderItem[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  deletedAt   DateTime?      # Soft delete — never hard delete

  @@index([categoryId])
  @@index([slug])
  @@index([deletedAt])
}

model CartItem {
  id        String  @id @default(cuid())
  userId    String
  productId String
  quantity  Int
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
}

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, productId])
  @@index([userId])
}

model Review {
  id        String   @id @default(cuid())
  userId    String
  productId String
  rating    Int      # 1 to 5 stars
  comment   String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([productId])
  @@index([userId])
}

model Order {
  id              String      @id @default(cuid())
  userId          String
  status          OrderStatus @default(PENDING)
  total           Decimal     @db.Decimal(10, 2)  # Calculated server-side
  currency        String      @default("USD")     # USD, EUR, GBP, BDT, JPY
  addressSnapshot Json        # Address at time of order (immutable)
  paymentRef      String?     # SSLCommerz / Stripe / COD reference
  trackingNumber  String?     # Waybill carrier number
  courier         String?     # DHL, FedEx, RedX, Pathao
  idempotencyKey  String      @unique  # Prevent duplicate orders
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  user            User        @relation(fields: [userId], references: [id])
  items           OrderItem[]

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  productId   String
  quantity    Int
  priceAtTime Decimal @db.Decimal(10, 2)  # Price snapshot — never recalculate
  order       Order   @relation(fields: [orderId], references: [id])
  product     Product @relation(fields: [productId], references: [id])
}

model AuditLog {
  id         String   @id @default(cuid())
  actorId    String   # Admin user ID
  action     String   # 'product.create', 'product.delete', 'order.status_change'
  entityType String
  entityId   String
  diff       Json?    # Before/after values
  ip         String?
  createdAt  DateTime @default(now())

  @@index([actorId])
  @@index([entityType, entityId])
}

enum Role {
  BUYER
  ADMIN
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

---

## Auth Flow (Raw JWT)

```
Register  → validate (Zod) → hash password (bcrypt cost 12) → save User
Login     → verify password → issue accessToken (15min, signed HS256)
                            → issue refreshToken (7d) with familyId
                            → refreshToken saved in DB
                            → refreshToken → httpOnly Secure SameSite=Strict cookie
                            → accessToken → response body → JS memory only

Refresh   → read cookie → find token in DB → check expiresAt
          → if usedAt set → REUSE DETECTED → revoke entire family → logout all devices
          → rotate: invalidate old, issue new refreshToken (same familyId)
          → return new accessToken

Logout    → delete refreshToken from DB → clear cookie

Guards:
  NestJS: JwtGuard reads Authorization: Bearer <accessToken> → jsonwebtoken.verify()
  Next.js middleware: reads accessToken from memory → validates → redirects if invalid
```

---

## Security Rules

- `accessToken` — JS memory only, never localStorage/sessionStorage/cookie
- `refreshToken` — httpOnly Secure SameSite=Strict cookie, unreadable by JS
- All prices calculated server-side — client price input ignored
- All role checks enforced in NestJS guards — client role claims ignored
- Stock check + order creation in single Prisma `$transaction`
- Payment webhook idempotency via `idempotencyKey` on Order
- Rate limiting: auth endpoints 5 req/min, public API 60 req/min per IP
- CORS: only frontend origin whitelisted (env variable)
- Helmet: 15+ HTTP security headers
- Account lockout: 5 failed logins → 15 min block (tracked in DB)
- Env vars validated with Zod on startup — missing = server won't start
- No console.log in production — structured pino JSON logging only
- Correlation ID on every request for trace debugging
- Admin actions logged to AuditLog table

---

## API Response Shape

```typescript
// Success
{ success: true, data: T, meta?: { total: number; page: number; limit: number } }

// Error
{ success: false, error: { code: string; message: string; details?: unknown } }
```

HTTP status codes: 200 GET/PUT, 201 POST, 204 DELETE, 400 validation,
401 unauthenticated, 403 forbidden, 404 not found, 409 conflict,
422 business rule, 429 rate limited, 500 server error

---

## Design System

- **Colors**: Neutral slate/zinc + rose accent. No purple, no violet, no neon.
- **Dark mode**: `class="dark"` on `<html>`. Tailwind `dark:` variants. Persisted in localStorage.
- **Animations**: `transition-colors duration-150` for hover/focus only. Nothing else.
- **No glow**: No colored shadows, no drop-shadow with color, no glassmorphism.
- **One Button**: Single `<Button>` component. Same padding (`px-4 py-2`), same radius (`rounded-md`), same font (`text-sm font-medium`). Only background color changes per variant.

```
Button variants:
  primary:     bg-rose-600 text-white hover:bg-rose-700
  secondary:   border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800
  destructive: bg-red-600 text-white hover:bg-red-700
  ghost:       hover:bg-zinc-100 dark:hover:bg-zinc-800
```

---

## Execution Sections

### FRONTEND (100% Complete)

| #   | Section                                                                          | Status |
| --- | -------------------------------------------------------------------------------- | ------ |
| F1  | Monorepo init (Turborepo + pnpm workspaces + shared-types)                       | ✅     |
| F2  | Next.js scaffold + Tailwind v4 + dark mode setup                                 | ✅     |
| F3  | Base layout — Navbar, Footer, ThemeToggle, MobileMenu                            | ✅     |
| F4  | UI primitives — Button, Input, Badge, Skeleton, Toast, Modal                     | ✅     |
| F5  | Auth pages — Login, Register (forms + Zod validation)                            | ✅     |
| F6  | Homepage — Hero section, category quick-links                                    | ✅     |
| F7  | Product listing page — grid, filters, skeleton loading                           | ✅     |
| F8  | Product detail page — images, stock badge, Add to Cart                           | ✅     |
| F9  | Cart — Zustand store + CartDrawer slide-in + Cart Page                           | ✅     |
| F10 | Checkout — multi-step form (address → summary → confirm)                         | ✅     |
| F11 | Order history page (buyer)                                                       | ✅     |
| F12 | Admin dashboard — layout, product CRUD, order management                         | ✅     |
| F13 | proxy.ts — route protection (Next.js 16 convention)                              | ✅     |
| F14 | SEO — generateMetadata per page, not-found, error, loading                       | ✅     |
| F15 | Instant Predictive Search Dropdown (`HeaderSearch` in Navbar)                    | ✅     |
| F16 | PDP Ultra-Detail Zoom Lens & Fullscreen Lightbox (`ProductGallery`)              | ✅     |
| F17 | Low-Stock Urgency & Same-Day Dispatch Countdown Timer (`StockUrgencyTimer`)      | ✅     |
| F18 | Interactive Fit Calculator & Size Selector Modal (`ProductSizePicker`)           | ✅     |
| F19 | Multi-Currency Engine (USD, EUR, GBP, BDT, JPY) (`useCurrencyStore`)             | ✅     |
| F20 | Customer Reviews Breakdown & Recently Viewed History (`RecentlyViewed`)          | ✅     |
| F21 | Persistent Wishlist System with dedicated view (`/wishlist`, `useWishlistStore`) | ✅     |
| F22 | Editorial Runway Lookbook with Interactive Hotspot Pins (`/lookbook`)            | ✅     |
| F23 | 3-Stage Luxury Checkout Simulator (`/checkout`)                                  | ✅     |
| F24 | Live 5-Stage Order Tracking Dossier & Printable Invoice (`/tracking`)            | ✅     |
| F25 | Admin Atelier Operations Console & Revenue Telemetry (`/dashboard`)              | ✅     |
| F26 | Buttonless Seasonal Hero Auto-Slider (Summer & Winter 2026)                      | ✅     |
| F27 | Strict Semi-Rounded Design System Enforcement (Zero `rounded-full`)              | ✅     |

### BACKEND

| #   | Section                                  | Description                                                                     | Status |
| --- | ---------------------------------------- | ------------------------------------------------------------------------------- | ------ |
| B1  | NestJS scaffold + project structure      | `apps/api` NestJS project setup with TypeScript, ESLint, Prettier               | ✅     |
| B2  | Prisma schema + initial migration + seed | PostgreSQL / Prisma client setup, data models, initial migrations, seed data    | ✅     |
| B3  | Global setup & security                  | Helmet, CORS, Throttler rate limiting, pino structured logger, exception filter | ✅     |
| B4  | Health check endpoint                    | `GET /api/v1/health` with database ping and uptime metrics                      | ✅     |
| B5  | Auth module                              | Registration, login, refresh token rotation, logout, JWT passport guards        | ✅     |
| B6  | Users module                             | Profile management, shipping address book                                       | ✅     |
| B7  | Categories module                        | Category listing and admin CRUD                                                 | ✅     |
| B8  | Products module                          | Cursor pagination, full-text search, category filter, admin product CRUD        | ✅     |
| B9  | Uploads module                           | Image uploads to ImgBB / Cloud CDN                                              | ✅     |
| B10 | Cart module                              | User cart persistence, sync with guest cart                                     | ✅     |
| B11 | Wishlist module                          | User wishlist persistence and toggles                                           | ✅     |
| B12 | Reviews module                           | Verified purchaser ratings and reviews                                          | ✅     |
| B13 | Orders & Tracking module                 | Atomic order creation, idempotency key, status milestones, waybill tracking     | ✅     |
| B14 | Payment module                           | SSLCommerz (BD) + Stripe webhook integration                                    | ✅     |
| B15 | Audit log & Maintenance                  | Admin audit log trails and expired token cleanup cron                           | ✅     |

---

## Environment Variables

```bash
# apps/api/.env
DATABASE_URL=
JWT_ACCESS_SECRET=          # min 32 chars
JWT_REFRESH_SECRET=         # min 32 chars, different from access
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
FRONTEND_URL=http://localhost:3000
IMGBB_API_KEY=
SENTRY_DSN=
NODE_ENV=development

# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
SENTRY_DSN=
```
