'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { env } from '@/lib/env'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'

function OauthSignInButtonComponent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const [isLoading, setIsLoading] = useState(false)

  authClient.signIn.oauth2

  const onClick = () => {
    const toastId = toast.loading('Signing in...')
    setIsLoading(true)
    authClient.signIn.oauth2({
      callbackURL: callbackUrl ?? '/vpn',
      providerId: 'oauth',
      fetchOptions: {
        onSuccess: () => {
          toast.loading('Redirecting...', { id: toastId })
        },
        onError: (error) => {
          setIsLoading(false)
          toast.error('Something went wrong', { id: toastId })
        },
      },
    })
  }

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={onClick}
      isLoading={isLoading}
    >
      <Icons.oauth className="mr-2 h-4 w-4" />
      {env.NEXT_PUBLIC_LOGIN_BUTTON_TEXT}
    </Button>
  )
}

export const OauthSignInButton = () => (
  <Suspense fallback={<div className="w-full h-10 bg-gray-200" />}>
    <OauthSignInButtonComponent />
  </Suspense>
)
