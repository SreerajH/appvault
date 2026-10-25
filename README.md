# AppVault — Modern App Marketplace

A Play Store / Web Store style web application built with Next.js 16, featuring a complete app browsing, search, and review experience.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Components | Radix UI (custom styled) |
| Forms | React Hook Form + Zod |
| Database | SQLite (via libSQL) |
| ORM | Prisma v7 |
| Auth | NextAuth.js (Credentials) |

## Features

- **Today (home)** — Editorial masthead with live catalogue counts, App of the Day / Highest Rated / Just Landed story cards, Top Charts (free · paid · rated), category tiles, Editors' Choice shelf, "Popular right now" 3-row shelf, and a New & Updated band showing each app's release notes
- **Explore Page** — Search with keyboard-navigable suggestions (`/` to focus), category chip rail, segmented sort, price/rating filters, load-more pagination
- **App Detail** — Product-page layout: stat strip, screenshot lightbox, About + What's New, Information table, ratings histogram + reviews, sticky compact GET bar, install simulation, APK download, share
- **Category Pages** — Tinted category banner, chip rail to jump between categories, sort/filter sidebar
- **Auth** — Split-screen Login / Register with a live wall of app icons; one-click demo credentials
- **Profile** — Edit name, review stats, all submitted reviews
- **Mobile** — Native-store style bottom tab bar (Today · Explore · Search · Account)

## Design system — "Storefront"

Warm paper canvas (`paper #F3F0E8`), ink type (`ink #14120F`) and a single tangerine signal colour (`signal #F04A16`, `signal-ink #B4300C` for text) used only for actions, ranks and focus. Dark `night` bands add rhythm. Type: Schibsted Grotesk (display), Geist (body), Geist Mono (labels/data). Tokens live in `app/globals.css`; per-app tints, category styles and copy helpers in `lib/design.ts`.

## Quick Start

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed with 38 apps, 8 categories, 5 users, 100+ reviews
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Login

```
Email:    demo@appvault.com
Password: demo1234
```

## Folder Structure

```
appvault/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page (server)
│   ├── providers.tsx           # SessionProvider
│   ├── components/             # Page sections (hero, featured, trending...)
│   ├── explore/                # Browse/search page
│   ├── app/[id]/               # App detail page
│   ├── category/[slug]/        # Category page
│   ├── login/ register/        # Auth pages
│   ├── profile/                # Protected profile
│   └── api/                    # REST API routes
├── components/
│   ├── ui/                     # Button, Badge, Card, Input, Dialog, Tabs...
│   ├── layout/                 # Header, Footer, Sidebar
│   ├── apps/                   # AppCard, AppGrid, FeaturedCarousel
│   ├── reviews/                # ReviewCard, StarRatingInput
│   ├── search/                 # SearchBar with autocomplete
│   └── common/                 # StarRating, Skeletons, EmptyState
├── lib/
│   ├── prisma.ts               # Prisma client (libSQL adapter)
│   ├── auth.ts                 # NextAuth config
│   ├── utils.ts                # Utilities (cn, formatDownloads, etc.)
│   └── validations.ts          # Zod schemas
├── types/index.ts              # Shared TypeScript types
├── hooks/use-toast.ts          # Toast hook
└── prisma/
    ├── schema.prisma           # DB schema
    └── seed.ts                 # Seed script
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/apps` | List with `?search`, `?category`, `?sort`, `?price`, `?minRating`, `?page` |
| GET | `/api/apps/[id]` | Single app + reviews |
| GET | `/api/apps/featured` | Featured apps |
| GET | `/api/apps/trending` | Top by downloads |
| GET | `/api/categories` | Categories with counts |
| POST | `/api/reviews` | Submit review (auth required) |
| GET | `/api/reviews/user` | User's reviews (auth required) |
| GET | `/api/search/suggest?q=` | Autocomplete |
| POST | `/api/auth/register` | Register |
| GET/PATCH | `/api/user/profile` | Profile (auth required) |

## Environment Variables

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```
