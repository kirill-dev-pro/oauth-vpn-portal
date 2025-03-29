import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { genericOAuth } from 'better-auth/plugins/generic-oauth'
import { Pool } from 'pg'
import { env } from './env'
import { deleteSubscription, getOrCreateSubscription } from './marzban'

export const auth = betterAuth({
  database: new Pool({
    connectionString: env.DATABASE_URL,
  }),
  emailVerification: {
    enabled: true,
    async sendVerificationEmail(data, request) {
      console.log('new account created', data.user)
      const res = await getOrCreateSubscription(data.user)
      console.log('new subscription added', res)
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      async beforeDelete(user, request) {
        const res = await deleteSubscription(user)
        console.log('deleteSubscription', res)
      },
      // async afterDelete(user, request) {
      //   await deleteSubscription(user)
      // },
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: 'oauth',
          clientId: env.OPENID_CLIENT_ID,
          clientSecret: env.OPENID_CLIENT_SECRET,
          discoveryUrl: env.OPENID_DISCOVERY_URL,
          pkce: true,
          scopes: ['openid', 'email', 'profile'],
          mapProfileToUser: (profile) => {
            return {
              email: profile.email,
              name: profile.name,
              image: profile.picture,
            }
          },
        },
      ],
    }),
    nextCookies(),
  ],
})
