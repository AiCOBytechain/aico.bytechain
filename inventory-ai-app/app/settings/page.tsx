"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Globe,
  Users,
  ShieldCheck,
  ClipboardList,
  Zap,
  Trash2,
  Edit,
  Plus,
  Search,
  UserPlus,
  Clock,
  LogIn,
  Settings,
  FileEdit,
  UserCog,
  UserMinus,
  Filter,
} from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)

  // Sample team members data
  const teamMembers = [
    {
      id: 1,
      name: "AiCO Admin",
      email: "aicobytechain@gmail.com",
      role: "Admin",
      status: "Active",
      lastActive: "Today, 10:30 AM",
      avatar: "/images/aico-enhanced-logo.png",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@aico.com",
      role: "Manager",
      status: "Active",
      lastActive: "Today, 9:15 AM",
      avatar: null,
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@aico.com",
      role: "Viewer",
      status: "Inactive",
      lastActive: "Yesterday, 4:45 PM",
      avatar: null,
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@aico.com",
      role: "Manager",
      status: "Active",
      lastActive: "Today, 11:20 AM",
      avatar: null,
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael.wilson@aico.com",
      role: "Viewer",
      status: "Active",
      lastActive: "Yesterday, 2:30 PM",
      avatar: null,
    },
  ]

  // Sample activity logs
  const activityLogs = [
    {
      id: 1,
      user: "AiCO Admin",
      action: "Logged in",
      resource: "System",
      timestamp: "Today, 10:30 AM",
      ipAddress: "192.168.1.1",
      icon: <LogIn className="h-4 w-4 text-seablue-600" />,
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Updated inventory item",
      resource: "Product A",
      timestamp: "Today, 9:45 AM",
      ipAddress: "192.168.1.2",
      icon: <FileEdit className="h-4 w-4 text-amber-600" />,
    },
    {
      id: 3,
      user: "AiCO Admin",
      action: "Changed system settings",
      resource: "Performance Settings",
      timestamp: "Yesterday, 4:15 PM",
      ipAddress: "192.168.1.1",
      icon: <Settings className="h-4 w-4 text-purple-600" />,
    },
    {
      id: 4,
      user: "Robert Johnson",
      action: "Added team member",
      resource: "Emily Davis",
      timestamp: "Yesterday, 2:30 PM",
      ipAddress: "192.168.1.3",
      icon: <UserPlus className="h-4 w-4 text-green-600" />,
    },
    {
      id: 5,
      user: "Jane Smith",
      action: "Removed team member",
      resource: "Alex Thompson",
      timestamp: "2 days ago, 11:20 AM",
      ipAddress: "192.168.1.2",
      icon: <UserMinus className="h-4 w-4 text-red-600" />,
    },
    {
      id: 6,
      user: "AiCO Admin",
      action: "Changed user role",
      resource: "Jane Smith → Manager",
      timestamp: "2 days ago, 10:05 AM",
      ipAddress: "192.168.1.1",
      icon: <UserCog className="h-4 w-4 text-amber-600" />,
    },
  ]

  // Function to get avatar fallback initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Function to get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "Manager":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Viewer":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Settings</h2>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="performance" className="flex items-center">
            <Zap className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
            <span className="sm:hidden">Perf</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Language</span>
            <span className="sm:hidden">Lang</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
            <span className="sm:hidden">Team</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center">
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Roles & Access</span>
            <span className="sm:hidden">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center">
            <ClipboardList className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Activity Logs</span>
            <span className="sm:hidden">Logs</span>
          </TabsTrigger>
        </TabsList>

        {/* Performance Settings */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-seablue-600" />
                Performance Settings
              </CardTitle>
              <CardDescription>Optimize the application performance based on your needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Performance</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cache-data">Cache Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Store frequently accessed data locally for faster access
                      </p>
                    </div>
                    <Switch id="cache-data" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="background-sync">Background Synchronization</Label>
                      <p className="text-sm text-muted-foreground">
                        Sync data in the background to improve responsiveness
                      </p>
                    </div>
                    <Switch id="background-sync" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="prefetch-data">Prefetch Data</Label>
                      <p className="text-sm text-muted-foreground">Preload data that might be needed soon</p>
                    </div>
                    <Switch id="prefetch-data" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Resource Usage</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="memory-limit">Memory Usage Limit</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Control how much memory the application can use
                    </p>
                    <Select defaultValue="medium">
                      <SelectTrigger id="memory-limit">
                        <SelectValue placeholder="Select memory limit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Conserve memory)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="high">High (Maximum performance)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="data-batch-size">Data Batch Size</Label>
                    <p className="text-sm text-muted-foreground mb-2">Number of records to process at once</p>
                    <Select defaultValue="medium">
                      <SelectTrigger id="data-batch-size">
                        <SelectValue placeholder="Select batch size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (50 records)</SelectItem>
                        <SelectItem value="medium">Medium (100 records)</SelectItem>
                        <SelectItem value="large">Large (250 records)</SelectItem>
                        <SelectItem value="xlarge">Extra Large (500 records)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">AI Processing</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ai-background">AI Background Processing</Label>
                      <p className="text-sm text-muted-foreground">Process AI tasks in the background</p>
                    </div>
                    <Switch id="ai-background" defaultChecked />
                  </div>

                  <div>
                    <Label htmlFor="ai-precision">AI Model Precision</Label>
                    <p className="text-sm text-muted-foreground mb-2">Balance between accuracy and performance</p>
                    <Select defaultValue="balanced">
                      <SelectTrigger id="ai-precision">
                        <SelectValue placeholder="Select AI precision" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="speed">Speed Optimized (Faster, less accurate)</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="accuracy">Accuracy Optimized (Slower, more accurate)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-seablue-600 hover:bg-seablue-700">Save Performance Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Language Settings */}
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5 text-seablue-600" />
                Language Preferences
              </CardTitle>
              <CardDescription>Customize language and localization settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Interface Language</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="display-language">Display Language</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Language used throughout the application interface
                    </p>
                    <Select defaultValue="en-US">
                      <SelectTrigger id="display-language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (United States)</SelectItem>
                        <SelectItem value="en-GB">English (United Kingdom)</SelectItem>
                        <SelectItem value="es-ES">Spanish (Spain)</SelectItem>
                        <SelectItem value="fr-FR">French (France)</SelectItem>
                        <SelectItem value="de-DE">German (Germany)</SelectItem>
                        <SelectItem value="ja-JP">Japanese (Japan)</SelectItem>
                        <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Date & Time Format</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date-format">Date Format</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      How dates are displayed throughout the application
                    </p>
                    <Select defaultValue="MM/DD/YYYY">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (e.g., 12/31/2023)</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (e.g., 31/12/2023)</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (e.g., 2023-12-31)</SelectItem>
                        <SelectItem value="MMM DD, YYYY">MMM DD, YYYY (e.g., Dec 31, 2023)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="time-format">Time Format</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      How times are displayed throughout the application
                    </p>
                    <Select defaultValue="12hour">
                      <SelectTrigger id="time-format">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12hour">12-hour (e.g., 2:30 PM)</SelectItem>
                        <SelectItem value="24hour">24-hour (e.g., 14:30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Time Zone</Label>
                    <p className="text-sm text-muted-foreground mb-2">Time zone used for displaying dates and times</p>
                    <Select defaultValue="auto">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-detect from browser</SelectItem>
                        <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                        <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                        <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                        <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                        <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
                        <SelectItem value="cet">CET (Central European Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Number & Currency Format</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="number-format">Number Format</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      How numbers are displayed throughout the application
                    </p>
                    <Select defaultValue="us">
                      <SelectTrigger id="number-format">
                        <SelectValue placeholder="Select number format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">US (e.g., 1,234.56)</SelectItem>
                        <SelectItem value="eu">European (e.g., 1.234,56)</SelectItem>
                        <SelectItem value="in">Indian (e.g., 1,23,456.78)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <p className="text-sm text-muted-foreground mb-2">Primary currency used for financial values</p>
                    <Select defaultValue="usd">
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($) - US Dollar</SelectItem>
                        <SelectItem value="eur">EUR (€) - Euro</SelectItem>
                        <SelectItem value="gbp">GBP (£) - British Pound</SelectItem>
                        <SelectItem value="jpy">JPY (¥) - Japanese Yen</SelectItem>
                        <SelectItem value="cny">CNY (¥) - Chinese Yuan</SelectItem>
                        <SelectItem value="inr">INR (₹) - Indian Rupee</SelectItem>
                        <SelectItem value="cad">CAD ($) - Canadian Dollar</SelectItem>
                        <SelectItem value="aud">AUD ($) - Australian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-seablue-600 hover:bg-seablue-700">Save Language Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Team Management */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-seablue-600" />
                Team Management
              </CardTitle>
              <CardDescription>Add, remove, and manage team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search team members..." className="pl-8" />
                </div>
                <Button className="bg-seablue-600 hover:bg-seablue-700">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              {member.avatar ? <AvatarImage src={member.avatar} alt={member.name} /> : null}
                              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleBadgeColor(member.role)}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${
                                member.status === "Active" ? "bg-green-500" : "bg-gray-300"
                              }`}
                            />
                            {member.status}
                          </div>
                        </TableCell>
                        <TableCell>{member.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Showing 5 of 5 team members</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Export Team List</Button>
              <Button className="bg-seablue-600 hover:bg-seablue-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Roles & Access Control */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5 text-seablue-600" />
                Roles & Access Control
              </CardTitle>
              <CardDescription>Manage role-based permissions and access levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Role Definitions</h3>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base flex items-center">
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 mr-2">
                          Admin
                        </Badge>
                        Administrator Role
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-sm text-muted-foreground mb-3">Full system access with all permissions</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">Manage team members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">Configure system settings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">Manage roles & permissions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">View activity logs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">Full inventory control</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">Access all AI features</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="py-3">
                      <Button variant="outline" size="sm">
                        Edit Role
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base flex items-center">
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mr-2">
                          Manager
                        </Badge>
                        Manager Role
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-sm text-muted-foreground mb-3">
                        Operational access with limited administrative capabilities
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">Manage inventory</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">Access AI insights</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">View team members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">View activity logs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-sm">Cannot manage roles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-sm">Cannot change system settings</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="py-3">
                      <Button variant="outline" size="sm">
                        Edit Role
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-base flex items-center">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 mr-2">
                          Viewer
                        </Badge>
                        Viewer Role
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-sm text-muted-foreground mb-3">Read-only access with limited functionality</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">View inventory</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">View AI insights</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-sm">Cannot modify inventory</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-sm">Cannot manage team</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-sm">Cannot access settings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-sm">Cannot view activity logs</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="py-3">
                      <Button variant="outline" size="sm">
                        Edit Role
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Custom Roles</h3>
                  <Button size="sm" className="bg-seablue-600 hover:bg-seablue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Custom Role
                  </Button>
                </div>

                <div className="rounded-md border p-6 flex flex-col items-center justify-center text-center space-y-2">
                  <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                  <h4 className="text-sm font-medium">No Custom Roles</h4>
                  <p className="text-sm text-muted-foreground">
                    You haven't created any custom roles yet. Custom roles allow you to define specific permissions for
                    different team members.
                  </p>
                  <Button size="sm" className="mt-2 bg-seablue-600 hover:bg-seablue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Custom Role
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Permission Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enforce-2fa">Enforce Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require all users to set up 2FA for enhanced security
                      </p>
                    </div>
                    <Switch id="enforce-2fa" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="session-timeout">Automatic Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out inactive users after a period of time
                      </p>
                    </div>
                    <Switch id="session-timeout" defaultChecked />
                  </div>

                  <div>
                    <Label htmlFor="timeout-duration">Session Timeout Duration</Label>
                    <p className="text-sm text-muted-foreground mb-2">How long before inactive users are logged out</p>
                    <Select defaultValue="60">
                      <SelectTrigger id="timeout-duration">
                        <SelectValue placeholder="Select timeout duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-seablue-600 hover:bg-seablue-700">Save Access Control Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Activity Logs */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="mr-2 h-5 w-5 text-seablue-600" />
                Activity Logs & History
              </CardTitle>
              <CardDescription>Track user actions and system events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search activity logs..." className="pl-8" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline">
                    <Clock className="mr-2 h-4 w-4" />
                    Date Range
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.icon}</TableCell>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Showing 6 of 24 activities</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Log Settings</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="log-retention">Log Retention Period</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      How long to keep activity logs before automatic deletion
                    </p>
                    <Select defaultValue="90">
                      <SelectTrigger id="log-retention">
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">6 months</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="log-login-attempts">Log Failed Login Attempts</Label>
                      <p className="text-sm text-muted-foreground">
                        Track unsuccessful login attempts for security monitoring
                      </p>
                    </div>
                    <Switch id="log-login-attempts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="log-data-exports">Log Data Exports</Label>
                      <p className="text-sm text-muted-foreground">Track when data is exported from the system</p>
                    </div>
                    <Switch id="log-data-exports" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="log-settings-changes">Log Settings Changes</Label>
                      <p className="text-sm text-muted-foreground">Track changes to system settings</p>
                    </div>
                    <Switch id="log-settings-changes" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Export Activity Logs</Button>
              <Button className="bg-seablue-600 hover:bg-seablue-700">Save Log Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

