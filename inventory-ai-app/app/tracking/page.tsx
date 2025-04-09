import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, PieChart, TrendingDown, TrendingUp, Search, Calendar, QrCode } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function TrackingAIPage() {
  // Sample tracking history data
  const trackingHistory = [
    {
      id: 1,
      productId: "P-1001",
      productName: "Product A",
      event: "Stock Added",
      quantity: 50,
      date: "2023-11-15 09:30",
      location: "Warehouse A",
      user: "John Doe",
    },
    {
      id: 2,
      productId: "P-1002",
      productName: "Product B",
      event: "Stock Removed",
      quantity: 5,
      date: "2023-11-14 14:45",
      location: "Store #103",
      user: "Jane Smith",
    },
    {
      id: 3,
      productId: "P-1003",
      productName: "Product C",
      event: "Inventory Adjusted",
      quantity: 10,
      date: "2023-11-14 11:20",
      location: "Warehouse B",
      user: "Mike Johnson",
    },
    {
      id: 4,
      productId: "P-1001",
      productName: "Product A",
      event: "Stock Transferred",
      quantity: 20,
      date: "2023-11-13 16:15",
      location: "Warehouse A → Store #105",
      user: "Sarah Williams",
    },
    {
      id: 5,
      productId: "P-1004",
      productName: "Product D",
      event: "Stock Added",
      quantity: 75,
      date: "2023-11-12 10:00",
      location: "Warehouse A",
      user: "John Doe",
    },
    {
      id: 6,
      productId: "P-1005",
      productName: "Product E",
      event: "Low Stock Alert",
      quantity: 10,
      date: "2023-11-11 08:30",
      location: "Store #102",
      user: "System",
    },
    {
      id: 7,
      productId: "P-1006",
      productName: "Product F",
      event: "Out of Stock",
      quantity: 0,
      date: "2023-11-10 17:45",
      location: "All Locations",
      user: "System",
    },
  ]

  // Function to render event badge
  const renderEventBadge = (event: string) => {
    switch (event) {
      case "Stock Added":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{event}</Badge>
      case "Stock Removed":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{event}</Badge>
      case "Stock Transferred":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{event}</Badge>
      case "Inventory Adjusted":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{event}</Badge>
      case "Low Stock Alert":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{event}</Badge>
      case "Out of Stock":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{event}</Badge>
      default:
        return <Badge variant="outline">{event}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Tracking AI</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Turnover Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-seablue-900">4.2x</div>
            <p className="text-xs text-muted-foreground">+0.5x from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Days in Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-seablue-900">32 days</div>
            <p className="text-xs text-muted-foreground">-5 days from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stockout Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-seablue-900">2.3%</div>
            <p className="text-xs text-muted-foreground">-1.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-seablue-900">98.7%</div>
            <p className="text-xs text-muted-foreground">+0.8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Tracking History</TabsTrigger>
          <TabsTrigger value="movement">Inventory Movement</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="sensory">Sensory Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Item Tracking History</CardTitle>
              <CardDescription>Track all inventory movements and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search by product ID or name..." className="w-full pl-8" />
                  </div>
                  <Button variant="outline" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Date Range
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>User</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trackingHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.productId}</TableCell>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{renderEventBadge(item.event)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{item.user}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Inventory Movement Trends</CardTitle>
                <CardDescription>Track how your inventory is moving over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full bg-seablue-50 rounded-md flex items-center justify-center">
                  <LineChart className="h-8 w-8 text-seablue-300" />
                  <span className="ml-2 text-sm text-muted-foreground">Movement Trend Chart</span>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Inventory distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-seablue-50 rounded-md flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-seablue-300" />
                  <span className="ml-2 text-sm text-muted-foreground">Category Distribution Chart</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>AI Inventory Predictions</CardTitle>
              <CardDescription>AI-powered predictions for inventory needs</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px] w-full bg-seablue-50 rounded-md flex items-center justify-center">
                <LineChart className="h-8 w-8 text-seablue-300" />
                <span className="ml-2 text-sm text-muted-foreground">Prediction Chart</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sensory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensory Code Tracking</CardTitle>
              <CardDescription>Monitor your inventory with IoT sensors and tracking codes</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
                <div className="rounded-full bg-seablue-100 p-4">
                  <QrCode className="h-10 w-10 text-seablue-600" />
                </div>
                <h3 className="text-xl font-medium">Advanced Sensory Tracking</h3>
                <p className="max-w-[500px] text-muted-foreground">
                  Monitor temperature, humidity, location, and movement of your inventory in real-time with our advanced
                  sensory tracking system.
                </p>
                <Link href="/tracking/sensory-tracker">
                  <Button className="mt-2 bg-seablue-600 hover:bg-seablue-700">Open Sensory Tracker</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

