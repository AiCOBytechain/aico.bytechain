"use client"

import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { useZoom } from "@/contexts/zoom-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ZoomControl() {
  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useZoom()

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground" onClick={zoomOut}>
              <ZoomOut className="h-4 w-4" />
              <span className="sr-only">Zoom Out</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground" onClick={resetZoom}>
              <span className="text-xs font-medium">{Math.round(zoomLevel * 100)}%</span>
              <RotateCcw className="h-3 w-3 ml-1" />
              <span className="sr-only">Reset Zoom</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset Zoom</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">Zoom In</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
