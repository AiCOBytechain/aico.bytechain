"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle2, Package, ShoppingCart, AlertTriangle, Clock, Settings, User } from "lucide-react"

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "Low Stock Alert",
      message: "Product B is running low on stock. Current quantity: 45 units.",
      type: "alert",
      time: "10 minutes ago",
      read: false,
      category: "inventory",
      icon: <Package className="h-5 w-5 text-yellow-500" />,
    },
    {
      id: 2,
      title: "New Order Received",
      message: "You have received a new order #1234 from Customer A.",
      type: "info",
      time: "1 hour ago",
      read: false,
      category: "orders",
      icon: <ShoppingCart className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 3,
      title: "System Update",
      message: "The system will undergo maintenance on Friday at 2:00 AM UTC.",
      type: "system",
      time: "3 hours ago",
      read: true,
      category: "system",
      icon: <Settings className="h-5 w-5 text-purple-500" />,
    },
    {
      id: 4,
      title: "AI Insight Available",
      message: "New AI-generated insights about your inventory are available.",
      type: "info",
      time: "Yesterday",
      read: true,
      category: "ai",
      icon: <Bell className="h-5 w-5 text-green-500" />,
    },
    {
      id: 5,
      title: "Critical Stock Alert",
      message: "Product F is out of stock. Please restock as soon as possible.",
      type: "alert",
      time: "Yesterday",
      read: true,
      category: "inventory",
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    },
    {
      id: 6,
      title: "New Team Member",
      message: "Jane Smith has joined your team as a Manager.",
      type: "info",
      time: "2 days ago",
      read: true,
      category: "team",
      icon: <User className="h-5 w-5 text-blue-500" />,
    },
  ]

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.category === activeTab
  })

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Notifications</h2>
        <Button variant="outline" className="flex items-center">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark All as Read
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="relative">
            All
            {unreadCount > 0 && <Badge className="ml-2 bg-seablue-600 text-white">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Bell className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm text-muted-foreground">
                  You don't have any {activeTab !== "all" ? activeTab : ""} notifications at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card key={notification.id} className={notification.read ? "opacity-80" : ""}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        {notification.title}
                        {!notification.read && <Badge className="ml-2 bg-seablue-600 text-white">New</Badge>}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {notification.time}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

