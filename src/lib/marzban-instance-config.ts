import { marzban } from '@/lib/marzban'
import KeyvSqlite from '@keyv/sqlite'
import Keyv from 'keyv'
import { mapValues } from 'lodash-es'
import { z } from 'zod'

const kv = new Keyv({
  store: new KeyvSqlite('marzban-config.db'),
})

const inboundSchema = z.object({
  tag: z.string(),
  protocol: z.string(),
  network: z.string(),
  port: z.number(),
  tls: z.string(),
})

const inboundsSchemaObject = z.object({
  vmess: z.array(inboundSchema).optional(),
  vless: z.array(inboundSchema).optional(),
  trojan: z.array(inboundSchema).optional(),
  shadowsocks: z.array(inboundSchema).optional(),
})

type MarzbanInbounds = z.infer<typeof inboundsSchemaObject>

export const loadMarzbanInstanceInbounds = async () => {
  const marzbanResponse = await marzban.system.getInbounds()
  const result = inboundsSchemaObject.safeParse(marzbanResponse)

  if (result.error) {
    console.error('Error parsing inbounds of Marzban instance', result.error)
    return
  }

  kv.set('inbounds', result.data)
}

const DEFAULT_INBOUNDS = {
  vmess: ['VMess TCP', 'VMess Websocket'],
  vless: ['VLESS TCP REALITY', 'VLESS GRPC REALITY'],
  trojan: ['Trojan Websocket TLS'],
  shadowsocks: ['Shadowsocks TCP'],
}

export const getMarzbanInstanceInbounds = async () => {
  const config = await kv.get<MarzbanInbounds>('inbounds')
  if (config) {
    const result = mapValues(config, (inbounds) => inbounds?.map((inbound) => inbound.tag))
    return result
  }

  return DEFAULT_INBOUNDS
}
