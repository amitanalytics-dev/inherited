const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const storefrontToken = (process.env.NEXT_PUBLIC_SHOPIFY_SF_TOKEN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN)!
const apiVersion = '2024-10'

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`

export interface ShopifyResponse<T> {
  data: T
  errors?: { message: string }[]
}

export async function storefront<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { noStore?: boolean }
): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    ...(options?.noStore
      ? { cache: 'no-store' as const }
      : { next: { revalidate: 60 } }),
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

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            product {
              title
              handle
              images(first: 1) { edges { node { url altText } } }
            }
          }
        }
      }
    }
  }
  discountCodes { applicable code }
  discountAllocations { discountedAmount { amount currencyCode } }
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
`

export interface CartLineNode {
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

export interface CartData {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: { edges: { node: CartLineNode }[] }
  discountCodes: { applicable: boolean; code: string }[]
  discountAllocations: { discountedAmount: { amount: string; currencyCode: string } }[]
  cost: {
    subtotalAmount: { amount: string; currencyCode: string }
    totalAmount: { amount: string; currencyCode: string }
  }
}

export async function cartGet(cartId: string): Promise<CartData | null> {
  const query = `query cartGet($cartId: ID!) { cart(id: $cartId) { ${CART_FIELDS} } }`
  const data = await storefront<{ cart: CartData | null }>(query, { cartId })
  return data.cart
}

export async function cartLinesUpdate(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<CartData | null> {
  const mutation = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `
  const data = await storefront<{
    cartLinesUpdate: { cart: CartData | null; userErrors: { message: string }[] }
  }>(mutation, { cartId, lines })
  return data.cartLinesUpdate.cart
}

export async function cartLinesRemove(
  cartId: string,
  lineIds: string[]
): Promise<CartData | null> {
  const mutation = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `
  const data = await storefront<{
    cartLinesRemove: { cart: CartData | null; userErrors: { message: string }[] }
  }>(mutation, { cartId, lineIds })
  return data.cartLinesRemove.cart
}

export async function cartDiscountCodesUpdate(
  cartId: string,
  codes: string[]
): Promise<CartData | null> {
  const mutation = `
    mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }
  `
  const data = await storefront<{
    cartDiscountCodesUpdate: { cart: CartData | null; userErrors: { message: string }[] }
  }>(mutation, { cartId, discountCodes: codes })
  return data.cartDiscountCodesUpdate.cart
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
        lines: { edges: { node: { quantity: number } }[] }
      }
      userErrors: { field: string[]; message: string }[]
    }
  }

  const data = await storefront<CartLinesAddData>(mutation, { cartId, lines })
  return data.cartLinesAdd
}
