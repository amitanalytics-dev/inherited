import { NextRequest, NextResponse } from 'next/server'
import { scheduleKlaviyoCampaign } from '@/lib/klaviyo-campaign'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  let body: {
    subject?: string
    preheader?: string
    htmlBody?: string
    scheduleDate?: string
    throttlePercent?: number
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { subject, preheader = '', htmlBody, scheduleDate, throttlePercent = 10 } = body

  if (!subject?.trim() || !htmlBody?.trim() || !scheduleDate) {
    return NextResponse.json({ error: 'subject, htmlBody, and scheduleDate are required' }, { status: 400 })
  }

  try {
    const result = await scheduleKlaviyoCampaign({ subject, preheader, htmlBody, scheduleDate, throttlePercent })
    return NextResponse.json({ success: true, ...result })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
