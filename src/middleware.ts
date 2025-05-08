import { getSessionCookie } from 'better-auth/cookies'
import { type NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/vpn', '/dashboard']

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  const isAuthenticated = !!sessionCookie

  if (!isAuthenticated && PROTECTED_ROUTES.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/vpn/:path*', '/signin'], // Apply middleware to specific routes
}
