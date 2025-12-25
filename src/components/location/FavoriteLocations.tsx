import { GlassCard } from '../common/GlassCard'
import { GlassButton } from '../common/GlassButton'
import { StarIcon, CloseIcon } from '../common/Icon'
import { useLocation } from '../../context/LocationContext'
import type { FavoriteLocation } from '../../types/location'
import { cn } from '../../utils/cn'

interface FavoriteItemProps {
  location: FavoriteLocation
  isActive: boolean
  onSelect: () => void
  onRemove: () => void
}

function FavoriteItem({ location, isActive, onSelect, onRemove }: FavoriteItemProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-3 py-2 rounded-macos cursor-pointer',
        'transition-colors duration-150',
        isActive
          ? 'bg-macos-blue/10 dark:bg-macos-blue/20'
          : 'hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700'
      )}
      onClick={onSelect}
    >
      <StarIcon
        size={16}
        filled
        className={cn(
          'shrink-0',
          isActive ? 'text-macos-blue' : 'text-macos-yellow'
        )}
      />
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            'text-sm font-medium truncate',
            isActive
              ? 'text-macos-blue'
              : 'text-macos-gray-900 dark:text-white'
          )}
        >
          {location.name}
        </div>
        {location.country && (
          <div className="text-xs text-macos-gray-500 dark:text-macos-gray-400 truncate">
            {location.admin1 && `${location.admin1}, `}
            {location.country}
          </div>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className={cn(
          'p-1 rounded-full opacity-0 group-hover:opacity-100',
          'transition-opacity duration-150',
          'hover:bg-macos-gray-200 dark:hover:bg-macos-gray-600'
        )}
        aria-label="Remove from favorites"
      >
        <CloseIcon size={14} className="text-macos-gray-400" />
      </button>
    </div>
  )
}

export function FavoriteLocations() {
  const { favorites, currentLocation, setCurrentLocation, removeFavorite, addFavorite, isFavorite } = useLocation()

  const handleAddCurrent = () => {
    if (currentLocation && !isFavorite(currentLocation.id)) {
      addFavorite(currentLocation)
    }
  }

  if (favorites.length === 0) {
    return (
      <GlassCard variant="inset" className="text-center">
        <StarIcon size={24} className="text-macos-gray-300 dark:text-macos-gray-600 mx-auto mb-2" />
        <p className="text-sm text-macos-gray-500 dark:text-macos-gray-400 mb-3">
          No favorite locations yet
        </p>
        {currentLocation && !isFavorite(currentLocation.id) && (
          <GlassButton
            size="sm"
            onClick={handleAddCurrent}
            icon={<StarIcon size={14} />}
          >
            Add {currentLocation.name}
          </GlassButton>
        )}
      </GlassCard>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-xs font-semibold text-macos-gray-500 dark:text-macos-gray-400 uppercase tracking-wide">
          Favorites
        </h3>
        {currentLocation && !isFavorite(currentLocation.id) && (
          <button
            onClick={handleAddCurrent}
            className="text-xs text-macos-blue hover:underline"
          >
            + Add current
          </button>
        )}
      </div>
      {favorites.map((location) => (
        <FavoriteItem
          key={location.id}
          location={location}
          isActive={currentLocation?.id === location.id}
          onSelect={() => setCurrentLocation(location)}
          onRemove={() => removeFavorite(location.id)}
        />
      ))}
    </div>
  )
}
