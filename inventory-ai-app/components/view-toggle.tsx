"use client"

import { Button } from "@/components/ui/button"
import { Monitor, Smartphone } from "lucide-react"
import { useViewMode } from "@/hooks/use-view-mode"

interface ViewToggleProps {
  onViewChange?: (mode: "desktop" | "mobile") => void
}

export function ViewToggle({ onViewChange }: ViewToggleProps) {
  const { viewMode, setViewMode } = useViewMode()

  const toggleDesktopView = () => {
    setViewMode("desktop")
    if (onViewChange) onViewChange("desktop")
  }

  const toggleMobileView = () => {
    setViewMode("mobile")
    if (onViewChange) onViewChange("mobile")
  }

  return (
    <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm border">
      <Button
        variant={viewMode === "desktop" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full ${viewMode === "desktop" ? "bg-seablue-600 text-white" : "text-muted-foreground"}`}
        onClick={toggleDesktopView}
      >
        <Monitor className="h-4 w-4" />
        <span className="sr-only">Desktop View</span>
      </Button>

      <Button
        variant={viewMode === "mobile" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full ${viewMode === "mobile" ? "bg-seablue-600 text-white" : "text-muted-foreground"}`}
        onClick={toggleMobileView}
      >
        <Smartphone className="h-4 w-4" />
        <span className="sr-only">Mobile View</span>
      </Button>
    </div>
  )
}

