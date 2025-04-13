"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, Truck, Clock, CheckCircle, ShoppingBag } from "lucide-react"

export default function OrdersPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("active")

  // Sample orders data
  const orders = [
    {
      id: "ORD-2023-1001",
      date: "2023-11-20",
      status: "Processing",
      total: 349.97,
      items: [
        { name: "Wireless Keyboard", quantity: 2, price: 89.99 },
        { name: "Ergonomic Mouse", quantity: 1, price: 39.99 },
        { name: "USB-C Hub", quantity: 3, price: 45.99 },
      ],
    },
    {
      id: "ORD-2023-0985",
      date: "2023-11-15",
      status: "Shipped",
      total: 249.99,
      items: [{ name: "Premium Office Chair", quantity: 1, price: 249.99 }],
    },
    {
      id: "ORD-2023-0954",
      date: "2023-11-10",
      status: "Delivered",
      total: 169.99,
      items: [{ name: "Portable Monitor", quantity: 1, price: 169.99 }],
    },
  ]

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="h-3 w-3 mr-1" /> {status}
          </Badge>
        )
      case "Shipped":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Truck className="h-3 w-3 mr-1" /> {status}
          </Badge>
        )
      case "Delivered":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> {status}
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="hidden md:flex">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-3xl font-bold tracking-tight text-seablue-900">My Orders</h2>
        </div>
        <Button variant="outline" onClick={() => router.push("/market?tab=marketplace")}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed Orders</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {orders
            .filter((order) => order.status !== "Delivered")
            .map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    {renderStatusBadge(order.status)}
                  </div>
                  <CardDescription>Ordered on {order.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-1 border-b last:border-0">
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 font-medium">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {orders
            .filter((order) => order.status === "Delivered")
            .map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    {renderStatusBadge(order.status)}
                  </div>
                  <CardDescription>Ordered on {order.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-1 border-b last:border-0">
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 font-medium">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Cancelled Orders</h3>
            <p className="text-muted-foreground mt-1">You don't have any cancelled orders at the moment.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
