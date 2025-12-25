# WeatherPredict 🌤️

A beautiful, comprehensive weather application with a macOS Sonoma-inspired interface. Built with React, TypeScript, and powered by Open-Meteo.

![WeatherPredict Screenshot](https://via.placeholder.com/800x400?text=WeatherPredict+Screenshot)

## Features

### 🌡️ Current Conditions
- Real-time temperature, humidity, wind, and pressure
- "Feels like" temperature
- Weather condition icons and descriptions

### 📅 Forecasts
- **Hourly**: 48-hour forecast with precipitation probability
- **Daily**: 14-day extended forecast with high/low temperatures
- Detailed metrics for each day

### 🗺️ Interactive Weather Map
- Live weather radar from RainViewer
- Animated radar timeline
- Multiple layer options (radar, satellite, temperature)
- Smooth pan and zoom

### 📊 Historical Data
- View past weather for any date range
- Temperature and precipitation charts
- Climate statistics

### 🎨 Beautiful Design
- macOS Sonoma-inspired glassmorphism UI
- Dark and light mode
- Responsive design for desktop and mobile
- Smooth animations and transitions

### 🔧 Customizable
- Temperature units (°C/°F)
- Wind speed units (km/h, mph, m/s, knots)
- 12/24 hour time format
- Favorite locations

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Maps**: React-Leaflet + OpenStreetMap
- **Charts**: Recharts
- **Weather Data**: [Open-Meteo API](https://open-meteo.com/) (free, no API key required)
- **Radar**: [RainViewer API](https://www.rainviewer.com/)
- **Hosting**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/WeatherPredict.git
   cd WeatherPredict
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deploying to GitHub Pages

1. Push your code to the `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Enable GitHub Pages in your repository settings (Settings → Pages → Source: GitHub Actions)

## Project Structure

```
src/
├── api/           # API integration (Open-Meteo, RainViewer)
├── components/
│   ├── common/    # Reusable UI components (GlassCard, buttons, etc.)
│   ├── layout/    # Header, Sidebar
│   ├── location/  # Location search and favorites
│   ├── map/       # Weather map components
│   └── weather/   # Weather display components
├── context/       # React Context providers
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── styles/        # Global styles and Tailwind config
```

## API Usage

This app uses **free, open-source APIs** with no authentication required:

### Open-Meteo
- Current weather
- Hourly forecast (48 hours)
- Daily forecast (14 days)
- Historical weather data
- Location search (geocoding)

### RainViewer
- Weather radar imagery
- Satellite imagery
- Animated radar timeline

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Weather data by [Open-Meteo](https://open-meteo.com/)
- Radar imagery by [RainViewer](https://www.rainviewer.com/)
- Map tiles by [CARTO](https://carto.com/) and [OpenStreetMap](https://www.openstreetmap.org/)
- Icons from system emoji

---

Made with ❤️ and ☕
