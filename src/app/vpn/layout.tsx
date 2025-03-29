import SmallHeader from '@/app/vpn/small-header'
import { env } from '@/lib/env'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_PAGE_TITLE,
  description: 'Information about your VPN subscription',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SmallHeader title={env.NEXT_PUBLIC_PAGE_TITLE} />
      {children}
    </>
  )
}
