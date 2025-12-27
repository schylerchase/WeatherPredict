import { WeatherMap } from '../components/map/WeatherMap'

export function MapView() {
  return (
    <div className="h-full -m-6">
      <WeatherMap
        height="100%"
        showControls={true}
        showTimeline={true}
        showLegend={true}
        showZoomControls={true}
        showLocationLabel={true}
        fullscreenEnabled={true}
        zoom={7}
        className="h-full"
      />
    </div>
  )
}
