import { Toaster } from '@/components/ui/sonner'
import { env } from '@/lib/env'
import { fontVariables } from '@/lib/font'
import { cn } from '@/lib/utils'
import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import './theme.css'

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b',
}

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_PAGE_TITLE,
  description: 'Information about your VPN subscription',
}

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('bg-background font-sans antialiased', 'theme-amber', fontVariables)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
