"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function MarketplacePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the market page with marketplace tab active
    router.push("/market?tab=marketplace")
  }, [router])

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-seablue-600" />
        <p className="text-sm text-muted-foreground">Redirecting to Marketplace...</p>
      </div>
    </div>
  )
}
