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

  const handleClick = async () => {
    getPosition()
  }

  // When coordinates are received, update the location
  if (coordinates && !loading) {
    reverseGeocode(coordinates.latitude, coordinates.longitude).then((location) => {
      if (location) {
        setCurrentLocation({
          ...location,
          name: 'Current Location',
        })
      }
    })
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className={className}>
      <GlassButton
        variant={variant}
        size={size}
        onClick={handleClick}
        isLoading={loading}
        icon={<LocationIcon size={size === 'sm' ? 16 : 18} />}
        title="Use my location"
      >
        {showLabel && 'Use my location'}
      </GlassButton>
      {error && (
        <p className="mt-1 text-xs text-macos-red">{error}</p>
      )}
    </div>
  )
}
