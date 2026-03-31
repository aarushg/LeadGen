import { NextResponse, type NextRequest } from 'next/server'

const AUTH_PAGES = new Set(['/login', '/signin', '/signup'])
const PROTECTED_PREFIXES = ['/dashboard', '/proposals', '/research', '/settings']
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'

function isAuthenticated(request: NextRequest): boolean {
  return Boolean(request.cookies.get('access_token')?.value)
}

async function refreshAccessToken(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value
  if (!refreshToken) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as {
      accessToken?: string
      refreshToken?: string
      token?: string
      jwt?: string
    }

    const accessToken = data.accessToken || data.token || data.jwt
    if (!accessToken) {
      return null
    }

    return {
      accessToken,
      refreshToken: data.refreshToken || refreshToken,
    }
  } catch {
    return null
  }
}

function isProtectedPath(pathname: string): boolean {
  if (pathname === '/') return true
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const authenticated = isAuthenticated(request)

  const applyTokens = (
    response: NextResponse,
    tokens: { accessToken: string; refreshToken: string } | null
  ) => {
    if (!tokens) {
      return response
    }

    response.cookies.set('access_token', tokens.accessToken, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 15,
    })
    response.cookies.set('refresh_token', tokens.refreshToken, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })
    return response
  }

  if (isProtectedPath(pathname) && !authenticated) {
    return refreshAccessToken(request).then((tokens) => {
      if (tokens) {
        return applyTokens(NextResponse.next(), tokens)
      }

      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname + search)
      return NextResponse.redirect(loginUrl)
    })
  }

  if (AUTH_PAGES.has(pathname) && authenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (AUTH_PAGES.has(pathname) && !authenticated) {
    return refreshAccessToken(request).then((tokens) => {
      if (!tokens) {
        return NextResponse.next()
      }

      const response = NextResponse.redirect(new URL('/dashboard', request.url))
      return applyTokens(response, tokens)
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
