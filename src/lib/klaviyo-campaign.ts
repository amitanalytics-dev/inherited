// Shared helper for scheduling Klaviyo announcement campaigns.
// Called from both the direct send route and the approval flow.

const KLAVIYO_LIST_ID = 'SvpFav'

export interface CampaignParams {
  subject: string
  preheader: string
  htmlBody: string
  scheduleDate: string
  throttlePercent: number
}

export interface CampaignResult {
  campaignId: string
  templateId: string
  sendAt: string
}

function klaviyoHeaders() {
  const key = process.env.KLAVIYO_PRIVATE_KEY
  if (!key) throw new Error('KLAVIYO_PRIVATE_KEY environment variable is not set')
  return {
    Authorization: `Klaviyo-API-Key ${key}`,
    revision: '2024-10-15',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

async function kFetch(path: string, method: string, body?: unknown) {
  const res = await fetch(`https://a.klaviyo.com/api${path}`, {
    method,
    headers: klaviyoHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Klaviyo ${method} ${path} → ${res.status}: ${text}`)
  return text ? JSON.parse(text) : null
}

export function buildEmailHtml(body: string, preheader: string): string {
  const preview = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#FAF7F4">${preheader}&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;</div>`
    : ''
  const paragraphs = body
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map(
      (b) =>
        `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#2D2926;line-height:1.7">${b.replace(/\n/g, '<br>')}</p>`
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${preview}
</head>
<body bgcolor="#FAF7F4" style="background-color:#FAF7F4;margin:0;padding:0">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#FAF7F4" style="background-color:#FAF7F4">
<tr><td align="center" style="padding:40px 20px">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;max-width:600px;width:100%">
<tr>
  <td bgcolor="#2D2926" align="center" style="background-color:#2D2926;padding:28px 40px">
    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#C8923A;letter-spacing:0.2em;text-transform:uppercase">Inherited Skincare</p>
  </td>
</tr>
<tr>
  <td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:40px 40px 24px">
    ${paragraphs}
  </td>
</tr>
<tr>
  <td bgcolor="#FAF7F4" align="center" style="background-color:#FAF7F4;padding:24px 40px;border-top:1px solid #E8DDD0">
    <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:13px;color:#C8923A;font-style:italic">Ancient Wisdom. Modern Skin.</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8B7E74;line-height:1.6">
      You received this because you subscribed to Inherited Skincare.<br>
      <a href="{{ unsubscribe_url }}" style="color:#C8923A;text-decoration:underline">Unsubscribe</a>
    </p>
  </td>
</tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

const VALID_THROTTLES = [10, 11, 13, 14, 17, 20, 25, 33, 50]

export function buildSendAt(dateStr: string): string {
  return `${dateStr}T17:00:00+00:00`
}

export async function scheduleKlaviyoCampaign(params: CampaignParams): Promise<CampaignResult> {
  const { subject, preheader = '', htmlBody, scheduleDate, throttlePercent } = params
  const throttle = VALID_THROTTLES.includes(throttlePercent) ? throttlePercent : 10
  const sendAt = buildSendAt(scheduleDate)

  // 1. Create email template
  const tmplRes = await kFetch('/email-templates/', 'POST', {
    data: {
      type: 'email-template',
      attributes: {
        name: `Website Announcement — ${subject}`,
        editor_type: 'CODE',
        html: buildEmailHtml(htmlBody, preheader),
        text: htmlBody.replace(/<[^>]+>/g, '').replace(/\n\n+/g, '\n\n'),
      },
    },
  })
  const templateId: string = tmplRes.data.id

  // 2. Create campaign
  const campRes = await kFetch('/campaigns/', 'POST', {
    data: {
      type: 'campaign',
      attributes: {
        name: `Website Announcement — ${subject}`,
        channel: 'email',
        audiences: { included: [KLAVIYO_LIST_ID], excluded: [] },
        send_strategy: {
          method: 'throttled',
          options_throttled: { throttle_percentage: throttle, datetime: sendAt },
        },
        tracking_options: { is_tracking_clicks: true, is_tracking_opens: true },
      },
    },
  })
  const campaignId: string = campRes.data.id
  const campaignMessageId: string =
    campRes.data.relationships?.['campaign-messages']?.data?.[0]?.id

  if (!campaignMessageId) throw new Error('Campaign created but no message ID returned')

  // 3. Assign template + set from details
  await kFetch(`/campaign-messages/${campaignMessageId}/`, 'PATCH', {
    data: {
      type: 'campaign-message',
      id: campaignMessageId,
      attributes: {
        label: subject,
        channel: 'email',
        content: {
          subject,
          preview_text: preheader,
          from_email: 'suruchi@inheritedskincare.com',
          from_label: 'Suruchi at Inherited Skincare',
          reply_to_email: 'suruchi@inheritedskincare.com',
        },
      },
      relationships: {
        template: { data: { type: 'email-template', id: templateId } },
      },
    },
  })

  // 4. Schedule
  await kFetch('/campaign-send-jobs/', 'POST', {
    data: {
      type: 'campaign-send-job',
      attributes: { action: 'schedule' },
      relationships: {
        campaign: { data: { type: 'campaign', id: campaignId } },
      },
    },
  })

  return { campaignId, templateId, sendAt }
}
