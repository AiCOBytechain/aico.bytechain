"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  QrCode,
  Thermometer,
  Droplets,
  Compass,
  Clock,
  BarChart,
  Map,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Vibrate,
  Zap,
  Wifi,
} from "lucide-react"

export default function SensoryTrackerPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(false)
  const [refreshTime, setRefreshTime] = useState(new Date())

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Sample sensory data
  const sensorItems = [
    {
      id: "SC-1001",
      name: "Temperature Sensor A",
      type: "Temperature",
      location: "Warehouse A - Section 1",
      status: "Normal",
      value: "22.5°C",
      battery: "92%",
      lastUpdate: "2 minutes ago",
      signal: "Strong",
      icon: <Thermometer className="h-4 w-4 text-blue-500" />,
    },
    {
      id: "SC-1002",
      name: "Humidity Sensor B",
      type: "Humidity",
      location: "Warehouse A - Section 2",
      status: "Warning",
      value: "78%",
      battery: "45%",
      lastUpdate: "5 minutes ago",
      signal: "Medium",
      icon: <Droplets className="h-4 w-4 text-blue-500" />,
    },
    {
      id: "SC-1003",
      name: "Motion Sensor C",
      type: "Motion",
      location: "Warehouse A - Loading Dock",
      status: "Alert",
      value: "Movement Detected",
      battery: "87%",
      lastUpdate: "Just now",
      signal: "Strong",
      icon: <Vibrate className="h-4 w-4 text-blue-500" />,
    },
    {
      id: "SC-1004",
      name: "Location Tracker D",
      type: "GPS",
      location: "Delivery Vehicle #103",
      status: "Normal",
      value: "Moving - 35 mph",
      battery: "68%",
      lastUpdate: "1 minute ago",
      signal: "Strong",
      icon: <Compass className="h-4 w-4 text-blue-500" />,
    },
    {
      id: "SC-1005",
      name: "Power Monitor E",
      type: "Power",
      location: "Warehouse B - Cold Storage",
      status: "Normal",
      value: "5.2 kW",
      battery: "External Power",
      lastUpdate: "3 minutes ago",
      signal: "Strong",
      icon: <Zap className="h-4 w-4 text-blue-500" />,
    },
    {
      id: "SC-1006",
      name: "Network Sensor F",
      type: "Network",
      location: "Warehouse B - Server Room",
      status: "Normal",
      value: "98% Uptime",
      battery: "External Power",
      lastUpdate: "7 minutes ago",
      signal: "Strong",
      icon: <Wifi className="h-4 w-4 text-blue-500" />,
    },
  ]

  // Sample alert data
  const alertData = [
    {
      id: 1,
      sensor: "Humidity Sensor B",
      type: "Warning",
      message: "Humidity level above threshold (78%)",
      timestamp: "5 minutes ago",
      acknowledged: false,
    },
    {
      id: 2,
      sensor: "Motion Sensor C",
      type: "Alert",
      message: "Unexpected movement detected in loading dock area",
      timestamp: "Just now",
      acknowledged: false,
    },
    {
      id: 3,
      sensor: "Temperature Sensor G",
      type: "Critical",
      message: "Temperature exceeding safe range (32.8°C)",
      timestamp: "15 minutes ago",
      acknowledged: true,
    },
  ]

  // Function to render status indicator
  const renderStatusIndicator = (status: string) => {
    switch (status) {
      case "Normal":
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-green-700">Normal</span>
          </div>
        )
      case "Warning":
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-yellow-700">Warning</span>
          </div>
        )
      case "Alert":
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
            <span className="text-red-700">Alert</span>
          </div>
        )
      default:
        return null
    }
  }

  // Function to render alert badge
  const renderAlertBadge = (type: string) => {
    switch (type) {
      case "Warning":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{type}</Badge>
      case "Alert":
        return <Badge className="bg-red-100 text-red-800 border-red-200">{type}</Badge>
      case "Critical":
        return <Badge className="bg-red-100 text-red-800 border-red-200 font-bold">{type}</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const refreshData = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setRefreshTime(new Date())
    }, 1000)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Sensory Code Tracker</h2>
        <Button variant="outline" onClick={refreshData} disabled={isLoading} className="flex items-center">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="mr-1 h-4 w-4" />
        Last updated: {refreshTime.toLocaleTimeString()}
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sensors</CardTitle>
                <QrCode className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-seablue-900">24</div>
                <p className="text-xs text-muted-foreground">6 types across 3 locations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-seablue-900">3</div>
                <p className="text-xs text-muted-foreground">2 new in the last hour</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Battery Status</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-seablue-900">92%</div>
                <p className="text-xs text-muted-foreground">Average battery level</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network Status</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-seablue-900">100%</div>
                <p className="text-xs text-muted-foreground">All sensors connected</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Sensor Readings</CardTitle>
                <CardDescription>Real-time data from your sensory network</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full bg-seablue-50 rounded-md flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-seablue-300" />
                  <span className="ml-2 text-sm text-muted-foreground">Sensor Readings Chart</span>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest issues requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertData.slice(0, 3).map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-lg border p-3 ${
                        alert.type === "Critical"
                          ? "border-red-200 bg-red-50"
                          : alert.type === "Alert"
                            ? "border-red-200 bg-red-50"
                            : "border-yellow-200 bg-yellow-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">
                          {renderAlertBadge(alert.type)} {alert.sensor}
                        </h3>
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      </div>
                      <p className="mt-1 text-sm">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("alerts")}>
                  View All Alerts
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Sensors Tab */}
        <TabsContent value="sensors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Network</CardTitle>
              <CardDescription>Manage and monitor your sensory code trackers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search sensors..." className="w-full pl-8" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="humidity">Humidity</SelectItem>
                      <SelectItem value="motion">Motion</SelectItem>
                      <SelectItem value="gps">GPS</SelectItem>
                      <SelectItem value="power">Power</SelectItem>
                      <SelectItem value="network">Network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Sensor ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Battery</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead>Signal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sensorItems.map((sensor) => (
                        <TableRow key={sensor.id}>
                          <TableCell>{sensor.icon}</TableCell>
                          <TableCell className="font-medium">{sensor.id}</TableCell>
                          <TableCell>{sensor.name}</TableCell>
                          <TableCell>{sensor.type}</TableCell>
                          <TableCell>{sensor.location}</TableCell>
                          <TableCell>{renderStatusIndicator(sensor.status)}</TableCell>
                          <TableCell>{sensor.value}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div
                                className={`mr-2 h-2 w-8 rounded-full ${
                                  sensor.battery === "External Power"
                                    ? "bg-green-500"
                                    : Number.parseInt(sensor.battery) > 70
                                      ? "bg-green-500"
                                      : Number.parseInt(sensor.battery) > 30
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}
                              />
                              {sensor.battery}
                            </div>
                          </TableCell>
                          <TableCell>{sensor.lastUpdate}</TableCell>
                          <TableCell>{sensor.signal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                Register New Sensor
              </Button>
              <Button className="bg-seablue-600 hover:bg-seablue-700">View Sensor Details</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Management</CardTitle>
              <CardDescription>Monitor and respond to sensor alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search alerts..." className="w-full pl-8" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {alertData.map((alert) => (
                    <Card
                      key={alert.id}
                      className={`${
                        alert.type === "Critical"
                          ? "border-red-200"
                          : alert.type === "Alert"
                            ? "border-red-200"
                            : "border-yellow-200"
                      }`}
                    >
                      <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center">
                            {renderAlertBadge(alert.type)} {alert.sensor}
                          </CardTitle>
                          <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <p className="text-sm">{alert.message}</p>
                      </CardContent>
                      <CardFooter className="py-3 flex justify-between">
                        <Badge variant="outline" className={alert.acknowledged ? "bg-gray-100" : "bg-yellow-100"}>
                          {alert.acknowledged ? "Acknowledged" : "Pending"}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {!alert.acknowledged && (
                            <Button size="sm" className="bg-seablue-600 hover:bg-seablue-700">
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Map View Tab */}
        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Location Map</CardTitle>
              <CardDescription>Geographic view of your sensor network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full bg-seablue-50 rounded-md flex items-center justify-center">
                <Map className="h-8 w-8 text-seablue-300" />
                <span className="ml-2 text-sm text-muted-foreground">Interactive Sensor Map</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Normal</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Warning</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Alert</span>
                </div>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter map" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sensors</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="humidity">Humidity</SelectItem>
                  <SelectItem value="motion">Motion</SelectItem>
                  <SelectItem value="gps">GPS</SelectItem>
                </SelectContent>
              </Select>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Analytics</CardTitle>
              <CardDescription>Insights and trends from your sensor data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-[300px] w-full bg-seablue-50 rounded-md flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-seablue-300" />
                  <span className="ml-2 text-sm text-muted-foreground">Temperature Trends</span>
                </div>
                <div className="h-[300px] w-full bg-seablue-50 rounded-md flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-seablue-300" />
                  <span className="ml-2 text-sm text-muted-foreground">Humidity Trends</span>
                </div>
                <div className="h-[300px] w-full bg-seablue-50 rounded-md flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-seablue-300" />
                  <span className="ml-2 text-sm text-muted-foreground">Motion Events</span>
                </div>
                <div className="h-[300px] w-full bg-seablue-50 rounded-md flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-seablue-300" />
                  <span className="ml-2 text-sm text-muted-foreground">Battery Performance</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-seablue-600 hover:bg-seablue-700">Generate Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

