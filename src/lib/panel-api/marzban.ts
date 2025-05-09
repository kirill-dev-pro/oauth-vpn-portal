import type { User } from 'better-auth'
import { type Config, MarzbanSDK, type UserCreate, type UserResponse } from 'marzban-sdk'
import { env } from '../env'
import { gbToBytes } from '../utils'
import { EXPIRE_NEVER, PANNEL_USER_ID_PREFIX } from './defaults'

export type MarzbanPanelUser = UserResponse

const DEFAULT_PROXY = {
  vless: {
    flow: '',
  },
  shadowsocks: {
    method: 'chacha20-ietf-poly1305',
  },
}

export class MarzbanAPI {
  private marzban: MarzbanSDK

  constructor(config: Config) {
    this.marzban = new MarzbanSDK(config)
  }

  async createNewPanelUser(webSiteUser: User): Promise<MarzbanPanelUser> {
    const inbounds = await this.loadInstanceInbounds()

    const params: UserCreate = {
      username: PANNEL_USER_ID_PREFIX + webSiteUser.id,
      note: `User by oauth-vpn-portal, oauth details: ${JSON.stringify(webSiteUser)}`,
      data_limit: env.PANEL_USER_TRAFFIC_LIMIT_GB
        ? gbToBytes(env.PANEL_USER_TRAFFIC_LIMIT_GB)
        : undefined,
      data_limit_reset_strategy: 'month',
      expire: Number(EXPIRE_NEVER),
      inbounds: inbounds.reduce(
        (acc, inbound) => {
          if (!inbound.type || !inbound.tag) {
            return acc
          }
          if (!acc[inbound.type]) {
            acc[inbound.type] = []
          }
          acc[inbound.type].push(inbound.tag)
          return acc
        },
        {} as Record<string, string[]>,
      ),
      proxies: DEFAULT_PROXY,
    }

    return await this.marzban.user.addUser(params)
  }

  async getOrCreatePanelUser(webSiteUser: User): Promise<MarzbanPanelUser> {
    let user = await this.getPanelUser(webSiteUser)
    if (!user) {
      user = await this.createNewPanelUser(webSiteUser)
    }
    return user
  }

  async getPanelUser(webSiteUser: User): Promise<MarzbanPanelUser | null> {
    try {
      const user = await this.marzban.user.getUser(PANNEL_USER_ID_PREFIX + webSiteUser.id)
      return user
    } catch (error) {
      return null
    }
  }

  async deletePanelUser(webSiteUser: User): Promise<void> {
    await this.marzban.user.removeUser(PANNEL_USER_ID_PREFIX + webSiteUser.id)
  }

  async loadInstanceInbounds() {
    const marzbanResponse = await this.marzban.system.getInbounds()
    const arrayOfInbouds = Object.entries(Object.values(marzbanResponse).flat()).map(
      ([type, inbound]) => ({
        ...inbound,
        type,
        port: Number(inbound.port),
      }),
    )

    return arrayOfInbouds
  }
}
