import { NextRequest, NextResponse } from 'next/server'

const ADMIN_USER = 'suruchi'

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Inherited Admin"' },
  })
}

export function middleware(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (!auth || !auth.startsWith('Basic ')) return unauthorized()

  try {
    const decoded = atob(auth.slice(6))
    const sep = decoded.indexOf(':')
    const user = decoded.slice(0, sep)
    const pass = decoded.slice(sep + 1)
    // strip BOM/whitespace that env tooling can introduce around the value
    const expected = (process.env.ADMIN_PASSWORD ?? 'inherited2026')
      .replace(/^﻿/, '')
      .trim()
    if (user === ADMIN_USER && pass === expected) {
      return NextResponse.next()
    }
  } catch {
    // fall through to 401
  }

  return unauthorized()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
