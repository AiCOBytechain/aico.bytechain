"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Camera,
  FileText,
  Upload,
  Check,
  Loader2,
  Edit,
  Download,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  Scan,
  AlertTriangle,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { DocumentCamera } from "@/components/document-camera"
import { DocumentScanResults } from "@/components/document-scan-results"
import { scanDocument, type ExtractedItem, type DocumentAnalysis } from "@/utils/document-scanner"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [recognizedItems, setRecognizedItems] = useState<any[]>([])
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<{ name: string; quantity: string; price: string; category: string }>({
    name: "",
    quantity: "",
    price: "",
    category: "",
  })
  const [showTemplateOptions, setShowTemplateOptions] = useState(false)
  const [templateType, setTemplateType] = useState("inventory")
  const router = useRouter()

  // Camera related states
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // AI document scanner states
  const [documentScanActive, setDocumentScanActive] = useState(false)
  const [scanResults, setScanResults] = useState<DocumentAnalysis | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }

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

      // Reset scan results when a new file is selected
      setScanResults(null)
      setIsComplete(false)
    }
  }

  const handleCameraCapture = () => {
    setIsCameraOpen(true)
    setDocumentScanActive(false)
  }

  const handleDocumentScannerOpen = () => {
    setDocumentScanActive(true)
  }

  const handleDocumentCapture = async (imageData: string) => {
    try {
      setPreview(imageData)
      setDocumentScanActive(false)

      // Create a file from the image data
      const response = await fetch(imageData)
      const blob = await response.blob()
      const capturedFile = new File([blob], "document-scan.jpg", { type: "image/jpeg" })
      setFile(capturedFile)

      // Automatically process the document
      processDocumentWithAI(imageData)
    } catch (error) {
      console.error("Error handling document capture:", error)
      toast({
        title: "Error",
        description: "Failed to process the captured document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCameraClose = () => {
    setIsCameraOpen(false)
    setDocumentScanActive(false)

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }

  const switchCamera = () => {
    if (availableCameras.length > 1) {
      const currentIndex = availableCameras.findIndex((camera) => camera.deviceId === selectedCamera)
      const nextIndex = (currentIndex + 1) % availableCameras.length
      setSelectedCamera(availableCameras[nextIndex].deviceId)
    }
  }

  const capturePhoto = () => {
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

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a File object from the blob
              const capturedFile = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
              setFile(capturedFile)

              // Create preview
              const imageUrl = URL.createObjectURL(blob)
              setPreview(imageUrl)

              // Close camera dialog
              setIsCameraOpen(false)

              // Stop camera stream
              if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
              }
            }
          },
          "image/jpeg",
          0.95,
        )
      }
    }
  }

  const processDocumentWithAI = async (imageData: string | Blob) => {
    if (!imageData) {
      if (!file && !preview) {
        toast({
          title: "No document selected",
          description: "Please select or capture a document first.",
          variant: "destructive",
        })
        return
      }

      // Use the current file or preview
      imageData = preview || (file as Blob)
    }

    setIsScanning(true)
    setScanError(null)

    try {
      // Scan the document using our AI scanner
      const analysis = await scanDocument(imageData)

      // Update state with scan results
      setScanResults(analysis)

      // Also update recognized items for backward compatibility
      setRecognizedItems(
        analysis.scanResult.items.map((item) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: item.name,
          quantity: item.quantity || 1,
          price: item.price || 0,
          category: item.category || "Other",
          status: "In Stock",
        })),
      )

      setIsComplete(true)

      toast({
        title: "Document Scanned Successfully",
        description: `${analysis.scanResult.items.length} items detected in the document.`,
      })
    } catch (error) {
      console.error("Error scanning document:", error)
      setScanError(error instanceof Error ? error.message : "An unknown error occurred")

      toast({
        title: "Scanning Error",
        description: "Failed to scan the document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  const processDocument = () => {
    if (!file) return

    setIsProcessing(true)

    // Use AI document scanner instead of the old processing logic
    processDocumentWithAI(file).finally(() => {
      setIsProcessing(false)
    })
  }

  const startEditing = (index: number) => {
    const item = recognizedItems[index]
    setEditingItem(index)
    setEditValues({
      name: item.name,
      quantity: item.quantity.toString(),
      category: item.category,
      price: item.price.toString(),
    })
  }

  const saveEdit = (index: number) => {
    const updatedItems = [...recognizedItems]
    updatedItems[index] = {
      ...updatedItems[index],
      name: editValues.name,
      quantity: Number.parseInt(editValues.quantity),
      price: Number.parseFloat(editValues.price),
      category: editValues.category,
    }

    setRecognizedItems(updatedItems)
    setEditingItem(null)
  }

  const handleEditChange = (field: string, value: string) => {
    setEditValues({
      ...editValues,
      [field]: value,
    })
  }

  const addNewItem = () => {
    const newItem = {
      id: recognizedItems.length + 1,
      name: "New Item",
      quantity: 1,
      price: 0.0,
      category: "Other",
    }

    setRecognizedItems([...recognizedItems, newItem])
    setEditingItem(recognizedItems.length)
    setEditValues({
      name: newItem.name,
      quantity: newItem.quantity.toString(),
      price: newItem.price.toString(),
      category: newItem.category,
    })
  }

  const deleteItem = (index: number) => {
    const updatedItems = [...recognizedItems]
    updatedItems.splice(index, 1)
    setRecognizedItems(updatedItems)
  }

  const handleEditExtractedItem = (item: ExtractedItem, index: number) => {
    // This would open a dialog to edit the item
    startEditing(index)
  }

  const handleDeleteExtractedItem = (index: number) => {
    deleteItem(index)

    // Also update scan results if they exist
    if (scanResults) {
      const updatedInsights = [...scanResults.insights]
      updatedInsights.splice(index, 1)

      setScanResults({
        ...scanResults,
        insights: updatedInsights,
        summary: `Updated: ${updatedInsights.length} items remaining after deletion.`,
      })
    }
  }

  const handleAddItemsToInventory = (items: ExtractedItem[]) => {
    // In a real app, this would add the items to the inventory database
    toast({
      title: "Items Added to Inventory",
      description: `${items.length} items have been added to your inventory.`,
    })

    // Navigate to inventory page
    router.push("/inventory")
  }

  const saveToInventory = () => {
    // In a real app, this would save the processed items to the inventory
    toast({
      title: "Success",
      description: "Items saved to inventory successfully!",
    })
    router.push("/inventory")
  }

  const createTemplate = () => {
    // In a real app, this would generate a template based on the selected type
    toast({
      title: `${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template created!`,
      description: "In a real app, this would download a template file.",
    })
    setShowTemplateOptions(false)
  }

  const openFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Upload Documents</h2>
        {!isComplete && (
          <Button
            variant="outline"
            onClick={() => setShowTemplateOptions(!showTemplateOptions)}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Get Template
          </Button>
        )}
      </div>

      {showTemplateOptions && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle>Create Document Template</CardTitle>
            <CardDescription>Select the type of template you need for your inventory management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Template Type</label>
                <Select value={templateType} onValueChange={setTemplateType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inventory">Inventory Count</SelectItem>
                    <SelectItem value="purchase">Purchase Order</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="shipping">Shipping Manifest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={createTemplate} className="bg-seablue-600 hover:bg-seablue-700">
                  <Download className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isComplete ? (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Add Inventory Items</CardTitle>
            <CardDescription>
              Upload an invoice or take a picture of your items. Our AiCO will automatically process and organize your
              inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
                        ref={fileInputRef}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col sm:flex-row justify-center gap-2">
                        <Button variant="outline" className="cursor-pointer" onClick={openFileUpload}>
                          <Upload className="mr-2 h-4 w-4" />
                          Browse Files
                        </Button>
                        <Button variant="outline" className="cursor-pointer" onClick={handleDocumentScannerOpen}>
                          <Scan className="mr-2 h-4 w-4" />
                          Use Document Scanner
                        </Button>
                      </div>
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
                      <div className="flex flex-col sm:flex-row justify-center gap-2">
                        <Button variant="outline" onClick={handleCameraCapture}>
                          <Camera className="mr-2 h-4 w-4" />
                          Open Camera
                        </Button>
                        <Button variant="outline" onClick={handleDocumentScannerOpen}>
                          <Scan className="mr-2 h-4 w-4" />
                          Use Document Scanner
                        </Button>
                      </div>
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
              ) : (
                <>
                  <Scan className="mr-2 h-4 w-4" />
                  Process Document with AI
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          {scanResults ? (
            <DocumentScanResults
              analysis={scanResults}
              onAddToInventory={handleAddItemsToInventory}
              onEditItem={handleEditExtractedItem}
              onDeleteItem={handleDeleteExtractedItem}
              isEditing={true}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>AiCO-Recognized Items</CardTitle>
                <CardDescription>
                  Our AiCO has identified the following items from your document. You can edit or add items as needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {recognizedItems.length} items recognized from your document
                    </p>
                    <Button onClick={addNewItem} variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recognizedItems.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {editingItem === index ? (
                                <Input
                                  value={editValues.name}
                                  onChange={(e) => handleEditChange("name", e.target.value)}
                                />
                              ) : (
                                <div className="font-medium">{item.name}</div>
                              )}
                            </TableCell>
                            <TableCell>
                              {editingItem === index ? (
                                <Input
                                  type="number"
                                  value={editValues.quantity}
                                  onChange={(e) => handleEditChange("quantity", e.target.value)}
                                />
                              ) : (
                                <div>{item.quantity}</div>
                              )}
                            </TableCell>
                            <TableCell>
                              {editingItem === index ? (
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editValues.price}
                                  onChange={(e) => handleEditChange("price", e.target.value)}
                                />
                              ) : (
                                <div>${item.price.toFixed(2)}</div>
                              )}
                            </TableCell>
                            <TableCell>
                              {editingItem === index ? (
                                <Select
                                  value={editValues.category}
                                  onValueChange={(value) => handleEditChange("category", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Electronics">Electronics</SelectItem>
                                    <SelectItem value="Furniture">Furniture</SelectItem>
                                    <SelectItem value="Accessories">Accessories</SelectItem>
                                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <div>{item.category}</div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                {editingItem === index ? (
                                  <Button
                                    size="sm"
                                    onClick={() => saveEdit(index)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button size="sm" variant="ghost" onClick={() => startEditing(index)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteItem(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="pt-4">
                    <Textarea placeholder="Add notes about these items (optional)" className="w-full h-24" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null)
                    setPreview(null)
                    setIsComplete(false)
                    setRecognizedItems([])
                    setScanResults(null)
                  }}
                >
                  Upload Another Document
                </Button>
                <Button className="bg-seablue-600 hover:bg-seablue-700" onClick={saveToInventory}>
                  <Save className="mr-2 h-4 w-4" />
                  Save to Inventory
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}

      {/* Camera Dialog */}
      <Dialog open={isCameraOpen && !documentScanActive} onOpenChange={handleCameraClose}>
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
                <RefreshCw className="h-4 w-4 mr-1" />
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

      {/* Document Scanner Dialog */}
      <Dialog open={documentScanActive} onOpenChange={(open) => !open && handleCameraClose()}>
        <DialogContent className="sm:max-w-4xl p-0">
          <DocumentCamera onCapture={handleDocumentCapture} onCancel={handleCameraClose} />
        </DialogContent>
      </Dialog>

      {/* Error Alert */}
      {scanError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-start max-w-md">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Document Scanning Error</h3>
            <p className="text-sm">{scanError}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 text-red-800 hover:bg-red-200"
            onClick={() => setScanError(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
