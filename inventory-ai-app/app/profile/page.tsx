"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Github, Mail, Moon, Sun, Upload } from "lucide-react"

export default function ProfilePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)

  // Preload the logo image
  useEffect(() => {
    const img = new Image()
    img.onload = () => setLogoLoaded(true)
    img.src = "/images/aico-enhanced-logo.png"
  }, [])

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Profile & Settings</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your personal information and account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <Avatar className="h-24 w-24 overflow-hidden">
                  {logoLoaded && (
                    <AvatarImage src="/images/aico-enhanced-logo.png" alt="User" className="object-contain bg-white" />
                  )}
                  <AvatarFallback className="text-lg">JD</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <h3 className="text-xl font-semibold">AiCO</h3>
                <p className="text-sm text-muted-foreground">aicobytechain@gmail.com</p>
                <Badge className="mt-1 bg-seablue-600">Admin</Badge>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="mr-2 h-4 w-4" />
                Change Avatar
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Connected Accounts</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center space-x-3">
                    <Github className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium">GitHub</p>
                      <p className="text-xs text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium">Google</p>
                      <p className="text-xs text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-4 space-y-4">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your account details and personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" defaultValue="AiCO" disabled={isLoading} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" defaultValue="Admin" disabled={isLoading} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="aicobytechain@gmail.com" disabled={isLoading} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue="aicoadmin" disabled={isLoading} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input id="company" defaultValue="AiCO Inc." disabled={isLoading} />
                    </div>

                    <Button type="submit" className="bg-seablue-600 hover:bg-seablue-700" disabled={isLoading}>
                      {isLoading ? "Saving Changes..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" disabled={isLoading} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" disabled={isLoading} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" disabled={isLoading} />
                    </div>

                    <Button type="submit" className="bg-seablue-600 hover:bg-seablue-700" disabled={isLoading}>
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how AiCO looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="theme-mode" className="text-base">
                          Dark Mode
                        </Label>
                        <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <Switch id="theme-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                        <Moon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Color Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center space-y-1">
                        <div className="h-10 w-10 rounded-full bg-seablue-600 ring-2 ring-offset-2 ring-seablue-600"></div>
                        <span className="text-xs">Sea Blue</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <div className="h-10 w-10 rounded-full bg-purple-600"></div>
                        <span className="text-xs">Purple</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <div className="h-10 w-10 rounded-full bg-green-600"></div>
                        <span className="text-xs">Green</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="compact-mode" className="text-base">
                          Compact Mode
                        </Label>
                        <p className="text-sm text-muted-foreground">Display more content with less spacing</p>
                      </div>
                      <Switch id="compact-mode" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-seablue-600 hover:bg-seablue-700">Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Email Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="inventory-alerts">Inventory Alerts</Label>
                          <p className="text-xs text-muted-foreground">Receive alerts when inventory levels are low</p>
                        </div>
                        <Switch id="inventory-alerts" defaultChecked />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="ai-insights">AI Insights</Label>
                          <p className="text-xs text-muted-foreground">
                            Get notified about important AI-generated insights
                          </p>
                        </div>
                        <Switch id="ai-insights" defaultChecked />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="marketplace-activity">Marketplace Activity</Label>
                          <p className="text-xs text-muted-foreground">
                            Updates about your marketplace listings and purchases
                          </p>
                        </div>
                        <Switch id="marketplace-activity" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">System Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="browser-notifications">Browser Notifications</Label>
                          <p className="text-xs text-muted-foreground">Show notifications in your browser</p>
                        </div>
                        <Switch id="browser-notifications" defaultChecked />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sound-alerts">Sound Alerts</Label>
                          <p className="text-xs text-muted-foreground">Play sound when notifications arrive</p>
                        </div>
                        <Switch id="sound-alerts" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-seablue-600 hover:bg-seablue-700">Save Notification Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

