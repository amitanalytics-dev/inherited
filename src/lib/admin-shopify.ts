// Server-only helper for the Shopify Admin GraphQL API.
//
// Auth: Shopify Dev Dashboard apps issue 24-hour Admin tokens via the OAuth
// client-credentials grant, so we exchange SHOPIFY_CLIENT_ID +
// SHOPIFY_CLIENT_SECRET for a token and cache it in module scope, refreshing
// shortly before expiry. A static SHOPIFY_ADMIN_TOKEN env var (if set) takes
// precedence. Callers must check adminConfigured() first.

const STORE = 'leela-skincare.myshopify.com'
const ADMIN_ENDPOINT = `https://${STORE}/admin/api/2024-10/graphql.json`
const TOKEN_ENDPOINT = `https://${STORE}/admin/oauth/access_token`

function env(name: string): string | undefined {
  // strip BOM/whitespace that env tooling can introduce around values
  return process.env[name]?.replace(/^﻿/, '').trim() || undefined
}

export function adminConfigured(): boolean {
  return Boolean(
    env('SHOPIFY_ADMIN_TOKEN') ||
      (env('SHOPIFY_CLIENT_ID') && env('SHOPIFY_CLIENT_SECRET'))
  )
}

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getAdminToken(): Promise<string> {
  const staticToken = env('SHOPIFY_ADMIN_TOKEN')
  if (staticToken) return staticToken

  // refresh 5 minutes before expiry
  if (cachedToken && Date.now() < cachedToken.expiresAt - 5 * 60 * 1000) {
    return cachedToken.token
  }

  const clientId = env('SHOPIFY_CLIENT_ID')
  const clientSecret = env('SHOPIFY_CLIENT_SECRET')
  if (!clientId || !clientSecret) {
    throw new Error('Shopify admin credentials are not configured')
  }

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Shopify token exchange failed: ${res.status}`)
  }

  const json = await res.json()
  if (!json.access_token) {
    throw new Error('Shopify token exchange returned no access_token')
  }

  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 86400) * 1000,
  }
  return cachedToken.token
}

export async function adminQuery<T = any>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const token = await getAdminToken()

  const res = await fetch(ADMIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Shopify Admin API error: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  if (json.errors?.length) {
    throw new Error(`Shopify Admin GraphQL error: ${JSON.stringify(json.errors)}`)
  }

  return json.data as T
}
