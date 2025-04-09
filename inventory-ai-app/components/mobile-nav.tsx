"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LogoLink } from "@/components/app-logo"
import {
  Menu,
  LayoutDashboard,
  Package,
  MessageSquareText,
  LineChart,
  BarChart4,
  Settings,
  LogOut,
  ShoppingCart,
  Upload,
  User,
  DollarSign,
} from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-seablue-900 text-white p-0">
        <div className="flex h-16 items-center border-b border-seablue-800 px-6">
          <LogoLink />
        </div>
        <nav className="space-y-1 px-3 py-4">
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          <Link href="/upload" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <Upload className="mr-2 h-5 w-5" />
              Upload Documents
            </Button>
          </Link>
          <Link href="/inventory" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <Package className="mr-2 h-5 w-5" />
              Inventory
            </Button>
          </Link>
          <Link href="/ai-consultation" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <MessageSquareText className="mr-2 h-5 w-5" />
              AI Consultation
            </Button>
          </Link>
          <Link href="/tracking" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <LineChart className="mr-2 h-5 w-5" />
              Tracking AI
            </Button>
          </Link>
          <Link href="/market" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <BarChart4 className="mr-2 h-5 w-5" />
              Market AI
            </Button>
          </Link>
          <Link href="/pricing" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <DollarSign className="mr-2 h-5 w-5" />
              Pricing
            </Button>
          </Link>
          <Link href="/marketplace" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Marketplace
            </Button>
          </Link>
          <Link href="/profile" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <User className="mr-2 h-5 w-5" />
              Profile
            </Button>
          </Link>
          <Link href="/settings" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </Link>
          <div className="pt-4 mt-4 border-t border-seablue-800">
            <Link href="/auth/login" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

