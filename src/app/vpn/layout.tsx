import SmallHeader from '@/app/vpn/_components/header'
import { env } from '@/lib/env'
import type { Metadata } from 'next'

// this metadate will never be shown decause of authorization
export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_PAGE_TITLE,
}

export default async function VpnPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SmallHeader />
      {children}
    </>
  )
}
