"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, FileText, Upload, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create preview for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setPreview(event.target?.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setPreview(null)
      }
    }
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // In a real app, you would implement camera capture functionality
      // For this demo, we'll just simulate it
      setTimeout(() => {
        setPreview("/placeholder.svg?height=300&width=400")
        setFile(new File([""], "camera-capture.jpg", { type: "image/jpeg" }))
      }, 1000)
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const processDocument = () => {
    if (!file) return

    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)

      // Redirect to inventory after "processing"
      setTimeout(() => {
        router.push("/inventory")
      }, 1500)
    }, 3000)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Upload Documents</h2>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Add Inventory Items</CardTitle>
          <CardDescription>
            Upload an invoice or take a picture of your items. Our AI will automatically process and organize your
            inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Document</TabsTrigger>
              <TabsTrigger value="camera">Take Picture</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {preview ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Document preview"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{file?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-seablue-100 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-seablue-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
                      <p className="text-xs text-muted-foreground">Supports PDF, JPG, PNG (max 10MB)</p>
                    </div>
                    <Input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer" asChild>
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          Browse Files
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="camera" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {preview ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Camera preview"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-seablue-100 flex items-center justify-center">
                      <Camera className="h-6 w-6 text-seablue-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Take a picture of your invoice or items</p>
                      <p className="text-xs text-muted-foreground">Position the document clearly in the frame</p>
                    </div>
                    <Button variant="outline" onClick={handleCameraCapture}>
                      <Camera className="mr-2 h-4 w-4" />
                      Open Camera
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-seablue-600 hover:bg-seablue-700"
            disabled={!file || isProcessing || isComplete}
            onClick={processDocument}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : isComplete ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Processed Successfully
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Process Document
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

