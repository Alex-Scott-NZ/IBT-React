// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOCALES = ['en', 'fr'] as const
const DEFAULT_LOCALE = 'en'

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Early return for static assets, API routes, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/graphql') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if pathname already has a locale
  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (hasLocale) {
    return NextResponse.next()
  }

  // Immediate redirect with optimized headers
  const newPathname = pathname === '/' ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`
  const response = NextResponse.redirect(new URL(newPathname + search, request.url), {
    // Use 308 for permanent redirect to improve caching
    status: 308
  })

  // Add headers to optimize the redirect
  response.headers.set('Cache-Control', 'public, max-age=3600')
  response.headers.set('Vary', 'Accept-Language')
  
  // Add header to trigger immediate client-side navigation
  response.headers.set('X-Middleware-Prefetch', '1')

  return response
}

export const config = {
  matcher: [
    // Match all paths except those starting with excluded prefixes
    "/((?!api|_next/static|_next/image|favicon.ico|graphql).*)"
  ],
}