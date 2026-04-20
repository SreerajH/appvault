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

- **Home Page** — Animated hero with gradient background, featured apps carousel, trending grid, category pills, new releases
- **Explore Page** — Debounced search, filter by category/price/rating, sort options, load-more pagination
- **App Detail** — Screenshot lightbox, overview/reviews/similar tabs, install simulation with animation, share
- **Category Pages** — Per-category filtered view with sidebar
- **Auth** — Login / Register with demo credentials pre-filled
- **Profile** — Edit name, view all submitted reviews
- **Dark Mode** — Full dark navy/blue design throughout
- **Animations** — Page transitions, staggered card entrances, hover lifts, micro-interactions

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
