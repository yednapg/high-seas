import { useMemo, useEffect, useState } from "react"
import { loadingSpinners, sample } from "../../../lib/flavor"

const LoadingSpinner = () => {
  const [src, setSrc] = useState('')

  useEffect(() => {
    setSrc(sample(loadingSpinners))
  }, [])

  return useMemo(() => (
    <div className="h-16 w-16">
      {src && (
        <img src={src} alt="loading spinner" />
      )}
    </div>
  ), [src])
}

export { LoadingSpinner }