import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { customerAccessTokenCreate } from '@/lib/customer'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string }
  const email = body.email?.trim()
  const password = body.password

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: 'Please enter your email and password.' },
      { status: 400 }
    )
  }

  try {
    const { token, expiresAt, errors } = await customerAccessTokenCreate(email, password)
    if (!token) {
      const message =
        errors[0]?.message || 'Incorrect email or password. Please try again.'
      return NextResponse.json({ success: false, error: message }, { status: 401 })
    }

    cookies().set('customer_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      ...(expiresAt ? { expires: new Date(expiresAt) } : {}),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
