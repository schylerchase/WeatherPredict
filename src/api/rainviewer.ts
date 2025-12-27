import { API_CONFIG, cachedApiClient } from './client'
import type { RainViewerData, RainViewerFrame } from '../types/map'

export async function getRainViewerData(): Promise<RainViewerData> {
  const url = `${API_CONFIG.RAINVIEWER_BASE}/weather-maps.json`

  return cachedApiClient<RainViewerData>(url, {
    cacheDuration: 2 * 60 * 1000, // 2 minute cache - radar data updates frequently
  })
}

interface TileUrlOptions {
  size?: 256 | 512
  colorScheme?: number // 0-8, see RainViewer docs
  smooth?: boolean
  snow?: boolean
}

// Build radar tile URL for Leaflet
export function buildRadarTileUrl(
  host: string,
  path: string,
  options: TileUrlOptions = {}
): string {
  const { size = 256, colorScheme = 6, smooth = true, snow = true } = options

  const smoothFlag = smooth ? 1 : 0
  const snowFlag = snow ? 1 : 0

  return `${host}${path}/${size}/{z}/{x}/{y}/${colorScheme}/${smoothFlag}_${snowFlag}.png`
}

// Build satellite tile URL
export function buildSatelliteTileUrl(
  host: string,
  path: string,
  options: { size?: 256 | 512 } = {}
): string {
  const { size = 512 } = options
  // RainViewer satellite tiles: host/path/size/{z}/{x}/{y}/colorScheme/options.png
  return `${host}${path}/${size}/{z}/{x}/{y}/0/0_0.png`
}

// Get all available radar frames with timestamps
export function getRadarFrames(data: RainViewerData): RainViewerFrame[] {
  return [...data.radar.past, ...data.radar.nowcast]
}

// Get satellite frames
export function getSatelliteFrames(data: RainViewerData): RainViewerFrame[] {
  return data.satellite?.infrared || []
}

// Format frame timestamp for display
export function formatFrameTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

// Check if a frame is in the future (nowcast)
export function isNowcastFrame(
  frame: RainViewerFrame,
  data: RainViewerData
): boolean {
  return data.radar.nowcast.some((f) => f.time === frame.time)
}

// Color scheme options for radar
export const RADAR_COLOR_SCHEMES = [
  { id: 0, name: 'Original' },
  { id: 1, name: 'Universal Blue' },
  { id: 2, name: 'TITAN' },
  { id: 3, name: 'TWC' },
  { id: 4, name: 'Meteored' },
  { id: 5, name: 'NEXRAD Level III' },
  { id: 6, name: 'Rainbow @ SELEX-SI' },
  { id: 7, name: 'Dark Sky' },
  { id: 8, name: 'The Weather Channel' },
] as const
