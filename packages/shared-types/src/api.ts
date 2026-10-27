// Auth
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

// Product
export interface ProductListItem {
  id: string
  name: string
  slug: string
  price: string
  images: string[]
  stock: number
  category: {
    id: string
    name: string
    slug: string
  }
}

export interface ProductDetail extends ProductListItem {
  description: string
  createdAt: string
}

// Category
export interface Category {
  id: string
  name: string
  slug: string
}

// Cart
export interface CartItemResponse {
  id: string
  quantity: number
  product: ProductListItem
}

// Order
export interface OrderResponse {
  id: string
  status: string
  total: string
  createdAt: string
  items: {
    id: string
    quantity: number
    priceAtTime: string
    product: { id: string; name: string; images: string[] }
  }[]
}

// API wrappers
export interface ApiSuccess<T> {
  success: true
  data: T
  meta?: {
    total: number
    limit: number
    nextCursor?: string
  }
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
