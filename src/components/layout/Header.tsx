import { Link, useLocation as useRouterLocation } from 'react-router-dom'
import { LocationSearch } from '../location/LocationSearch'
import { GeolocationButton } from '../location/GeolocationButton'
import { SunIcon, MoonIcon, MenuIcon, CloseIcon } from '../common/Icon'
import { useTheme } from '../../context/ThemeContext'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { cn } from '../../utils/cn'

// Auto/System icon component
function AutoIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      <path d="M16 12a4 4 0 0 1-4 4" strokeDasharray="4 2" />
    </svg>
  )
}

interface HeaderProps {
  onMenuToggle?: () => void
  isMenuOpen?: boolean
}

export function Header({ onMenuToggle, isMenuOpen }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const isMobile = useIsMobile()
  const routerLocation = useRouterLocation()

  // Cycle through: light → dark → system (auto)
  const cycleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(nextTheme)
  }

  const getThemeIcon = () => {
    if (theme === 'system') {
      return <AutoIcon size={20} className="text-macos-purple" />
    }
    if (theme === 'dark') {
      return <MoonIcon size={20} className="text-macos-blue" />
    }
    return <SunIcon size={20} className="text-macos-yellow" />
  }

  const getThemeLabel = () => {
    if (theme === 'system') return 'Auto (following system)'
    if (theme === 'dark') return 'Dark mode'
    return 'Light mode'
  }

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/map', label: 'Map' },
    { path: '/forecast', label: 'Forecast' },
    { path: '/history', label: 'History' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass border-b border-white/10 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo and mobile menu */}
            <div className="flex items-center gap-3">
              {isMobile && (
                <button
                  onClick={onMenuToggle}
                  className="p-2 rounded-macos hover:bg-white/10"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
                </button>
              )}
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">🌤️</span>
                <span className="font-semibold text-lg text-macos-gray-900 dark:text-white hidden sm:block">
                  WeatherPredict
                </span>
              </Link>
            </div>

            {/* Desktop navigation */}
            {!isMobile && (
              <nav className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'px-3 py-1.5 rounded-macos text-sm font-medium transition-colors',
                      routerLocation.pathname === link.path
                        ? 'bg-macos-blue/10 text-macos-blue dark:bg-macos-blue/20'
                        : 'text-macos-gray-600 dark:text-macos-gray-400 hover:text-macos-gray-900 dark:hover:text-white hover:bg-white/10'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Search and actions */}
            <div className="flex items-center gap-3">
              {/* Search (hidden on mobile, shown in sidebar) */}
              {!isMobile && (
                <div className="w-64">
                  <LocationSearch />
                </div>
              )}

              {/* Geolocation button (icon only on mobile) */}
              <GeolocationButton
                variant="ghost"
                size="sm"
                showLabel={false}
              />

              {/* Theme toggle - cycles through Light → Dark → Auto */}
              <button
                onClick={cycleTheme}
                className="p-2 rounded-macos hover:bg-white/10 transition-colors"
                aria-label={getThemeLabel()}
                title={getThemeLabel()}
              >
                {getThemeIcon()}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobile && isMenuOpen && (
        <div className="glass border-b border-white/10 dark:border-white/5 animate-slide-down">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile search */}
            <LocationSearch autoFocus />

            {/* Mobile nav links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={onMenuToggle}
                  className={cn(
                    'px-4 py-2 rounded-macos text-sm font-medium transition-colors',
                    routerLocation.pathname === link.path
                      ? 'bg-macos-blue/10 text-macos-blue'
                      : 'text-macos-gray-600 dark:text-macos-gray-400'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
