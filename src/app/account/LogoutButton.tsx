'use client'

import { useState } from 'react'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)

  async function logout() {
    setLoading(true)
    try {
      await fetch('/api/account/logout', { method: 'POST' })
    } catch {
      // proceed to redirect regardless
    }
    window.location.href = '/'
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="inline-flex items-center justify-center px-6 py-3 border border-brand-warm bg-white text-brand-dark font-body text-xs tracking-widest uppercase hover:border-brand-amber hover:text-brand-amber transition-colors disabled:opacity-60"
    >
      {loading ? 'Logging out…' : 'Log Out'}
    </button>
  )
}
