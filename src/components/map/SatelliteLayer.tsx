import { TileLayer } from 'react-leaflet'
import { buildSatelliteTileUrl } from '../../api/rainviewer'

interface SatelliteLayerProps {
  host: string
  path: string
  opacity?: number
}

export function SatelliteLayer({
  host,
  path,
  opacity = 0.8,
}: SatelliteLayerProps) {
  const tileUrl = buildSatelliteTileUrl(host, path, {
    size: 256,
  })

  return (
    <TileLayer
      url={tileUrl}
      opacity={opacity}
      attribution='<a href="https://www.rainviewer.com/">RainViewer</a>'
    />
  )
}
