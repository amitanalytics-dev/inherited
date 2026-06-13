import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { customerAccessTokenDelete } from '@/lib/customer'

export const dynamic = 'force-dynamic'

export async function POST() {
  const store = cookies()
  const token = store.get('customer_token')?.value

  if (token) {
    try {
      await customerAccessTokenDelete(token)
    } catch {
      // token may already be invalid; clearing the cookie is enough
    }
  }

  store.delete('customer_token')
  return NextResponse.json({ success: true })
}
