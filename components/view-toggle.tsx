"use client"

import { Button } from "@/components/ui/button"
import { Monitor, Smartphone } from "lucide-react"
import { useEffect, useState } from "react"

type ViewMode = "desktop" | "mobile"

interface ViewToggleProps {
  onViewChange?: (mode: ViewMode) => void
}

export function ViewToggle({ onViewChange }: ViewToggleProps) {
  const [isMobileView, setIsMobileView] = useState(false)

  // Initialize state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobileView(document.body.classList.contains("mobile-view-mode"))
    }
  }, [])

  const toggleDesktopView = () => {
    if (typeof window !== "undefined") {
      document.body.classList.remove("mobile-view-mode")
      document.body.classList.add("desktop-view-mode")
      setIsMobileView(false)
      if (onViewChange) onViewChange("desktop")
    }
  }

  const toggleMobileView = () => {
    if (typeof window !== "undefined") {
      document.body.classList.add("mobile-view-mode")
      document.body.classList.remove("desktop-view-mode")
      setIsMobileView(true)
      if (onViewChange) onViewChange("mobile")
    }
  }

  return (
    <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm border">
      <Button
        variant={!isMobileView ? "default" : "ghost"}
        size="sm"
        className={`rounded-full ${!isMobileView ? "bg-seablue-600 text-white" : "text-muted-foreground"}`}
        onClick={toggleDesktopView}
      >
        <Monitor className="h-4 w-4" />
        <span className="sr-only">Desktop View</span>
      </Button>

      <Button
        variant={isMobileView ? "default" : "ghost"}
        size="sm"
        className={`rounded-full ${isMobileView ? "bg-seablue-600 text-white" : "text-muted-foreground"}`}
        onClick={toggleMobileView}
      >
        <Smartphone className="h-4 w-4" />
        <span className="sr-only">Mobile View</span>
      </Button>
    </div>
  )
}
