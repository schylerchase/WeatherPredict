import { Link, useLocation } from 'react-router-dom'
import { FavoriteLocations } from '../location/FavoriteLocations'
import { GlassCard } from '../common/GlassCard'
import { cn } from '../../utils/cn'

const navLinks = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/map', label: 'Weather Map', icon: '🗺️' },
  { path: '/forecast', label: 'Forecast', icon: '📅' },
  { path: '/history', label: 'Historical', icon: '📊' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-4">
        {/* Navigation */}
        <GlassCard padding="sm">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-macos',
                  'text-sm font-medium transition-colors',
                  location.pathname === link.path
                    ? 'bg-macos-blue/10 text-macos-blue dark:bg-macos-blue/20'
                    : 'text-macos-gray-600 dark:text-macos-gray-400 hover:bg-macos-gray-100 dark:hover:bg-macos-gray-700'
                )}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </GlassCard>

        {/* Favorites */}
        <GlassCard>
          <FavoriteLocations />
        </GlassCard>
      </div>
    </aside>
  )
}
