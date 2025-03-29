import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from './lib/session'

const PROTECTED_ROUTES = ['/vpn', '/dashboard']

export async function middleware(request: NextRequest) {
  const session = await getSession()

  const isAuthenticated = !!session

  if (!isAuthenticated && PROTECTED_ROUTES.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  runtime: 'nodejs',
  // matcher: ['/dashboard/:path*', '*'], // Apply middleware to specific routes
}
