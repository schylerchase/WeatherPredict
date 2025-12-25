import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { MapView } from './pages/MapView'
import { ForecastView } from './pages/ForecastView'
import { HistoricalView } from './pages/HistoricalView'
import { SettingsView } from './pages/SettingsView'

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-macos-gray-50 dark:bg-macos-gray-900">
      {/* Header */}
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMenuOpen={isMobileMenuOpen}
      />

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar (desktop only) */}
          <Sidebar />

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/forecast" element={<ForecastView />} />
              <Route path="/history" element={<HistoricalView />} />
              <Route path="/settings" element={<SettingsView />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-macos-gray-400 dark:text-macos-gray-500">
        <p>
          Weather data by{' '}
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-macos-blue hover:underline"
          >
            Open-Meteo
          </a>
          {' • '}
          Radar by{' '}
          <a
            href="https://www.rainviewer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-macos-blue hover:underline"
          >
            RainViewer
          </a>
        </p>
      </footer>
    </div>
  )
}
