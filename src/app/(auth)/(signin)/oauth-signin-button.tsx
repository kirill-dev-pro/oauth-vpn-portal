'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { env } from '@/lib/env'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export function OauthSignInButton({ autoSignIn }: { autoSignIn?: boolean }) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const [isLoading, setIsLoading] = useState(false)

  const signIn = useCallback(() => {
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
  }, [callbackUrl])

  useEffect(() => {
    if (autoSignIn) {
      signIn()
    }
  }, [autoSignIn, signIn])

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={signIn}
      isLoading={isLoading}
    >
      <Icons.oauth className="mr-2 h-4 w-4" />
      {env.NEXT_PUBLIC_LOGIN_BUTTON_TEXT}
    </Button>
  )
}
