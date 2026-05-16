import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Inherited Skincare — Founder Intelligence Brief',
  description: 'Founder response form for the Inherited Skincare Intelligence Brief prepared by Aletheia AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
