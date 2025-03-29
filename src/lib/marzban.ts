import type { User } from 'better-auth'
import { type Config, MarzbanSDK, type UserCreate } from 'marzban-sdk'
import { env } from './env'
import { getMarzbanInstanceInbounds } from './marzban-instance-config'

const PANNEL_USER_ID_PREFIX = 'prefix-'
const DEFAULT_DATA_LIMIT = 1024 * 1024 * 1024 * 10 // 10GB

const DEFAULT_PROXY = {
  vless: {
    flow: '',
  },
  shadowsocks: {
    method: 'chacha20-ietf-poly1305',
  },
}

const config: Config = {
  baseUrl: env.MARZBAN_API_URL,
  username: env.MARZBAN_USERNAME,
  password: env.MARZBAN_PASSWORD,
}

export const marzban = new MarzbanSDK(config)

const createNewSubscription = async (webSiteUser: User) => {
  const inbounds = await getMarzbanInstanceInbounds()

  const params: UserCreate = {
    username: PANNEL_USER_ID_PREFIX + webSiteUser.id,
    note: `User created by OAuth integration\n User ${webSiteUser.name} (${webSiteUser.email})`,
    data_limit: DEFAULT_DATA_LIMIT,
    data_limit_reset_strategy: 'month',
    inbounds: env.MARZBAN_USER_INBOUNDS ?? inbounds,
    proxies: DEFAULT_PROXY,
  }

  console.log('params', params)

  return await marzban.user.addUser(params)
}

export const getOrCreateSubscription = async (webSiteUser: User) => {
  let user = await getSubscription(webSiteUser)
  console.log('user', user)
  if (!user) {
    user = await createNewSubscription(webSiteUser)
  }
  return user
}

export const getSubscription = async (webSiteUser: User) => {
  try {
    const user = await marzban.user.getUser(PANNEL_USER_ID_PREFIX + webSiteUser.id)
    return user
  } catch (error) {
    return null
  }
}

export const deleteSubscription = async (webSiteUser: User) => {
  await marzban.user.removeUser(PANNEL_USER_ID_PREFIX + webSiteUser.id)
}
