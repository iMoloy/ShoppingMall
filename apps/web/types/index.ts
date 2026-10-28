import type { Role } from '@shoppingmall/shared-types'

// Authenticated user shape stored in app state / JWT payload
export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

// For next/navigation searchParams
export type SearchParams = Record<string, string | string[] | undefined>
export type PageParams = Record<string, string | undefined>
