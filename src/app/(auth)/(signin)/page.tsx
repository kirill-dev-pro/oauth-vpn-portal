import type { Metadata } from 'next'
import { OauthSignInButton } from './oauth-signin-button'

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.',
}

export default function SignInViewPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none ">
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login to your VPN</h1>
            <p className="text-muted-foreground text-sm">Use button bellow to sign in with OAuth</p>
          </div>
          <OauthSignInButton />
        </div>
      </div>
    </div>
  )
}
