"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Github, Mail, Moon, Sun, Upload, Camera, Trash2, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useProfile } from "@/hooks/use-profile"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ProfilePage() {
  // Use our profile hook
  const {
    profile,
    isLoading: isProfileLoading,
    isSaving,
    errors,
    updateProfile,
    updateAvatar,
    removeAvatar,
  } = useProfile()

  // Local state
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    company: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Initialize form values from profile
  useEffect(() => {
    if (profile) {
      setFormValues({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        username: profile.username || "",
        company: profile.company || "",
      })

      // Set dark mode from profile settings
      setIsDarkMode(profile.settings.darkMode)
    }
  }, [profile])

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Generate a color based on the user's name (for consistent avatar background)
  const getAvatarColor = (name: string) => {
    if (!name) return "hsl(215, 65%, 55%)"

    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    const hue = Math.abs(hash % 360)
    return `hsl(${hue}, 65%, 55%)`
  }

  // Get available cameras
  const getAvailableCameras = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      return
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === "videoinput")
      setAvailableCameras(videoDevices)

      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId)
      }
    } catch (error) {
      console.error("Error getting cameras:", error)
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  // Handle camera stream when camera is opened
  useEffect(() => {
    if (typeof window === "undefined") return

    if (isCameraOpen && videoRef.current && selectedCamera) {
      const startCamera = async () => {
        try {
          // Stop any existing stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
          }

          // Start new stream with selected camera
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          })

          streamRef.current = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (error) {
          console.error("Error accessing camera:", error)
          toast({
            title: "Camera Error",
            description: "Could not access your camera. Please check permissions.",
            variant: "destructive",
          })
        }
      }

      startCamera()

      // Cleanup function
      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }
      }
    }
  }, [isCameraOpen, selectedCamera])

  // Initialize camera detection when camera dialog opens
  useEffect(() => {
    if (isCameraOpen) {
      getAvailableCameras()
    }
  }, [isCameraOpen])

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formValues.firstName.trim()) {
      errors.firstName = "First name is required"
    }

    if (!formValues.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (formValues.username.trim() && formValues.username.length < 3) {
      errors.username = "Username must be at least 3 characters"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setFormSubmitted(true)

    // Update profile
    const success = await updateProfile({
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      username: formValues.username,
      company: formValues.company || undefined,
    })

    if (success) {
      setFormSubmitted(false)
    }
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPEG, PNG, etc.).",
          variant: "destructive",
        })
        return
      }

      setIsUploading(true)

      try {
        // Create a FileReader to read the image
        const reader = new FileReader()
        reader.onload = async (event) => {
          if (event.target && event.target.result) {
            const imageDataUrl = event.target.result as string

            // Save avatar
            await updateAvatar(imageDataUrl)
            setIsUploading(false)
          }
        }
        reader.onerror = () => {
          throw new Error("Failed to read file")
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error("Error uploading file:", error)
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        })
        setIsUploading(false)
      }
    }
  }

  const openFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const openCamera = () => {
    setIsCameraOpen(true)
  }

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the video frame to the canvas
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        try {
          // Convert canvas to data URL
          const imageDataUrl = canvas.toDataURL("image/jpeg", 0.95)

          // Save avatar
          await updateAvatar(imageDataUrl)

          // Close camera dialog
          setIsCameraOpen(false)

          // Stop camera stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
          }
        } catch (error) {
          console.error("Error capturing photo:", error)
          toast({
            title: "Capture Error",
            description: "Failed to capture photo. Please try again.",
            variant: "destructive",
          })
        }
      }
    }
  }

  const handleRemoveAvatar = async () => {
    await removeAvatar()
  }

  const switchCamera = () => {
    if (availableCameras.length > 1) {
      const currentIndex = availableCameras.findIndex((camera) => camera.deviceId === selectedCamera)
      const nextIndex = (currentIndex + 1) % availableCameras.length
      setSelectedCamera(availableCameras[nextIndex].deviceId)
    }
  }

  // Handle dark mode toggle
  const handleDarkModeToggle = async (checked: boolean) => {
    setIsDarkMode(checked)

    // Update profile settings
    if (profile) {
      await updateProfile({
        settings: {
          ...profile.settings,
          darkMode: checked,
        },
      })
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Loading state
  if (isProfileLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-seablue-600" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Profile & Settings</h2>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

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
                  {profile?.avatar ? (
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt="User" className="object-cover" />
                  ) : (
                    <AvatarFallback
                      className="text-lg"
                      style={{ backgroundColor: getAvatarColor(profile?.firstName || "") }}
                    >
                      {getInitials(`${profile?.firstName || ""} ${profile?.lastName || ""}`)}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
                {isSaving && !isUploading && (
                  <div className="absolute top-0 right-0 bg-seablue-600 rounded-full p-1">
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center space-y-1">
                <h3 className="text-xl font-semibold">
                  {profile?.firstName} {profile?.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                <Badge className="mt-1 bg-seablue-600">{profile?.role}</Badge>
              </div>
              <div className="flex space-x-2">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                <Button variant="outline" size="sm" onClick={openFileUpload} disabled={isUploading || isSaving}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
                <Button variant="outline" size="sm" onClick={openCamera} disabled={isUploading || isSaving}>
                  <Camera className="mr-2 h-4 w-4" />
                  Camera
                </Button>
                {profile?.avatar && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    disabled={isUploading || isSaving}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
              {profile?.lastUpdated && (
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(profile.lastUpdated).toLocaleString()}
                </p>
              )}
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
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formValues.firstName}
                          onChange={handleInputChange}
                          disabled={isSaving}
                          className={formErrors.firstName ? "border-red-500" : ""}
                        />
                        {formErrors.firstName && <p className="text-xs text-red-500">{formErrors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formValues.lastName}
                          onChange={handleInputChange}
                          disabled={isSaving}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formValues.email}
                        onChange={handleInputChange}
                        disabled={isSaving}
                        className={formErrors.email ? "border-red-500" : ""}
                      />
                      {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formValues.username}
                        onChange={handleInputChange}
                        disabled={isSaving}
                        className={formErrors.username ? "border-red-500" : ""}
                      />
                      {formErrors.username && <p className="text-xs text-red-500">{formErrors.username}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formValues.company}
                        onChange={handleInputChange}
                        disabled={isSaving}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="bg-seablue-600 hover:bg-seablue-700"
                      disabled={isSaving || formSubmitted}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>

                    {formSubmitted && !isSaving && (
                      <div className="flex items-center text-green-600 mt-2">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">Changes saved successfully!</span>
                      </div>
                    )}
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
                      <Input id="current-password" type="password" disabled={isSaving} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" disabled={isSaving} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" disabled={isSaving} />
                    </div>

                    <Button type="submit" className="bg-seablue-600 hover:bg-seablue-700" disabled={isSaving}>
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
                        <Switch
                          id="theme-mode"
                          checked={isDarkMode}
                          onCheckedChange={handleDarkModeToggle}
                          disabled={isSaving}
                        />
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
                      <Switch id="compact-mode" disabled={isSaving} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-seablue-600 hover:bg-seablue-700" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
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
                        <Switch
                          id="inventory-alerts"
                          defaultChecked={profile?.settings.notifications.email}
                          disabled={isSaving}
                        />
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
                        <Switch
                          id="ai-insights"
                          defaultChecked={profile?.settings.notifications.email}
                          disabled={isSaving}
                        />
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
                        <Switch id="marketplace-activity" defaultChecked={false} disabled={isSaving} />
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
                        <Switch
                          id="browser-notifications"
                          defaultChecked={profile?.settings.notifications.browser}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sound-alerts">Sound Alerts</Label>
                          <p className="text-xs text-muted-foreground">Play sound when notifications arrive</p>
                        </div>
                        <Switch id="sound-alerts" defaultChecked={false} disabled={isSaving} />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-seablue-600 hover:bg-seablue-700" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Notification Settings"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Camera Dialog */}
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Take Profile Photo</DialogTitle>
            <DialogDescription>Position yourself in the frame and take a photo for your profile.</DialogDescription>
          </DialogHeader>
          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <video ref={videoRef} autoPlay playsInline className="w-full h-auto" style={{ maxHeight: "60vh" }} />
            </div>
            {/* Hidden canvas for capturing the image */}
            <canvas ref={canvasRef} className="hidden" />

            {availableCameras.length > 1 && (
              <Button variant="outline" size="sm" className="absolute top-2 right-2 bg-white/80" onClick={switchCamera}>
                <Camera className="h-4 w-4 mr-1" />
                Switch
              </Button>
            )}
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={capturePhoto} className="bg-seablue-600 hover:bg-seablue-700">
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
