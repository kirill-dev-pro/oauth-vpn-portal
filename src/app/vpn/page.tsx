import { SubViewComponent } from '@/components/RemnawaveSubscriptionView'
import { env } from '@/lib/env'
import { RemnawaveAPI } from '@/lib/panel-api/remnawave'
import { getSessionOrRedirect } from '@/lib/session'
import { MantineProvider } from '@mantine/core'

export default async function VpnPage() {
  const { user } = await getSessionOrRedirect()

  if (env.PANEL_TYPE === 'remnawave') {
    if (!env.REMNAWAVE_API_KEY || !env.PANEL_API_URL) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">Remnawave is not configured</h1>
          <p className="text-sm text-gray-500">
            Please specify REMNAWAVE_API_KEY and PANEL_API_URL in .env
          </p>
        </div>
      )
    }
    const remnawaveAPI = new RemnawaveAPI(env.PANEL_API_URL, env.REMNAWAVE_API_KEY)

    const panelUser = await remnawaveAPI.getOrCreatePanelUser(user)
    await remnawaveAPI.updatePanelUser(user)

    return (
      <div className="w-full flex justify-center items-center">
        <MantineProvider defaultColorScheme="auto">
          <SubViewComponent subscription={panelUser} user={user} />
        </MantineProvider>
      </div>
    )
  }
}
