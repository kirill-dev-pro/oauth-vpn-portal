import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from './auth'

export const getSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    return session
  } catch (error) {
    return null
  }
}

export const getSessionOrRedirect = async () => {
  const session = await getSession()
  if (!session) {
    redirect('/')
  }
  return session
}
