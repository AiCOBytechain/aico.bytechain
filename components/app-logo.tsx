"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export function AppLogo() {
  const [logoLoaded, setLogoLoaded] = useState(false)

  // Preload the logo image
  useEffect(() => {
    const img = new Image()
    img.onload = () => setLogoLoaded(true)
    img.src = "/images/aico-enhanced-logo.png"
  }, [])

  return (
    <div className="flex items-center gap-2">
      {logoLoaded && <img src="/images/aico-enhanced-logo.png" alt="AiCO" className="h-8 w-8 object-contain" />}
      <span className="font-bold text-xl text-white dark:text-white">AiCO</span>
    </div>
  )
}

export function LogoLink({ href = "/dashboard", asPlainLogo = false }: { href?: string; asPlainLogo?: boolean }) {
  if (asPlainLogo) {
    return <AppLogo />
  }

  return (
    <Link href={href} className="flex items-center">
      <AppLogo />
    </Link>
  )
}
