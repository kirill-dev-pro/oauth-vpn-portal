import { loadMarzbanInstanceInbounds } from '@/lib/marzban-instance-config'

export function register() {
  console.log('Initialising build')
  loadMarzbanInstanceInbounds()
}
