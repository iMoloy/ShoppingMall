import type { ApiResponse } from '@shoppingmall/shared-types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

// In-memory access token — never touches localStorage
let _accessToken: string | null = null

export function setAccessToken(token: string) {
  _accessToken = token
}

export function clearAccessToken() {
  _accessToken = null
}

export function getAccessToken() {
  return _accessToken
}

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  skipAuth?: boolean
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const { body, skipAuth = false, ...rest } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF guard
    ...(rest.headers as Record<string, string>),
  }

  if (!skipAuth && _accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
    credentials: 'include', // Send httpOnly cookies (refresh token)
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  return data as ApiResponse<T>
}

export const api = {
  get: <T>(path: string, options?: FetchOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: FetchOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
