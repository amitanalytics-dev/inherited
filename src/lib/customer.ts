import { storefront } from './shopify'

export interface CustomerOrder {
  orderNumber: number
  processedAt: string
  financialStatus: string | null
  fulfillmentStatus: string | null
  currentTotalPrice: { amount: string; currencyCode: string }
  lineItems: { edges: { node: { title: string; quantity: number } }[] }
}

export interface CustomerAddress {
  address1: string | null
  address2: string | null
  city: string | null
  province: string | null
  country: string | null
  zip: string | null
}

export interface Customer {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  phone: string | null
  defaultAddress: CustomerAddress | null
  orders: { edges: { node: CustomerOrder }[] }
  addresses: { edges: { node: CustomerAddress }[] }
}

interface UserError {
  field: string[] | null
  message: string
}

export async function customerAccessTokenCreate(
  email: string,
  password: string
): Promise<{ token: string | null; expiresAt: string | null; errors: UserError[] }> {
  const mutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { field message }
      }
    }
  `
  const data = await storefront<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null
      customerUserErrors: UserError[]
    }
  }>(mutation, { input: { email, password } }, { noStore: true })
  const result = data.customerAccessTokenCreate
  return {
    token: result.customerAccessToken?.accessToken ?? null,
    expiresAt: result.customerAccessToken?.expiresAt ?? null,
    errors: result.customerUserErrors,
  }
}

export async function customerCreate(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<{ errors: UserError[] }> {
  const mutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id }
        customerUserErrors { field message }
      }
    }
  `
  const data = await storefront<{
    customerCreate: {
      customer: { id: string } | null
      customerUserErrors: UserError[]
    }
  }>(mutation, { input: { firstName, lastName, email, password } }, { noStore: true })
  return { errors: data.customerCreate.customerUserErrors }
}

export async function customerAccessTokenDelete(
  token: string
): Promise<{ errors: { field: string[] | null; message: string }[] }> {
  const mutation = `
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        userErrors { field message }
      }
    }
  `
  const data = await storefront<{
    customerAccessTokenDelete: {
      deletedAccessToken: string | null
      userErrors: { field: string[] | null; message: string }[]
    }
  }>(mutation, { customerAccessToken: token }, { noStore: true })
  return { errors: data.customerAccessTokenDelete.userErrors }
}

export async function customerRecover(
  email: string
): Promise<{ errors: UserError[] }> {
  const mutation = `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors { field message }
      }
    }
  `
  const data = await storefront<{
    customerRecover: { customerUserErrors: UserError[] }
  }>(mutation, { email }, { noStore: true })
  return { errors: data.customerRecover.customerUserErrors }
}

export async function getCustomer(token: string): Promise<Customer | null> {
  const query = `
    query getCustomer($token: String!) {
      customer(customerAccessToken: $token) {
        id
        firstName
        lastName
        email
        phone
        defaultAddress {
          address1
          address2
          city
          province
          country
          zip
        }
        orders(first: 25, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              currentTotalPrice { amount currencyCode }
              lineItems(first: 10) {
                edges { node { title quantity } }
              }
            }
          }
        }
        addresses(first: 10) {
          edges {
            node {
              address1
              address2
              city
              province
              country
              zip
            }
          }
        }
      }
    }
  `
  const data = await storefront<{ customer: Customer | null }>(query, { token }, { noStore: true })
  return data.customer
}
