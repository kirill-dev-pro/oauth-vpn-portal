import { getSubscription } from '@/lib/marzban'
import { getSessionOrRedirect } from '@/lib/session'

export default async function VpnPage() {
  const { user } = await getSessionOrRedirect()

  const marzbanSubscription = await getSubscription(user)

  if (!marzbanSubscription) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">No subscription found</h1>
      </div>
    )
  }

  return (
    <iframe
      src={`http://localhost:8000${marzbanSubscription.subscription_url}`}
      className="w-full h-screen"
      title="VPN"
    />
  )
}
