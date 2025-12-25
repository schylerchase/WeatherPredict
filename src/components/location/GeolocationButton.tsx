import { useEffect, useRef, useState } from 'react'
import { GlassButton } from '../common/GlassButton'
import { LocationIcon } from '../common/Icon'
import { useGeolocation } from '../../hooks/useGeolocation'
import { useLocation } from '../../context/LocationContext'
import { reverseGeocode } from '../../api/geocoding'

interface GeolocationButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function GeolocationButton({
  variant = 'secondary',
  size = 'md',
  showLabel = true,
  className,
}: GeolocationButtonProps) {
  const { loading, error, getPosition, coordinates, isSupported } = useGeolocation()
  const { setCurrentLocation } = useLocation()
  const [isGeocoding, setIsGeocoding] = useState(false)
  const processedCoords = useRef<string | null>(null)

  const handleClick = async () => {
    processedCoords.current = null // Reset so new coordinates will be processed
    getPosition()
  }

  // When coordinates are received, do reverse geocoding
  useEffect(() => {
    if (coordinates && !loading) {
      const coordsKey = `${coordinates.latitude},${coordinates.longitude}`

      // Only process if we haven't already processed these coordinates
      if (processedCoords.current === coordsKey) return
      processedCoords.current = coordsKey

      setIsGeocoding(true)
      reverseGeocode(coordinates.latitude, coordinates.longitude)
        .then((location) => {
          if (location) {
            setCurrentLocation(location) // Use the actual city name from reverse geocoding
          }
        })
        .finally(() => {
          setIsGeocoding(false)
        })
    }
  }, [coordinates, loading, setCurrentLocation])

  if (!isSupported) {
    return null
  }

  return (
    <div className={className}>
      <GlassButton
        variant={variant}
        size={size}
        onClick={handleClick}
        isLoading={loading || isGeocoding}
        icon={<LocationIcon size={size === 'sm' ? 16 : 18} />}
        title="Use my location"
      >
        {showLabel && (isGeocoding ? 'Finding location...' : 'Use my location')}
      </GlassButton>
      {error && (
        <p className="mt-1 text-xs text-macos-red">{error}</p>
      )}
    </div>
  )
}
