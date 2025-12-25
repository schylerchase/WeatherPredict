import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { SettingsProvider } from './context/SettingsContext'
import { LocationProvider } from './context/LocationContext'
import { WeatherProvider } from './context/WeatherContext'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <SettingsProvider>
          <LocationProvider>
            <WeatherProvider>
              <App />
            </WeatherProvider>
          </LocationProvider>
        </SettingsProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>,
)
