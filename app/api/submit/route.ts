import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function formatResponses(data: Record<string, unknown>): string {
  const sections: string[] = []

  // Assumptions
  sections.push('━━━ SECTION 1: DATA ASSUMPTIONS ━━━\n')
  for (let i = 1; i <= 10; i++) {
    const key = `a${i}` as string
    const notesKey = `a${i}_notes` as string
    const verdict = data[key] || '— not answered'
    const notes = data[notesKey] ? `\n   Notes: ${data[notesKey]}` : ''
    sections.push(`A${i}: ${verdict}${notes}`)
  }

  // Unit Economics
  sections.push('\n━━━ SECTION 5: UNIT ECONOMICS ━━━\n')
  const s5 = [
    { key: 's5q1', label: 'Q1 — COGS per unit' },
    { key: 's5q2', label: 'Q2 — Shipping costs' },
    { key: 's5q3', label: 'Q3 — Free shipping subsidy' },
    { key: 's5q4', label: 'Q4 — Contribution margin' },
    { key: 's5q5', label: 'Q5 — Supplier MOQs' },
    { key: 's5q5_notes', label: '   MOQ notes' },
    { key: 's5q6', label: 'Q6 — Retail prices' },
    { key: 's5q7', label: 'Q7 — Jivita pricing' },
  ]
  for (const { key, label } of s5) {
    if (data[key]) sections.push(`${label}: ${data[key]}`)
  }

  // Operations
  sections.push('\n━━━ SECTION 6: OPERATIONS & FULFILMENT ━━━\n')
  const s6 = [
    { key: 's6q1', label: 'Q1 — Packing team' },
    { key: 's6q1_notes', label: '   Max capacity notes' },
    { key: 's6q2', label: 'Q2 — Courier' },
    { key: 's6q2_notes', label: '   Transit time notes' },
    { key: 's6q3', label: 'Q3 — Batch manufacturing' },
    { key: 's6q3_notes', label: '   Batch details' },
    { key: 's6q4', label: 'Q4 — Inventory system' },
    { key: 's6q4_notes', label: '   Stock levels' },
    { key: 's6q5', label: 'Q5 — ESP' },
    { key: 's6q5_notes', label: '   Active flows' },
    { key: 's6q6', label: 'Q6 — Subscription app' },
  ]
  for (const { key, label } of s6) {
    if (data[key]) sections.push(`${label}: ${data[key]}`)
  }

  // Customers
  sections.push('\n━━━ SECTION 7: CUSTOMERS & CHANNELS ━━━\n')
  const s7 = [
    { key: 's7q1', label: 'Q1 — Source 3890849' },
    { key: 's7q1_notes', label: '   Source notes' },
    { key: 's7q2', label: 'Q2 — Primary acquisition channel' },
    { key: 's7q2_notes', label: '   Channel notes' },
    { key: 's7q3', label: 'Q3 — GLOW10 locations' },
    { key: 's7q3_notes', label: '   GLOW10 notes' },
    { key: 's7q4', label: 'Q4 — Referral %' },
    { key: 's7q5', label: 'Q5 — Gerald Mousset' },
    { key: 's7q6', label: 'Q6 — Other stockists' },
    { key: 's7q6_notes', label: '   Stockist notes' },
  ]
  for (const { key, label } of s7) {
    if (data[key]) sections.push(`${label}: ${data[key]}`)
  }

  // Product
  sections.push('\n━━━ SECTION 8: PRODUCT & ROADMAP ━━━\n')
  const s8 = [
    { key: 's8q1', label: 'Q1 — DNC larger size' },
    { key: 's8q2', label: 'Q2 — SKUs in development' },
    { key: 's8q2_notes', label: '   New SKU details' },
    { key: 's8q3', label: 'Q3 — Cleansing Balm positioning' },
    { key: 's8q4', label: 'Q4 — Inherited vs Leela relationship' },
    { key: 's8q5', label: 'Q5 — Price tests' },
    { key: 's8q5_notes', label: '   Price test details' },
    { key: 's8q6', label: 'Q6 — Unlisted customer feedback' },
  ]
  for (const { key, label } of s8) {
    if (data[key]) sections.push(`${label}: ${data[key]}`)
  }

  return sections.join('\n')
}

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const data = await req.json()
    const body = formatResponses(data)

    const { error } = await resend.emails.send({
      from: 'Aletheia AI <onboarding@resend.dev>',
      to: 'ir@vestrs.com',
      subject: 'Inherited · Leela Skincare — Founder Responses Received',
      text: `New founder responses submitted via the Inherited Intelligence Brief form.\n\nSubmitted: ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })} IST\n\n${body}\n\n---\nPrepared by Aletheia AI · aletheiaai.in`,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
