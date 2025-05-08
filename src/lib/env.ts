import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().optional(),
    OPENID_CLIENT_ID: z.string(),
    OPENID_CLIENT_SECRET: z.string(),
    OPENID_DISCOVERY_URL: z.string(),

    PANEL_API_URL: z.string(),
    PANEL_TYPE: z.literal('marzban').or(z.literal('remnawave')),
    PANEL_USER_TRAFFIC_LIMIT_GB: z.coerce.number().default(0),

    REMNAWAVE_API_KEY: z.string().optional(),

    MARZBAN_USERNAME: z.string().optional(),
    MARZBAN_PASSWORD: z.string().optional(),
    // MARZBAN_USER_INBOUNDS: z
    //   .object({
    //     vmess: z.array(z.string()),
    //     vless: z.array(z.string()),
    //     trojan: z.array(z.string()),
    //     shadowsocks: z.array(z.string()),
    //   })
    //   .optional(),
  },
  client: {
    NEXT_PUBLIC_LOGIN_BUTTON_TEXT: z.string().default('Login with OAuth'),
    NEXT_PUBLIC_MARZBAN_INSTANCE_URL: z.string().url(),
    NEXT_PUBLIC_PAGE_TITLE: z.string().default('VPN'),
  },
  shared: {},
  runtimeEnv: {
    OPENID_CLIENT_ID: process.env.OPENID_CLIENT_ID,
    OPENID_CLIENT_SECRET: process.env.OPENID_CLIENT_SECRET,
    OPENID_DISCOVERY_URL: process.env.OPENID_DISCOVERY_URL,

    DATABASE_URL: process.env.DATABASE_URL,

    PANEL_API_URL: process.env.PANEL_API_URL,
    PANEL_TYPE: process.env.PANEL_TYPE,
    PANEL_USER_TRAFFIC_LIMIT_GB: process.env.PANEL_USER_TRAFFIC_LIMIT_GB,

    // Remnawave
    REMNAWAVE_API_KEY: process.env.REMNAWAVE_API_KEY,

    // Marzban
    MARZBAN_USERNAME: process.env.MARZBAN_USERNAME,
    MARZBAN_PASSWORD: process.env.MARZBAN_PASSWORD,
    // MARZBAN_USER_INBOUNDS: process.env.MARZBAN_USER_INBOUNDS
    //   ? JSON.parse(process.env.MARZBAN_USER_INBOUNDS)
    //   : undefined,

    NEXT_PUBLIC_LOGIN_BUTTON_TEXT: process.env.NEXT_PUBLIC_LOGIN_BUTTON_TEXT,
    NEXT_PUBLIC_MARZBAN_INSTANCE_URL: process.env.NEXT_PUBLIC_MARZBAN_INSTANCE_URL,
    NEXT_PUBLIC_PAGE_TITLE: process.env.NEXT_PUBLIC_PAGE_TITLE,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})
