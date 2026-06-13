import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCustomer, type CustomerOrder, type CustomerAddress } from '@/lib/customer'
import LogoutButton from './LogoutButton'

export const dynamic = 'force-dynamic'

function formatMoney(amount: string, currencyCode: string) {
  const value = Number(amount)
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currencyCode,
    }).format(value)
  } catch {
    return `${value.toFixed(2)} ${currencyCode}`
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-block font-body text-[10px] tracking-widest uppercase px-2.5 py-1 bg-brand-warm text-brand-dark border border-brand-warm">
      {label.replace(/_/g, ' ')}
    </span>
  )
}

function AddressBlock({ address }: { address: CustomerAddress }) {
  const lines = [
    address.address1,
    address.address2,
    [address.city, address.province].filter(Boolean).join(', '),
    address.zip,
    address.country,
  ].filter((l) => l && l.trim().length > 0)
  return (
    <div className="bg-white border border-brand-warm p-5">
      <address className="not-italic font-body text-sm text-brand-dark leading-relaxed">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </address>
    </div>
  )
}

export default async function AccountPage() {
  const token = cookies().get('customer_token')?.value
  if (!token) redirect('/account/login')

  const customer = await getCustomer(token)
  if (!customer) redirect('/account/login')

  const orders: CustomerOrder[] = customer.orders.edges.map((e) => e.node)
  const addresses: CustomerAddress[] = customer.addresses.edges.map((e) => e.node)
  const greetingName = customer.firstName || 'there'

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      <div className="bg-brand-warm border-b border-brand-warm/80 py-10 md:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">
                Your Account
              </p>
              <h1 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark">
                Hello, {greetingName}
              </h1>
              {customer.email && (
                <p className="font-body text-sm text-brand-muted mt-2">
                  {customer.email}
                </p>
              )}
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 space-y-12">
        <section>
          <h2 className="font-display font-semibold text-2xl md:text-3xl text-brand-dark mb-6">
            Order History
          </h2>
          {orders.length === 0 ? (
            <div className="bg-white border border-brand-warm p-8 text-center">
              <p className="font-body text-sm text-brand-muted mb-5">
                You haven&rsquo;t placed any orders yet. Your ritual awaits.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-10 py-4 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors"
              >
                Shop the Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="bg-white border border-brand-warm p-5 md:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div>
                      <p className="font-display font-semibold text-lg text-brand-dark">
                        Order #{order.orderNumber}
                      </p>
                      <p className="font-body text-xs text-brand-muted mt-0.5">
                        {formatDate(order.processedAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {order.financialStatus && (
                        <StatusBadge label={order.financialStatus} />
                      )}
                      {order.fulfillmentStatus && (
                        <StatusBadge label={order.fulfillmentStatus} />
                      )}
                    </div>
                  </div>
                  <ul className="font-body text-sm text-brand-dark space-y-1 border-t border-brand-warm pt-4">
                    {order.lineItems.edges.map((li, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{li.node.title}</span>
                        <span className="text-brand-muted">× {li.node.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center border-t border-brand-warm pt-4 mt-4">
                    <span className="font-body text-xs tracking-widest uppercase text-brand-muted">
                      Total
                    </span>
                    <span className="font-display font-semibold text-lg text-brand-dark">
                      {formatMoney(
                        order.currentTotalPrice.amount,
                        order.currentTotalPrice.currencyCode
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-display font-semibold text-2xl md:text-3xl text-brand-dark mb-6">
            Saved Addresses
          </h2>
          {addresses.length === 0 ? (
            <p className="font-body text-sm text-brand-muted">
              No saved addresses yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {addresses.map((address, i) => (
                <AddressBlock key={i} address={address} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
