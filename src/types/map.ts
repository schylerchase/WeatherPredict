export type LayerType =
  | 'radar'
  | 'satellite'
  | 'temperature'
  | 'precipitation'
  | 'wind'
  | 'pressure'
  | 'clouds'

export interface MapLayer {
  id: LayerType
  name: string
  description: string
  icon: string
  visible: boolean
  opacity: number
  source: 'rainviewer' | 'openmeteo' | 'custom'
}

export interface RainViewerFrame {
  time: number
  path: string
}

export interface RainViewerData {
  version: string
  generated: number
  host: string
  radar: {
    past: RainViewerFrame[]
    nowcast: RainViewerFrame[]
  }
  satellite?: {
    infrared: RainViewerFrame[]
  }
}

export interface MapViewport {
  center: [number, number]
  zoom: number
}

export const DEFAULT_LAYERS: MapLayer[] = [
  {
    id: 'radar',
    name: 'Radar',
    description: 'Live weather radar',
    icon: 'radar',
    visible: true,
    opacity: 0.7,
    source: 'rainviewer',
  },
  {
    id: 'satellite',
    name: 'Satellite',
    description: 'Infrared satellite imagery',
    icon: 'satellite',
    visible: false,
    opacity: 0.8,
    source: 'rainviewer',
  },
  {
    id: 'temperature',
    name: 'Temperature',
    description: 'Temperature overlay',
    icon: 'thermometer',
    visible: false,
    opacity: 0.6,
    source: 'custom',
  },
  {
    id: 'precipitation',
    name: 'Precipitation',
    description: 'Precipitation amounts',
    icon: 'droplets',
    visible: false,
    opacity: 0.6,
    source: 'custom',
  },
  {
    id: 'wind',
    name: 'Wind',
    description: 'Wind speed and direction',
    icon: 'wind',
    visible: false,
    opacity: 0.5,
    source: 'custom',
  },
  {
    id: 'clouds',
    name: 'Clouds',
    description: 'Cloud coverage',
    icon: 'cloud',
    visible: false,
    opacity: 0.5,
    source: 'custom',
  },
]
