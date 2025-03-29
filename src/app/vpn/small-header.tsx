'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function Header({ title }: { title: string }) {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/')
            router.refresh()
          },
        },
      })
    } catch (error) {
      toast.error('Something went wrong.')
      console.log(error)
    }
  }
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="flex items-center gap-2 px-4">
        {session && (
          <>
            <div className="items-center gap-2 hidden md:flex">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user?.image ?? ''} alt={session.user?.name ?? ''} />
                <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium">{session.user?.name}</p>
            </div>
            <Button variant="default" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
