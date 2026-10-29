import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/checkout', '/orders', '/dashboard']
const AUTH_PATHS = ['/login', '/register']
const ADMIN_PATHS = ['/dashboard']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('access_token')?.value

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p))

  // Redirect unauthenticated users away from protected pages
  if (isProtected && !accessToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Admin path — role check happens server-side in the page/action,
  // middleware only checks token presence as a first gate.
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p)) && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
}
