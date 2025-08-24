import {
  CreateUserCommand,
  DeleteUserCommand,
  GetAllInboundsCommand,
  GetInternalSquadsCommand,
  GetSubscriptionInfoByShortUuidCommand,
  GetUserByUsernameCommand,
  UpdateUserCommand,
} from '@remnawave/backend-contract'
import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'
import type { User } from 'better-auth'
import { env } from '../env'
import { gbToBytes } from '../utils'
import { EXPIRE_NEVER, PANNEL_USER_ID_PREFIX } from './defaults'

const formatUsername = (username: string) => {
  return (PANNEL_USER_ID_PREFIX + username).substring(0, 32) // 32 is the max length of the username for Remnawave
}

export type RemnawavePanelUser = GetSubscriptionInfoByShortUuidCommand.Response['response']

export class RemnawaveAPI {
  private client: AxiosInstance

  constructor(baseUrl: string, apiKey: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
  }

  async createNewPanelUser(webSiteUser: User) {
    // const inbounds = await this.loadInstanceInbounds()
    // const activeInbounds = inbounds.map((inbound) => inbound.uuid).filter(Boolean)
    // const activeInternalSquads = inbounds.map((inbound) => inbound.uuid).filter(Boolean)
    const {internalSquads} = await loadInternalSquads(this.client)

    const username = formatUsername(webSiteUser.id)

    const data: CreateUserCommand.Request = {
      username,
      trafficLimitStrategy: 'MONTH',
      status: 'ACTIVE',
      expireAt: EXPIRE_NEVER,
      description: `User by oauth-vpn-portal, oauth details: ${JSON.stringify(webSiteUser)}`,
      trafficLimitBytes: env.PANEL_USER_TRAFFIC_LIMIT_GB
        ? gbToBytes(env.PANEL_USER_TRAFFIC_LIMIT_GB)
        : undefined,

      // this should be array of uuid's
      activeInternalSquads: internalSquads.map((squad) => squad.uuid),
      email: webSiteUser.email,
    }
    try {
      const response = await this.client<
        CreateUserCommand.Response,
        AxiosResponse<CreateUserCommand.Response>,
        CreateUserCommand.Request
      >({
        url: CreateUserCommand.url,
        method: CreateUserCommand.endpointDetails.REQUEST_METHOD,
        data,
      })

      return response.data.response
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string; errors?: { message: string }[] }>
      if (!axiosError.response) {
        throw error
      }
      // console.log('Axios error', axiosError.response.data)
      const { message, errors } = axiosError.response.data
      const errorMessage = `Failed to create user: ${message}. Errors: ${errors?.map((e) => e.message).join(', ')}`
      throw new Error(errorMessage, { cause: axiosError.response.data })
    }
  }

  async getPanelUser(webSiteUser: User) {
    try {
      const username = formatUsername(webSiteUser.id)
      const response = await this.client<
        GetUserByUsernameCommand.Response,
        AxiosResponse<GetUserByUsernameCommand.Response>,
        GetUserByUsernameCommand.Request
      >({
        url: GetUserByUsernameCommand.url(username),
        method: GetUserByUsernameCommand.endpointDetails.REQUEST_METHOD,
      })
      return response.data.response
    } catch (error) {
      console.log('Error getting user', error)
      return null
    }
  }

  async getOrCreatePanelUser(webSiteUser: User): Promise<RemnawavePanelUser> {
    let panelUser = await this.getPanelUser(webSiteUser)

    if (!panelUser) {
      panelUser = await this.createNewPanelUser(webSiteUser)
    }

    const subscription = await this.client<
      GetSubscriptionInfoByShortUuidCommand.Response,
      AxiosResponse<GetSubscriptionInfoByShortUuidCommand.Response>,
      GetSubscriptionInfoByShortUuidCommand.Request
    >({
      url: GetSubscriptionInfoByShortUuidCommand.url(panelUser.shortUuid),
      method: GetSubscriptionInfoByShortUuidCommand.endpointDetails.REQUEST_METHOD,
    })

    return subscription.data.response
  }

  /**
   * This updates the user's traffic limit
   * @param uuid - The user's uuid
   */
  async updatePanelUser(webSiteUser: User) {
    const user = await this.getPanelUser(webSiteUser)
    if (!user) {
      throw new Error('User not found')
    }

    await this.client<
      UpdateUserCommand.Response,
      AxiosResponse<UpdateUserCommand.Response>,
      UpdateUserCommand.Request
    >({
      url: UpdateUserCommand.url,
      method: UpdateUserCommand.endpointDetails.REQUEST_METHOD,
      data: {
        uuid: user.uuid,
        trafficLimitBytes: env.PANEL_USER_TRAFFIC_LIMIT_GB
          ? gbToBytes(env.PANEL_USER_TRAFFIC_LIMIT_GB)
          : undefined,
      },
    })
  }

  async deletePanelUser(webSiteUser: User): Promise<void> {
    await this.client<
      DeleteUserCommand.Response,
      AxiosResponse<DeleteUserCommand.Response>,
      DeleteUserCommand.Request
    >({
      url: DeleteUserCommand.url(PANNEL_USER_ID_PREFIX + webSiteUser.id),
      method: 'delete',
    })
  }

  async loadInstanceInbounds() {
    try {
      const { data } = await this.client<
        GetAllInboundsCommand.Response,
        AxiosResponse<GetAllInboundsCommand.Response>
      >({
        url: GetAllInboundsCommand.url,
        method: GetAllInboundsCommand.endpointDetails.REQUEST_METHOD,
      })

      return data.response
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new Error('404 Axios Error, check your API key and URL')
        }
      }
      throw error
    }
  }
}


const loadInternalSquads = async (client: AxiosInstance): Promise<GetInternalSquadsCommand.Response['response']> => {
  const { data } = await client<
    GetInternalSquadsCommand.Response,
    AxiosResponse<GetInternalSquadsCommand.Response>
  >({
    url: GetInternalSquadsCommand.url,
    method: GetInternalSquadsCommand.endpointDetails.REQUEST_METHOD,
  })

  return data.response
}