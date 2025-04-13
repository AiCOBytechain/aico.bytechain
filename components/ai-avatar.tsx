"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AIAvatarProps {
  size?: "sm" | "md" | "lg"
  isActive?: boolean
  className?: string
}

export function AIAvatar({ size = "md", isActive = false, className }: AIAvatarProps) {
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)

  // Preload the logo image
  useEffect(() => {
    const img = new Image()
    img.onload = () => setLogoLoaded(true)
    img.onerror = () => setLoadError(true)
    img.src = "/images/aico-enhanced-logo.png"

    return () => {
      // Clean up by removing event listeners
      img.onload = null
      img.onerror = null
    }
  }, [])

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full bg-white border border-seablue-100 overflow-hidden",
        sizeClasses[size],
        className,
      )}
    >
      {logoLoaded && !loadError ? (
        <img
          src="/images/aico-enhanced-logo.png"
          alt="AI Assistant"
          className={cn(
            "object-contain transition-opacity",
            size === "sm" ? "w-6 h-6" : size === "md" ? "w-10 h-10" : "w-14 h-14",
          )}
        />
      ) : loadError ? (
        <div
          className={cn("flex items-center justify-center bg-seablue-100 text-seablue-600 font-bold", "w-full h-full")}
        >
          AI
        </div>
      ) : (
        <div className="animate-pulse bg-gray-200 w-3/4 h-3/4 rounded-full"></div>
      )}

      {/* Animated rings when active */}
      {isActive && (
        <>
          <div className="absolute inset-0 rounded-full animate-ping-slow opacity-30 bg-seablue-300"></div>
          <div className="absolute inset-[-4px] rounded-full animate-pulse-slow border-2 border-seablue-400 opacity-40"></div>
        </>
      )}
    </div>
  )
}
