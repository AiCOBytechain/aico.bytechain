import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AppLogo } from "@/components/app-logo"

export default function PricingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <AppLogo />
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80">
                Dashboard
              </Link>
              <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-seablue-600">
                Pricing
              </Link>
              <Link href="/ai-consultation" className="transition-colors hover:text-foreground/80">
                AI Consultation
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-seablue-600 hover:bg-seablue-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-24">{children}</main>

      <footer className="w-full border-t bg-seablue-900 text-white py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-seablue-100 md:text-left">
            © 2025 AiCO. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-seablue-100 hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-seablue-100 hover:text-white">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-seablue-100 hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

