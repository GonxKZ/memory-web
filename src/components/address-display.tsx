import { formatAddress, formatBinary } from "@/lib/memory-utils"

interface AddressDisplayProps {
  address: number
  bits?: number
  showBinary?: boolean
  className?: string
}

export function AddressDisplay({ 
  address, 
  bits = 32, 
  showBinary = false,
  className = ""
}: AddressDisplayProps) {
  return (
    <div className={`font-mono ${className}`}>
      <div className="text-lg font-semibold">
        {formatAddress(address, bits)}
      </div>
      {showBinary && (
        <div className="text-sm text-gray-500 mt-1">
          {formatBinary(address, bits)}
        </div>
      )}
    </div>
  )
}