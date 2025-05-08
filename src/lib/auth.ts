import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { genericOAuth } from 'better-auth/plugins/generic-oauth'
import Database from 'better-sqlite3'
import { Pool } from 'pg'
import { env } from './env'

export const auth = betterAuth({
  database: env.DATABASE_URL
    ? new Pool({ connectionString: env.DATABASE_URL })
    : new Database('auth-db.sqlite'),
  updateAccountOnSignIn: true,
  user: {
    deleteUser: {
      enabled: true,
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
