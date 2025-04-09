"use client"

import { type ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import {
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
  Bell,
  Search,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoLink } from "@/components/app-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ViewToggle } from "@/components/view-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { useViewMode } from "@/hooks/use-view-mode"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [logoLoaded, setLogoLoaded] = useState(false)
  const { viewMode, setViewMode } = useViewMode()

  // Preload the logo image
  useEffect(() => {
    const img = new Image()
    img.onload = () => setLogoLoaded(true)
    img.src = "/images/aico-enhanced-logo.png"
  }, [])

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 bg-seablue-900 text-white lg:block">
        <div className="flex h-16 items-center border-b border-seablue-800 px-6">
          <LogoLink />
        </div>
        <nav className="space-y-1 px-3 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          <Link href="/upload">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <Upload className="mr-2 h-5 w-5" />
              Upload Documents
            </Button>
          </Link>
          <Link href="/inventory">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <Package className="mr-2 h-5 w-5" />
              Inventory
            </Button>
          </Link>
          <Link href="/ai-consultation">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <MessageSquareText className="mr-2 h-5 w-5" />
              AI Consultation
            </Button>
          </Link>
          <Link href="/tracking">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <LineChart className="mr-2 h-5 w-5" />
              Tracking AI
            </Button>
          </Link>
          <Link href="/market">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <BarChart4 className="mr-2 h-5 w-5" />
              Market AI
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <DollarSign className="mr-2 h-5 w-5" />
              Pricing
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Marketplace
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <User className="mr-2 h-5 w-5" />
              Profile
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-full border-t border-seablue-800 p-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed inset-x-0 top-0 z-50 border-b bg-seablue-900 text-white lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <MobileNav />
            <LogoLink />
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/notifications">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Top header for desktop */}
      <div className="fixed inset-x-0 top-0 z-40 border-b bg-white lg:left-64">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search inventory, products, insights..."
                className="w-full pl-8 bg-gray-50 border-none focus-visible:ring-seablue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="hidden md:block">
              <ViewToggle onViewChange={(mode) => setViewMode(mode)} />
            </div>

            <Link href="/notifications">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full overflow-hidden">
                  <Avatar className="h-8 w-8">
                    {logoLoaded && (
                      <AvatarImage
                        src="/images/aico-enhanced-logo.png"
                        alt="User"
                        className="object-contain bg-white"
                      />
                    )}
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>AiCO</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  System Owner: aicobytechain@gmail.com
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/auth/login">Log out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* View mode indicator for mobile */}
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <ViewToggle onViewChange={(mode) => setViewMode(mode)} />
      </div>

      {/* Main content */}
      <main className={`flex-1 lg:pl-64 pt-16 bg-white ${viewMode === "mobile" ? "mobile-view-active" : ""}`}>
        {children}
      </main>
    </div>
  )
}

