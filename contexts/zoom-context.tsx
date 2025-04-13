"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type ZoomLevel = 0.75 | 0.9 | 1 | 1.1 | 1.25

interface ZoomContextType {
  zoomLevel: ZoomLevel
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined)

export function ZoomProvider({ children }: { children: ReactNode }) {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(1)

  // Load saved zoom level from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedZoom = localStorage.getItem("app-zoom-level")
      if (savedZoom) {
        setZoomLevel(Number.parseFloat(savedZoom) as ZoomLevel)
      }
    }
  }, [])

  // Apply zoom level to the document root
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Save to localStorage
      localStorage.setItem("app-zoom-level", zoomLevel.toString())

      // Apply zoom to the document
      document.documentElement.style.setProperty("--app-zoom", zoomLevel.toString())

      // Add a data attribute for potential CSS targeting
      document.documentElement.setAttribute("data-zoom", zoomLevel.toString())
    }
  }, [zoomLevel])

  const zoomIn = () => {
    setZoomLevel((prev) => {
      if (prev >= 1.25) return prev
      if (prev === 0.75) return 0.9
      if (prev === 0.9) return 1
      if (prev === 1) return 1.1
      return 1.25
    })
  }

  const zoomOut = () => {
    setZoomLevel((prev) => {
      if (prev <= 0.75) return prev
      if (prev === 1.25) return 1.1
      if (prev === 1.1) return 1
      if (prev === 1) return 0.9
      return 0.75
    })
  }

  const resetZoom = () => {
    setZoomLevel(1)
  }

  return <ZoomContext.Provider value={{ zoomLevel, zoomIn, zoomOut, resetZoom }}>{children}</ZoomContext.Provider>
}

export function useZoom() {
  const context = useContext(ZoomContext)
  if (context === undefined) {
    throw new Error("useZoom must be used within a ZoomProvider")
  }
  return context
}
