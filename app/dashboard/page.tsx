"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Package, ShoppingCart, TrendingUp, Users, Upload, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("overview")

  // Add overflow detection
  useEffect(() => {
    const scrollContainer = document.querySelector(".scrollable-container")
    if (scrollContainer) {
      const checkOverflow = () => {
        if (scrollContainer.scrollHeight > scrollContainer.clientHeight) {
          scrollContainer.classList.add("has-overflow")
        } else {
          scrollContainer.classList.remove("has-overflow")
        }
      }

      // Check on initial load and whenever window resizes
      checkOverflow()
      window.addEventListener("resize", checkOverflow)

      return () => window.removeEventListener("resize", checkOverflow)
    }
  }, [])

  // AI insights for the dashboard
  const aiInsights = [
    {
      id: 1,
      title: "Inventory Optimization",
      description: "AI analysis suggests reducing stock of Product G by 30% to optimize inventory levels.",
      type: "optimization",
    },
    {
      id: 2,
      title: "Restock Alert",
      description: "Products B, E, and H are predicted to run out within 2 weeks. Consider restocking soon.",
      type: "alert",
    },
    {
      id: 3,
      title: "Market Opportunity",
      description: "Seasonal trend analysis indicates increased demand for Category X in the next 30 days.",
      type: "opportunity",
    },
    {
      id: 4,
      title: "Overstocked Items",
      description: "6 items are identified as overstocked. Consider listing them in the marketplace.",
      type: "optimization",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Welcome back, System Owner</p>
          <div className="lg:hidden">
            <p className="text-xs text-muted-foreground">
              Use the <Menu className="inline h-4 w-4" /> menu for navigation
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-seablue-900">1,284</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-seablue-900">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-seablue-900">573</div>
            <p className="text-xs text-muted-foreground">+4.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-seablue-900">+12.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-6">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
            <CardDescription>Inventory levels over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full bg-seablue-50 rounded-md flex items-center justify-center">
              <LineChart className="h-8 w-8 text-seablue-300" />
              <span className="ml-2 text-sm text-muted-foreground">Inventory Chart</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common inventory tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/upload">
              <Button className="w-full bg-seablue-600 hover:bg-seablue-700 mb-2">
                <Upload className="mr-2 h-4 w-4" /> Upload Invoice/Image
              </Button>
            </Link>
            <Link href="/inventory">
              <Button variant="outline" className="w-full mb-2">
                <Package className="mr-2 h-4 w-4" /> View Inventory
              </Button>
            </Link>
            <Link href="/tracking">
              <Button variant="outline" className="w-full mb-2">
                <LineChart className="mr-2 h-4 w-4" /> Track Items
              </Button>
            </Link>
            <Link href="/market?tab=marketplace">
              <Button variant="outline" className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Market & Marketplace
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AiCO Insights</CardTitle>
          <CardDescription>Intelligent recommendations based on your inventory data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className={`rounded-lg border p-4 ${
                  insight.type === "alert"
                    ? "border-yellow-200 bg-yellow-50"
                    : insight.type === "opportunity"
                      ? "border-green-200 bg-green-50"
                      : "border-blue-200 bg-blue-50"
                }`}
              >
                <h3
                  className={`text-sm font-medium mb-2 ${
                    insight.type === "alert"
                      ? "text-yellow-800"
                      : insight.type === "opportunity"
                        ? "text-green-800"
                        : "text-blue-800"
                  }`}
                >
                  {insight.title}
                </h3>
                <p
                  className={`text-sm ${
                    insight.type === "alert"
                      ? "text-yellow-700"
                      : insight.type === "opportunity"
                        ? "text-green-700"
                        : "text-blue-700"
                  }`}
                >
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
