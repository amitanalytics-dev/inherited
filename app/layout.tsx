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
        <p style={{textAlign:'center',fontSize:'12px',color:'#999',padding:'8px 0'}}>Powered by <a href="https://aletheiaai.in" target="_blank" rel="noopener" style={{color:'#FF5722',textDecoration:'none'}}>Aletheiaai.in</a></p>
      </body>
    </html>
  )
}
