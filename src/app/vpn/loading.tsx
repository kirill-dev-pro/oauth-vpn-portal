import { Loader } from 'lucide-react'

export default function VpnLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Loader className="animate-spin" />
    </div>
  )
}
