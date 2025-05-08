import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import xbytes from 'xbytes'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: 'accurate' | 'normal'
  } = {},
) {
  const { decimals = 0, sizeType = 'normal' } = opts

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(decimals)} ${
    sizeType === 'accurate' ? (accurateSizes[i] ?? 'Bytest') : (sizes[i] ?? 'Bytes')
  }`
}

export function bytesToGb(bytesInput: number | string | undefined): number | undefined {
  if (typeof bytesInput === 'undefined') return undefined

  const res = xbytes.parseBytes(Number(bytesInput), {
    sticky: true,
    prefixIndex: 3,
    fixed: 0,
    iec: true,
    space: false,
  })

  return Number(res.size.replace('GiB', ''))
}

export function gbToBytes(gbInput: number | undefined): number | undefined {
  if (typeof gbInput === 'undefined') return undefined

  const res = xbytes.parse(`${Number(gbInput)} GiB`)

  return Math.floor(res.bytes)
}

// export function prettyBytesToAny(
//   bytesInput: number | string | undefined,
//   returnZero = false,
// ): string | undefined {
//   if (!bytesInput) {
//     return returnZero ? '0' : undefined
//   }

//   const res = xbytes.parseBytes(Number(bytesInput), { sticky: true, iec: true })

//   return String(res.size)
// }

// export function prettyBytes(
//   bytesInput: number | string | undefined,
//   returnZero = false,
// ): string | undefined {
//   if (!bytesInput) {
//     return returnZero ? '0' : undefined
//   }

//   const res = xbytes.parseBytes(Number(bytesInput), { sticky: true, prefixIndex: 3, iec: true })

//   return String(res.size)
// }

// export function prettyBytesWithoutPrefix(
//   bytesInput: number | string | undefined,
//   returnZero = false,
// ): string | undefined {
//   if (!bytesInput) {
//     return returnZero ? '0' : undefined
//   }

//   const res = xbytes.parseBytes(Number(bytesInput), { sticky: true, iec: true })

//   return String(res.size)
// }
