const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!
const apiVersion = '2024-10'

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`

export interface ShopifyResponse<T> {
  data: T
  errors?: { message: string }[]
}

export async function storefront<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
  }

  const json: ShopifyResponse<T> = await response.json()

  if (json.errors && json.errors.length > 0) {
    throw new Error(`Shopify GraphQL error: ${json.errors.map((e) => e.message).join(', ')}`)
  }

  return json.data
}

// Cart mutations
export async function cartCreate(lines: { merchandiseId: string; quantity: number }[]) {
  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 20) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  interface CartCreateData {
    cartCreate: {
      cart: {
        id: string
        checkoutUrl: string
        lines: {
          edges: {
            node: {
              id: string
              quantity: number
              merchandise: {
                id: string
                title: string
                price: { amount: string; currencyCode: string }
                product: {
                  title: string
                  handle: string
                  images: { edges: { node: { url: string; altText: string | null } }[] }
                }
              }
            }
          }[]
        }
        cost: { totalAmount: { amount: string; currencyCode: string } }
      }
      userErrors: { field: string[]; message: string }[]
    }
  }

  const data = await storefront<CartCreateData>(mutation, {
    input: { lines },
  })
  return data.cartCreate
}

export async function cartLinesAdd(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
) {
  const mutation = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 20) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  interface CartLinesAddData {
    cartLinesAdd: {
      cart: {
        id: string
        checkoutUrl: string
      }
      userErrors: { field: string[]; message: string }[]
    }
  }

  const data = await storefront<CartLinesAddData>(mutation, { cartId, lines })
  return data.cartLinesAdd
}
