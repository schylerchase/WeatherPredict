import { useEffect } from 'react'
import { TileLayer, useMap } from 'react-leaflet'
import { buildSatelliteTileUrl } from '../../api/rainviewer'

interface SatelliteLayerProps {
  host: string
  path: string
  opacity?: number
}

/**
 * Enhanced satellite layer with CSS filters for better visibility.
 * RainViewer's infrared imagery can appear washed out - this adds
 * contrast and brightness to make cloud formations more visible.
 */
export function SatelliteLayer({
  host,
  path,
  opacity = 0.8,
}: SatelliteLayerProps) {
  const map = useMap()

  // Apply CSS filter to enhance infrared imagery visibility
  useEffect(() => {
    const container = map.getContainer()

    // Find satellite tiles and apply enhancement filter
    const applyFilter = () => {
      const tiles = container.querySelectorAll('.leaflet-tile-pane .leaflet-layer:last-child img')
      tiles.forEach((tile) => {
        const img = tile as HTMLImageElement
        if (img.src.includes('satellite') || img.src.includes(path)) {
          img.style.filter = 'contrast(1.4) brightness(1.1) saturate(1.2)'
        }
      })
    }

    // Apply on load and when tiles update
    applyFilter()
    map.on('tileload', applyFilter)

    return () => {
      map.off('tileload', applyFilter)
    }
  }, [map, path])

  // Use 512px tiles for better resolution at higher zoom levels
  const tileUrl = buildSatelliteTileUrl(host, path, {
    size: 512,
  })

  return (
    <TileLayer
      url={tileUrl}
      opacity={opacity}
      attribution='<a href="https://www.rainviewer.com/">RainViewer</a>'
      className="satellite-layer"
      tileSize={512}
      zoomOffset={-1}
    />
  )
}
