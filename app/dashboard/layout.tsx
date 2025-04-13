"use client"

import type React from "react"

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
  Upload,
  User,
  Bell,
  Search,
  DollarSign,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoLink } from "@/components/app-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ZoomControl } from "@/components/zoom-control"
import { useRouter, usePathname } from "next/navigation"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Preload the logo image
  useEffect(() => {
    const img = new Image()
    img.onload = () => setLogoLoaded(true)
    img.src = "/images/aico-enhanced-logo.png"
  }, [])

  // Navigation items with paths
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="mr-2 h-5 w-5" /> },
    { name: "Upload Documents", path: "/upload", icon: <Upload className="mr-2 h-5 w-5" /> },
    { name: "Inventory", path: "/inventory", icon: <Package className="mr-2 h-5 w-5" /> },
    { name: "AI Consultation", path: "/ai-consultation", icon: <MessageSquareText className="mr-2 h-5 w-5" /> },
    { name: "Tracking AI", path: "/tracking", icon: <LineChart className="mr-2 h-5 w-5" /> },
    { name: "Market AI", path: "/market", icon: <BarChart4 className="mr-2 h-5 w-5" /> },
    { name: "Pricing", path: "/pricing", icon: <DollarSign className="mr-2 h-5 w-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="mr-2 h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="mr-2 h-5 w-5" /> },
  ]

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get("search") as string

    if (searchQuery.trim()) {
      // In a real app, this would navigate to search results
      alert(`Searching for: ${searchQuery}`)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 bg-seablue-900 text-white lg:block">
        <div className="flex h-16 items-center border-b border-seablue-800 px-6">
          <LogoLink />
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link href={item.path} key={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:bg-seablue-800 ${
                  pathname === item.path ? "bg-seablue-800" : ""
                }`}
              >
                {item.icon}
                {item.name}
              </Button>
            </Link>
          ))}
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

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />

          {/* Mobile sidebar */}
          <div className="absolute inset-y-0 left-0 w-64 bg-seablue-900 text-white">
            <div className="flex h-16 items-center justify-between border-b border-seablue-800 px-6">
              <LogoLink />
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-seablue-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-1 px-3 py-4">
              {navItems.map((item) => (
                <Link href={item.path} key={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-white hover:bg-seablue-800 ${
                      pathname === item.path ? "bg-seablue-800" : ""
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-0 w-full border-t border-seablue-800 p-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-seablue-800">
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile header with hamburger menu */}
      <div className="fixed inset-x-0 top-0 z-40 border-b bg-seablue-900 text-white lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-white hover:bg-seablue-800"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <LogoLink />
          </div>
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Top header for desktop */}
      <div className="fixed inset-x-0 top-0 z-30 border-b bg-white/80 backdrop-blur-sm lg:left-64">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex-1 flex items-center">
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="Search inventory, products, insights..."
                className="w-full pl-8 bg-gray-50 border-none focus-visible:ring-seablue-500"
              />
            </form>
          </div>
          <div className="flex items-center space-x-4">
            {/* Zoom Control */}
            <div className="hidden md:block">
              <ZoomControl />
            </div>

            <Button variant="ghost" size="icon" onClick={() => router.push("/notifications")}>
              <Bell className="h-5 w-5" />
            </Button>
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

      {/* Zoom control for mobile */}
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <ZoomControl />
      </div>

      {/* Main content with scrollable container */}
      <main className="flex-1 lg:pl-64 pt-16 bg-transparent flex flex-col">
        <div className="scrollable-container flex-1 overflow-auto m-4 rounded-lg">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm min-h-full zoom-content">{children}</div>
        </div>
      </main>
    </div>
  )
}
