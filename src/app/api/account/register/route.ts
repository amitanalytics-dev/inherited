import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { customerCreate, customerAccessTokenCreate } from '@/lib/customer'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = (await request.json()) as {
    firstName?: string
    lastName?: string
    email?: string
    password?: string
  }
  const firstName = body.firstName?.trim() ?? ''
  const lastName = body.lastName?.trim() ?? ''
  const email = body.email?.trim()
  const password = body.password

  if (!firstName || !email || !password) {
    return NextResponse.json(
      { success: false, error: 'Please fill in your name, email and password.' },
      { status: 400 }
    )
  }

  try {
    const { errors } = await customerCreate(firstName, lastName, email, password)
    if (errors.length > 0) {
      const taken = errors.find((e) => e.message.toLowerCase().includes('taken'))
      const message = taken
        ? 'An account with this email already exists. Please log in instead.'
        : errors[0].message
      return NextResponse.json({ success: false, error: message }, { status: 400 })
    }

    const { token, expiresAt } = await customerAccessTokenCreate(email, password)
    if (token) {
      cookies().set('customer_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        ...(expiresAt ? { expires: new Date(expiresAt) } : {}),
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
