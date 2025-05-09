import { env } from '@/lib/env'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { OauthSignInButton } from './oauth-signin-button'

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_PAGE_TITLE,
}

export default function SignInViewPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none ">
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{env.NEXT_PUBLIC_PAGE_TITLE}</h1>
          </div>
          <Suspense fallback={<div className="w-full h-10 bg-gray-200" />}>
            <OauthSignInButton autoSignIn />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
