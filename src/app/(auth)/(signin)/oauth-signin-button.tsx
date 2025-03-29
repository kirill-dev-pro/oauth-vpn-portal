'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { env } from '@/lib/env'
import { useSearchParams } from 'next/navigation'

export function OauthSignInButton() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        authClient.signIn.oauth2({
          callbackURL: callbackUrl ?? '/vpn',
          providerId: 'oauth',
        })
      }
    >
      <Icons.oauth className="mr-2 h-4 w-4" />
      {env.NEXT_PUBLIC_LOGIN_BUTTON_TEXT}
    </Button>
  )
}
