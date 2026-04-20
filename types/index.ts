export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  _count?: {
    apps: number
  }
}

export interface App {
  id: string
  name: string
  slug: string
  developer: string
  description: string
  whatsNew?: string | null
  icon: string
  screenshots: string[]
  categoryId: string
  category: Category
  rating: number
  reviewCount: number
  downloads: number
  downloadCount: number
  price: number
  version: string
  size: string
  compatibility: string
  featured: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Review {
  id: string
  rating: number
  comment: string
  userId: string
  user: {
    id: string
    name: string
    avatar?: string | null
  }
  appId: string
  createdAt: string | Date
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  createdAt: string | Date
}

export interface AppWithReviews extends App {
  reviews: Review[]
}

export interface PaginatedApps {
  apps: App[]
  total: number
  page: number
  totalPages: number
}

export interface SearchParams {
  search?: string
  category?: string
  sort?: 'popular' | 'rating' | 'newest' | 'name'
  price?: 'all' | 'free' | 'paid'
  minRating?: number
  page?: number
  limit?: number
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
