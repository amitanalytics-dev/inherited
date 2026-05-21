import type { Metadata } from 'next'
import './globals.css'
import ConvexClientProvider from './ConvexClientProvider'

export const metadata: Metadata = {
  title: 'Inherited Skincare — Founder Intelligence Brief',
  description: 'Founder response form for the Inherited Skincare Intelligence Brief prepared by Aletheia AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
