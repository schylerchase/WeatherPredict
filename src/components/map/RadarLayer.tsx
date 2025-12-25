import { TileLayer } from 'react-leaflet'
import { buildRadarTileUrl } from '../../api/rainviewer'

interface RadarLayerProps {
  host: string
  path: string
  opacity?: number
  colorScheme?: number
}

export function RadarLayer({
  host,
  path,
  opacity = 0.7,
  colorScheme = 6,
}: RadarLayerProps) {
  const tileUrl = buildRadarTileUrl(host, path, {
    size: 256,
    colorScheme,
    smooth: true,
    snow: true,
  })

  return (
    <TileLayer
      url={tileUrl}
      opacity={opacity}
      attribution='<a href="https://www.rainviewer.com/">RainViewer</a>'
    />
  )
}
