import { useState, useEffect, useCallback, useRef } from 'react'
import type { RainViewerData } from '../types/map'
import { getRainViewerData, getRadarFrames } from '../api/rainviewer'

interface UseRainViewerOptions {
  autoPlay?: boolean
  animationSpeed?: number // ms per frame
}

export function useRainViewer(options: UseRainViewerOptions = {}) {
  const { autoPlay = false, animationSpeed = 500 } = options

  const [data, setData] = useState<RainViewerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Fetch RainViewer data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getRainViewerData()
      setData(result)

      // Set current frame to the latest past frame
      const pastFrameCount = result.radar.past.length
      setCurrentFrameIndex(Math.max(0, pastFrameCount - 1))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch radar data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Get all frames
  const frames = data ? getRadarFrames(data) : []
  const currentFrame = frames[currentFrameIndex] || null

  // Animation control
  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      animationRef.current = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % frames.length)
      }, animationSpeed)
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current)
      }
    }
  }, [isPlaying, frames.length, animationSpeed])

  const play = useCallback(() => setIsPlaying(true), [])
  const pause = useCallback(() => setIsPlaying(false), [])
  const togglePlay = useCallback(() => setIsPlaying((prev) => !prev), [])

  const goToFrame = useCallback(
    (index: number) => {
      setCurrentFrameIndex(Math.max(0, Math.min(index, frames.length - 1)))
    },
    [frames.length]
  )

  const nextFrame = useCallback(() => {
    setCurrentFrameIndex((prev) => (prev + 1) % frames.length)
  }, [frames.length])

  const prevFrame = useCallback(() => {
    setCurrentFrameIndex((prev) => (prev - 1 + frames.length) % frames.length)
  }, [frames.length])

  return {
    data,
    isLoading,
    error,
    frames,
    currentFrame,
    currentFrameIndex,
    isPlaying,
    play,
    pause,
    togglePlay,
    goToFrame,
    nextFrame,
    prevFrame,
    refetch: fetchData,
  }
}
