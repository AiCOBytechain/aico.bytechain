import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-seablue-600" />
        <p className="text-sm text-muted-foreground">Loading Pricing Information...</p>
      </div>
    </div>
  )
}

