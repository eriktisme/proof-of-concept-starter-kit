import type { Metadata } from 'next'
import './globals.css'
import type { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s`,
  },
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen font-sans antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}
