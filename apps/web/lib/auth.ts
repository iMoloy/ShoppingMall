import { api, setAccessToken, clearAccessToken } from './api'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@shoppingmall/shared-types'

// Silently refresh the access token using the httpOnly refresh token cookie.
// Called on app boot and before any authenticated request that gets a 401.
export async function refreshAccessToken(): Promise<string | null> {
  const res = await api.post<AuthResponse>('/auth/refresh', undefined, { skipAuth: true })
  if (!res.success) return null
  setAccessToken(res.data.accessToken)
  return res.data.accessToken
}

export async function login(payload: LoginRequest) {
  const res = await api.post<AuthResponse>('/auth/login', payload, { skipAuth: true })
  if (res.success) {
    setAccessToken(res.data.accessToken)
  }
  return res
}

export async function register(payload: RegisterRequest) {
  const res = await api.post<AuthResponse>('/auth/register', payload, { skipAuth: true })
  if (res.success) {
    setAccessToken(res.data.accessToken)
  }
  return res
}

export async function logout() {
  await api.post('/auth/logout')
  clearAccessToken()
}
