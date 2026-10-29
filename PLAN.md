# ShoppingMall — Full-Stack SaaS Plan

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (CSS-based config) |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | Raw JWT — `jsonwebtoken` + `bcrypt` |
| Validation | Zod (frontend) + class-validator (NestJS) |
| Monorepo | Turborepo + pnpm workspaces |
| Images | ImgBB API |
| Payment | SSLCommerz (BD) + Stripe (International) |
| Email | Nodemailer / Resend |
| Logging | pino (structured JSON, no console.log in prod) |
| Error Tracking | Sentry (frontend + backend) |
| Deployment | Vercel (Next.js) + Railway (NestJS + PostgreSQL) |

---

## Folder Structure

```
ShoppingMall/
├── apps/
│   ├── web/                          # Next.js 15 frontend
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── (shop)/
│   │   │   │   ├── page.tsx                 # Homepage / hero
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx             # Product listing + filters
│   │   │   │   │   └── [slug]/page.tsx      # Product detail
│   │   │   │   ├── cart/page.tsx
│   │   │   │   └── checkout/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx               # Admin sidebar layout
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx             # Product table + CRUD
│   │   │   │   │   └── new/page.tsx
│   │   │   │   └── orders/page.tsx
│   │   │   ├── layout.tsx                   # Root layout (ThemeProvider)
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   └── not-found.tsx
│   │   ├── components/
│   │   │   ├── ui/                          # Button, Input, Badge, Modal, Toast, Skeleton
│   │   │   ├── layout/                      # Navbar, Footer, MobileMenu
│   │   │   ├── product/                     # ProductCard, ProductGrid, ProductFilters
│   │   │   ├── cart/                        # CartDrawer, CartItem
│   │   │   └── theme/                       # ThemeToggle
│   │   ├── lib/
│   │   │   ├── api.ts                       # Typed fetch wrapper
│   │   │   ├── auth.ts                      # Token memory store + refresh logic
│   │   │   └── validations.ts               # Zod schemas
│   │   ├── actions/                         # Server Actions
│   │   ├── store/
│   │   │   └── cart.ts                      # Zustand cart store
│   │   ├── types/
│   │   └── middleware.ts                    # JWT guard on protected routes
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
│       │   ├── orders/
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
│           ├── enums.ts               # Role, OrderStatus
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
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String
  price       Decimal     @db.Decimal(10, 2)
  stock       Int         @default(0)
  images      String[]    # ImgBB CDN URLs array
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  cartItems   CartItem[]
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  deletedAt   DateTime?   # Soft delete — never hard delete

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

model Order {
  id              String      @id @default(cuid())
  userId          String
  status          OrderStatus @default(PENDING)
  total           Decimal     @db.Decimal(10, 2)  # Calculated server-side
  addressSnapshot Json        # Address at time of order (immutable)
  paymentRef      String?     # SSLCommerz / Stripe reference
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

### FRONTEND

| # | Section | Status |
|---|---|---|
| F1 | Monorepo init (Turborepo + pnpm workspaces + shared-types) | ✅ |
| F2 | Next.js scaffold + Tailwind v4 + dark mode setup | ✅ |
| F3 | Base layout — Navbar, Footer, ThemeToggle, MobileMenu | ✅ |
| F4 | UI primitives — Button, Input, Badge, Skeleton, Toast, Modal | ✅ |
| F5 | Auth pages — Login, Register (forms + Zod validation) | ✅ |
| F6 | Homepage — Hero section, category quick-links | ✅ |
| F7 | Product listing page — grid, filters, skeleton loading | ✅ |
| F8 | Product detail page — images, stock badge, Add to Cart | ✅ |
| F9 | Cart — Zustand store + CartDrawer slide-in + Cart Page | ✅ |
| F10 | Checkout — multi-step form (address → summary → confirm) | ✅ |
| F11 | Order history page (buyer) | ✅ |
| F12 | Admin dashboard — layout, product CRUD, order management | ✅ |
| F13 | proxy.ts — route protection (Next.js 16 convention) | ✅ |
| F14 | SEO — generateMetadata per page, not-found, error, loading | ✅ |

### BACKEND

| # | Section | Status |
|---|---|---|
| B1 | NestJS scaffold + project structure | ⬜ |
| B2 | Prisma schema + initial migration + seed | ⬜ |
| B3 | Global setup — Helmet, CORS, Throttler, pino logger, exception filter, response interceptor | ⬜ |
| B4 | Health check endpoint | ⬜ |
| B5 | Auth module — register, login, refresh, logout, JWT guard | ⬜ |
| B6 | Users module — profile, address management | ⬜ |
| B7 | Categories module — CRUD (admin only) | ⬜ |
| B8 | Products module — listing (cursor pagination, full-text search), detail, admin CRUD | ⬜ |
| B9 | Uploads module — ImgBB integration | ⬜ |
| B10 | Cart module — add, update, remove, sync | ⬜ |
| B11 | Orders module — create (atomic transaction), list, status update | ⬜ |
| B12 | Payment module — SSLCommerz + Stripe webhook handling (idempotent) | ⬜ |
| B13 | Email module — Nodemailer/Resend templates | ⬜ |
| B14 | Audit log — admin action tracking | ⬜ |
| B15 | Cleanup cron — expired refresh tokens | ⬜ |

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
