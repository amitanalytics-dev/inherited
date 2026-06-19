import { NextRequest, NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'

const APPROVAL_EMAIL = 'suruchi@inheritedskincare.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://inheritedskincare.com'

export interface EmailDraft {
  token: string
  subject: string
  preheader: string
  htmlBody: string
  scheduleDate: string
  throttlePercent: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

// ── Metafield helpers ────────────────────────────────────────────────────────

async function readDrafts(): Promise<EmailDraft[]> {
  try {
    const data = await adminQuery<{
      shop: { metafield: { value: string } | null }
    }>('{ shop { metafield(namespace: "site", key: "email_drafts") { value } } }')
    const raw = data.shop?.metafield?.value
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

async function writeDrafts(drafts: EmailDraft[]): Promise<void> {
  const shopData = await adminQuery<{ shop: { id: string } }>('{ shop { id } }')
  await adminQuery(
    `mutation SetDrafts($m: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $m) { metafields { id } userErrors { message } }
    }`,
    {
      m: [{
        ownerId: shopData.shop.id,
        namespace: 'site',
        key: 'email_drafts',
        type: 'json',
        value: JSON.stringify(drafts),
      }],
    }
  )
}

// ── Approval email via Resend ────────────────────────────────────────────────

async function sendApprovalEmail(draft: EmailDraft): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set in environment variables')

  const approveUrl = `${SITE_URL}/api/approve-email?token=${draft.token}`
  const rejectUrl  = `${SITE_URL}/api/approve-email?token=${draft.token}&action=reject`
  const bodyPreview = draft.htmlBody.slice(0, 300).replace(/\n/g, ' ')

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body bgcolor="#FAF7F4" style="background:#FAF7F4;margin:0;padding:0;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#FAF7F4" style="background:#FAF7F4">
<tr><td align="center" style="padding:40px 20px">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;max-width:580px;width:100%">
  <tr>
    <td bgcolor="#2D2926" align="center" style="background:#2D2926;padding:24px 40px">
      <p style="margin:0;font-family:Georgia,serif;font-size:18px;color:#C8923A;letter-spacing:0.2em;text-transform:uppercase">Inherited Skincare</p>
    </td>
  </tr>
  <tr>
    <td style="padding:36px 40px 28px;background:#fff">
      <p style="margin:0 0 20px;font-size:15px;color:#2D2926;line-height:1.6">
        Hi Suruchi — a new announcement email is waiting for your approval before it goes out to subscribers.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F4;border:1px solid #E8DDD0;margin:0 0 24px">
        <tr><td style="padding:20px 24px">
          <p style="margin:0 0 6px;font-size:11px;color:#8B7E74;text-transform:uppercase;letter-spacing:0.1em">Subject</p>
          <p style="margin:0 0 16px;font-size:15px;font-weight:bold;color:#2D2926">${draft.subject}</p>
          ${draft.preheader ? `<p style="margin:0 0 6px;font-size:11px;color:#8B7E74;text-transform:uppercase;letter-spacing:0.1em">Preview text</p>
          <p style="margin:0 0 16px;font-size:14px;color:#2D2926">${draft.preheader}</p>` : ''}
          <p style="margin:0 0 6px;font-size:11px;color:#8B7E74;text-transform:uppercase;letter-spacing:0.1em">Body preview</p>
          <p style="margin:0;font-size:14px;color:#2D2926;line-height:1.6">${bodyPreview}${draft.htmlBody.length > 300 ? '…' : ''}</p>
        </td></tr>
      </table>
      <p style="margin:0 0 8px;font-size:13px;color:#8B7E74">
        Scheduled to send on <strong>${draft.scheduleDate}</strong> at 6pm BST at ${draft.throttlePercent}% per hour.
      </p>
      <table cellpadding="0" cellspacing="0" style="margin:28px 0 0">
        <tr>
          <td style="padding-right:12px">
            <a href="${approveUrl}" style="display:inline-block;padding:14px 32px;background:#2D9B6F;color:#fff;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;text-decoration:none;letter-spacing:0.05em;text-transform:uppercase">
              Approve &amp; Schedule
            </a>
          </td>
          <td>
            <a href="${rejectUrl}" style="display:inline-block;padding:14px 32px;background:#fff;color:#8B7E74;font-family:Arial,sans-serif;font-size:13px;text-decoration:none;letter-spacing:0.05em;text-transform:uppercase;border:1px solid #E8DDD0">
              Reject
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td bgcolor="#FAF7F4" align="center" style="background:#FAF7F4;padding:20px 40px;border-top:1px solid #E8DDD0">
      <p style="margin:0;font-size:11px;color:#8B7E74">
        This email was triggered from the Inherited Skincare admin portal.
        If you did not request this, you can safely ignore it.
      </p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Inherited Skincare Admin <approval@inheritedskincare.com>',
      to: [APPROVAL_EMAIL],
      subject: `[Approval needed] ${draft.subject}`,
      html,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend error ${res.status}: ${text}`)
  }
}

// ── Routes ───────────────────────────────────────────────────────────────────

export async function GET() {
  if (!adminConfigured()) {
    return NextResponse.json({ configured: false, drafts: [] })
  }
  const drafts = await readDrafts()
  return NextResponse.json({ configured: true, drafts })
}

export async function POST(req: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json({ success: false, error: 'Shopify admin not configured.' }, { status: 400 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ success: false, error: 'Invalid JSON.' }, { status: 400 })

  const { subject, preheader = '', htmlBody, scheduleDate, throttlePercent = 10 } = body
  if (!subject?.trim() || !htmlBody?.trim() || !scheduleDate) {
    return NextResponse.json({ success: false, error: 'subject, htmlBody, and scheduleDate are required.' }, { status: 400 })
  }

  const draft: EmailDraft = {
    token: crypto.randomUUID(),
    subject: subject.trim(),
    preheader: preheader.trim(),
    htmlBody: htmlBody.trim(),
    scheduleDate,
    throttlePercent,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  try {
    const existing = await readDrafts()
    // Keep only the last 20 drafts to avoid metafield bloat
    const updated = [...existing, draft].slice(-20)
    await writeDrafts(updated)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to save draft'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }

  try {
    await sendApprovalEmail(draft)
  } catch (e: unknown) {
    // Draft is saved — return partial success so the user knows the draft is stored
    const msg = e instanceof Error ? e.message : 'Failed to send approval email'
    return NextResponse.json({
      success: true,
      emailSent: false,
      emailError: msg,
      token: draft.token,
    })
  }

  return NextResponse.json({ success: true, emailSent: true, token: draft.token })
}
