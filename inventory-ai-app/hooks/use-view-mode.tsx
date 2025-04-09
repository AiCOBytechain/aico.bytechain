"use client"

import { useState, useEffect } from "react"

type ViewMode = "desktop" | "mobile"

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop")

  // Initialize from body class on mount
  useEffect(() => {
    if (typeof document !== "undefined") {
      const isMobileMode = document.body.classList.contains("mobile-view-mode")
      setViewMode(isMobileMode ? "mobile" : "desktop")
    }
  }, [])

  const setMode = (mode: ViewMode) => {
    if (typeof document === "undefined") return

    setViewMode(mode)

    if (mode === "mobile") {
      document.body.classList.add("mobile-view-mode")
      document.body.classList.remove("desktop-view-mode")
    } else {
      document.body.classList.add("desktop-view-mode")
      document.body.classList.remove("mobile-view-mode")
    }

    // Save preference to localStorage for persistence
    try {
      localStorage.setItem("aico-view-mode", mode)
    } catch (e) {
      // Ignore storage errors
    }
  }

  // Load saved preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedMode = localStorage.getItem("aico-view-mode") as ViewMode | null
        if (savedMode) {
          setMode(savedMode)
        }
      } catch (e) {
        // Ignore storage errors
      }
    }
  }, [])

  return {
    viewMode,
    setViewMode: setMode,
    isMobileView: viewMode === "mobile",
    isDesktopView: viewMode === "desktop",
  }
}

