import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Choose Your Own Adventure',
  description: 'A fun, AI-powered story generator for kids and adults',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: `'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
          backgroundColor: '#f9f9f9',
          color: '#333',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <main style={{ flex: 1 }}>{children}</main>

        <footer
          style={{
            backgroundColor: '#eaeaea',
            textAlign: 'center',
            padding: '0.5rem',
            fontSize: '0.9rem',
            color: '#555',
          }}
        >
          © {new Date().getFullYear()} absurdical. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
