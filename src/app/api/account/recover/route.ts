import { NextResponse } from 'next/server'
import { customerRecover } from '@/lib/customer'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string }
  const email = body.email?.trim()

  if (email) {
    try {
      await customerRecover(email)
    } catch {
      // never reveal whether the email exists
    }
  }

  return NextResponse.json({ success: true })
}
