<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a0a0a,100:7f1d1d&height=180&section=header&text=Shopping%20Mall%20Atelier&fontSize=42&fontColor=ffffff&fontAlignY=38&desc=Luxury%20Fashion%20Storefront%20%26%20SaaS%20E-Commerce%20Platform&descAlignY=60&descSize=15&descColor=fca5a5&animation=fadeIn" width="100%" alt="Shopping Mall Banner" />

[![Next.js 16](https://img.shields.io/badge/Next.js%2016-Turbopack-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React%2019-RSC-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript%205-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS%20v4-CSS_Variables-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Turborepo](https://img.shields.io/badge/Turborepo-pnpm_Workspaces-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build)

</div>

---

## 📖 Overview

**Shopping Mall** is a high-fashion luxury e-commerce platform and full-stack SaaS architecture. Crafted with editorial aesthetics, strict semi-rounded geometry, and sub-second performance powered by Next.js 16 App Router, React 19 Server Components, and a modular NestJS/Prisma backend.

The platform provides a complete customer journey — from editorial runway lookbooks and predictive search to interactive fit calculations, multi-currency purchasing, and real-time package tracking.

---

## 🏛️ Monorepo Architecture

```
ShoppingMall/
├── apps/
│   ├── web/                          # Next.js 16 App Router (Storefront + Dashboard)
│   │   ├── app/                      # 29 routes (Shop, Auth, Admin Dashboard)
│   │   ├── components/               # UI primitives, Cart, Product, Layout, Dashboard
│   │   ├── store/                    # Zustand stores (Cart, Currency, Wishlist)
│   │   ├── lib/                      # API client, Auth memory tokens, Zod schemas
│   │   └── types/                    # Frontend page parameters and props
│   │
│   └── api/                          # NestJS Backend API
│       ├── src/                      # Modular architecture (Auth, Products, Orders, Cart)
│       └── prisma/                   # PostgreSQL schema, migrations, seed script
│
├── packages/
│   └── shared-types/                 # Shared TypeScript contracts (DTOs, Enums, APIs)
│
├── turbo.json                        # Turborepo task pipelines
├── pnpm-workspace.yaml               # pnpm monorepo workspace configuration
└── package.json                      # Workspace scripts
```

---

## ✨ Storefront Features

### 1. Editorial Hero & Seasonal Capsule

- **Buttonless Seasonal Carousel:** Automated smooth cross-fade slider alternating between the **Summer Collection 2026** (Linen suits & minimalist leather) and **Winter Collection 2026** (Structured virgin wool coats & cashmere knitwear).
- **Curated Metrics:** Instant atelier trust indicators (38+ curated styles, 100% authentic craft, 48h dispatch).

### 2. Instant Predictive Search & Navigation

- **Navbar Predictive Autocomplete:** Real-time search dropdown featuring instant thumbnail rendering, category tags, pricing, and direct catalog navigation on both desktop and mobile viewports.
- **Semi-Rounded Luxury Aesthetic:** Zero `rounded-full` styling across the design system; strictly standardized on `rounded-md`, `rounded-lg`, and `rounded-xl`.

### 3. Product Detail Page (PDP) Luxury Suite

- **Ultra-Detail Zoom Magnifier:** 2.2x cursor-tracking magnification with dynamic transform origin for high-resolution garment inspection without heavy 3rd-party dependencies.
- **Fullscreen Gallery Lightbox:** Keyboard-accessible modal with image navigation and background scroll-lock.
- **Stock Urgency & Dispatch Countdown:** Amber pulse alerts when stock is $\le 5$ and live countdown timer towards the 5:00 PM atelier dispatch cutoff.
- **Find My Size Interactive Calculator:** Height, weight, and fit preference calculator suggesting sizes `XS`–`XL`.
- **Customer Reviews & Recents:** Rating breakdown with verified review submissions and local history of recently viewed pieces.

### 4. Commerce & Fulfillment

- **Multi-Currency Engine:** Live currency switching between **USD ($), EUR (€), GBP (£), BDT (৳), and JPY (¥)** persisted via Zustand.
- **Slide-Over Cart Drawer:** Real-time free shipping threshold progress bar ($150 cutoff), coupon code validator (`SUMMER20`, `WELCOME10`), and quantity adjusters.
- **Persistent Wishlist:** Dedicated `/wishlist` management with heart toggles and "Move All to Bag" actions.
- **Runway Lookbook (`/lookbook`):** High-fashion magazine spread with animated interactive hotspot pins (`+`) for direct cart addition.
- **3-Stage Luxury Checkout (`/checkout`):** Address autofill demo, delivery courier tiers, payment simulators (Card, bKash/Nagad, COD), and confirmed order dossier.
- **Live Shipment Tracking (`/tracking`):** 5-stage shipment timeline with waybill number, courier metadata, and printable tax invoice.

### 5. Admin Operations Console (`/dashboard`)

- **Live Atelier Telemetry:** Gross revenue stream, orders counter, catalog size, and stock replenishment alert banners.
- **Inventory & Fulfillment Management:** SKU tables with live inventory status badges, search filters, and status mutation dropdowns.

---

## 🛠️ Technology Stack

| Layer                  | Technologies                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| **Monorepo**           | [Turborepo](https://turbo.build), [pnpm Workspaces](https://pnpm.io)                                 |
| **Frontend Framework** | [Next.js 16](https://nextjs.org) (Turbopack, App Router, RSC)                                        |
| **UI & Styling**       | [React 19](https://react.dev), [Tailwind CSS v4](https://tailwindcss.com) (CSS variables, Dark mode) |
| **State Management**   | [Zustand](https://github.com/pmndrs/zustand) (with `persist` middleware)                             |
| **Backend Framework**  | [NestJS](https://nestjs.com) (Modular TypeScript Controllers, Services, Guards)                      |
| **Database & ORM**     | [PostgreSQL](https://www.postgresql.org), [Prisma ORM](https://www.prisma.io)                        |
| **Auth & Security**    | JWT Access & Refresh token rotation, bcrypt password hashing, Helmet, CORS, Throttler                |
| **Validation**         | [Zod](https://zod.dev) & `class-validator`                                                           |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: $\ge 20.0.0$
- **pnpm**: $\ge 9.0.0$ (`corepack enable && corepack prepare pnpm@latest --activate`)

### Installation & Run

1. **Clone the repository:**

   ```bash
   git clone https://github.com/iMoloy/ShoppingMall.git
   cd ShoppingMall
   ```

2. **Install all workspace dependencies:**

   ```bash
   pnpm install
   ```

3. **Start the development servers:**
   ```bash
   pnpm dev
   ```
   - Storefront UI: `http://localhost:3000`
   - Admin Console: `http://localhost:3000/dashboard`
   - Backend API: `http://localhost:4000/api/v1`

---

## 📋 Available Monorepo Scripts

```bash
# Start all workspace applications in development mode
pnpm dev

# Build all applications and packages for production
pnpm build

# Run TypeScript checks across all packages
pnpm type-check

# Run ESLint across all packages
pnpm lint

# Format code with Prettier
pnpm format
```

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:7f1d1d,50:1a0a0a,100:0d1117&height=80&section=footer&animation=fadeIn" width="100%" alt="Footer" />
  <sub>Crafted for luxury fashion e-commerce by <strong>Moloy Krishna Paul</strong></sub>
</div>
