import { NextRequest, NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'
import { scheduleKlaviyoCampaign } from '@/lib/klaviyo-campaign'
import type { EmailDraft } from '@/app/api/admin/email-drafts/route'

export const dynamic = 'force-dynamic'

// This endpoint is intentionally NOT behind Basic Auth — the token in the URL
// is the authentication. Suruchi clicks the link from her email inbox.

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

function html(title: string, emoji: string, heading: string, body: string, color: string) {
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#FAF7F4;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">
  <div style="max-width:480px;width:100%;margin:40px auto;padding:48px 40px;background:#fff;text-align:center;border-top:4px solid ${color}">
    <p style="font-size:48px;margin:0 0 16px">${emoji}</p>
    <h1 style="font-family:Georgia,serif;font-size:26px;color:#2D2926;margin:0 0 16px">${heading}</h1>
    <p style="font-size:15px;color:#8B7E74;line-height:1.6;margin:0 0 28px">${body}</p>
    <a href="https://inheritedskincare.com" style="font-size:12px;color:#C8923A;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase">
      ← inheritedskincare.com
    </a>
  </div>
</body>
</html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  )
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token  = searchParams.get('token')
  const action = searchParams.get('action') ?? 'approve'

  if (!token) {
    return html('Invalid link', '⚠️', 'Invalid link', 'This approval link is missing a token. Please use the link from the approval email.', '#F59E0B')
  }

  if (!adminConfigured()) {
    return html('Configuration error', '⚠️', 'Configuration error', 'Shopify admin credentials are not configured on this server.', '#EF4444')
  }

  const drafts = await readDrafts()
  const idx = drafts.findIndex((d) => d.token === token)

  if (idx === -1) {
    return html('Not found', '🔍', 'Draft not found', 'This link may have already been used or the draft was removed.', '#F59E0B')
  }

  const draft = drafts[idx]

  if (draft.status !== 'pending') {
    const label = draft.status === 'approved' ? 'already approved' : 'already rejected'
    return html(
      'Already actioned',
      draft.status === 'approved' ? '✅' : '🚫',
      `Email ${label}`,
      `This announcement email was ${label}. No further action is needed.`,
      draft.status === 'approved' ? '#2D9B6F' : '#EF4444'
    )
  }

  if (action === 'reject') {
    drafts[idx] = { ...draft, status: 'rejected' }
    await writeDrafts(drafts)
    return html(
      'Rejected',
      '🚫',
      'Email rejected',
      `The announcement email "<strong>${draft.subject}</strong>" has been rejected and will not be sent.`,
      '#EF4444'
    )
  }

  // Approve: schedule the Klaviyo campaign
  try {
    await scheduleKlaviyoCampaign({
      subject: draft.subject,
      preheader: draft.preheader,
      htmlBody: draft.htmlBody,
      scheduleDate: draft.scheduleDate,
      throttlePercent: draft.throttlePercent,
    })
    drafts[idx] = { ...draft, status: 'approved' }
    await writeDrafts(drafts)

    const sendDate = new Date(`${draft.scheduleDate}T17:00:00Z`).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

    return html(
      'Approved',
      '✅',
      'Email approved & scheduled!',
      `The announcement email "<strong>${draft.subject}</strong>" has been scheduled to send on <strong>${sendDate} at 6pm BST</strong> at ${draft.throttlePercent}% per hour.`,
      '#2D9B6F'
    )
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return html('Error', '⚠️', 'Could not schedule email', `Klaviyo returned an error: ${msg}`, '#EF4444')
  }
}
