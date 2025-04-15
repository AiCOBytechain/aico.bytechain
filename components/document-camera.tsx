"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, RefreshCw, Scan, Check, X, Loader2 } from "lucide-react"
import { detectDocumentEdges, enhanceDocumentImage } from "@/utils/document-scanner"

interface DocumentCameraProps {
  onCapture: (imageData: string) => void
  onCancel: () => void
}

export function DocumentCamera({ onCapture, onCancel }: DocumentCameraProps) {
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const [isDetecting, setIsDetecting] = useState(false)
  const [documentDetected, setDocumentDetected] = useState(false)
  const [detectionConfidence, setDetectionConfidence] = useState(0)
  const [documentCorners, setDocumentCorners] = useState<{ x: number; y: number }[] | undefined>(undefined)
  const [isCapturing, setIsCapturing] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

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
    }
  }

  // Initialize camera detection when camera is opened
  useEffect(() => {
    getAvailableCameras()

    return () => {
      // Clean up
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [])

  // Handle camera stream when camera is selected
  useEffect(() => {
    if (videoRef.current && selectedCamera) {
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

          // Start document detection after camera is initialized
          startDocumentDetection()
        } catch (error) {
          console.error("Error accessing camera:", error)
        }
      }

      startCamera()
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [selectedCamera])

  // Start document detection
  const startDocumentDetection = () => {
    setIsDetecting(true)

    // Clear any existing interval
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
    }

    // Set up interval for document detection
    detectionIntervalRef.current = setInterval(async () => {
      if (videoRef.current && canvasRef.current && overlayCanvasRef.current) {
        const video = videoRef.current
        const canvas = canvasRef.current
        const overlayCanvas = overlayCanvasRef.current

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        overlayCanvas.width = video.videoWidth
        overlayCanvas.height = video.videoHeight

        // Draw the video frame to the canvas
        const context = canvas.getContext("2d")
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height)

          // Get the image data for document detection
          const imageData = canvas.toDataURL("image/jpeg")

          try {
            // Detect document edges
            const detection = await detectDocumentEdges(imageData)

            setDocumentDetected(detection.hasDocument)
            setDetectionConfidence(detection.confidence)
            setDocumentCorners(detection.corners)

            // Draw document outline on overlay canvas
            const overlayContext = overlayCanvas.getContext("2d")
            if (overlayContext && detection.hasDocument && detection.corners) {
              // Clear previous drawing
              overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)

              // Draw semi-transparent overlay
              overlayContext.fillStyle = "rgba(0, 0, 0, 0.5)"
              overlayContext.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height)

              // Draw document area
              overlayContext.beginPath()
              overlayContext.moveTo(detection.corners[0].x, detection.corners[0].y)
              for (let i = 1; i < detection.corners.length; i++) {
                overlayContext.lineTo(detection.corners[i].x, detection.corners[i].y)
              }
              overlayContext.closePath()

              // Cut out document area from overlay
              overlayContext.globalCompositeOperation = "destination-out"
              overlayContext.fill()
              overlayContext.globalCompositeOperation = "source-over"

              // Draw document outline
              overlayContext.strokeStyle = detection.confidence > 0.7 ? "#00cc00" : "#ffcc00"
              overlayContext.lineWidth = 3
              overlayContext.stroke()

              // Draw corner points
              detection.corners.forEach((corner) => {
                overlayContext.beginPath()
                overlayContext.arc(corner.x, corner.y, 8, 0, 2 * Math.PI)
                overlayContext.fillStyle = "#00cc00"
                overlayContext.fill()
              })
            }
          } catch (error) {
            console.error("Error detecting document:", error)
          }
        }
      }
    }, 500) // Check every 500ms
  }

  // Capture the current frame
  const captureDocument = async () => {
    if (videoRef.current && canvasRef.current) {
      setIsCapturing(true)

      try {
        const video = videoRef.current
        const canvas = canvasRef.current

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the video frame to the canvas
        const context = canvas.getContext("2d")
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height)

          // Get the image data
          const imageData = canvas.toDataURL("image/jpeg")

          // Enhance the image
          const enhancedImage = await enhanceDocumentImage(imageData)

          // Pass the captured image back
          onCapture(enhancedImage)
        }
      } catch (error) {
        console.error("Error capturing document:", error)
      } finally {
        setIsCapturing(false)
      }
    }
  }

  // Switch camera
  const switchCamera = () => {
    if (availableCameras.length > 1) {
      const currentIndex = availableCameras.findIndex((camera) => camera.deviceId === selectedCamera)
      const nextIndex = (currentIndex + 1) % availableCameras.length
      setSelectedCamera(availableCameras[nextIndex].deviceId)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="mr-2 h-5 w-5" />
          Document Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
          {/* Main video feed */}
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />

          {/* Hidden canvas for capturing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Overlay canvas for document detection */}
          <canvas ref={overlayCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Document detection status indicator */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="bg-black/70 text-white px-3 py-1.5 rounded-full flex items-center">
              {isDetecting ? (
                <>
                  {documentDetected ? (
                    <>
                      <Check className="h-4 w-4 text-green-400 mr-1.5" />
                      <span>Document detected</span>
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4 text-yellow-400 mr-1.5" />
                      <span>Position document in frame</span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  <span>Initializing scanner...</span>
                </>
              )}
            </div>

            {documentDetected && (
              <div className="bg-black/70 text-white px-3 py-1.5 rounded-full">
                <span>Quality: {Math.round(detectionConfidence * 100)}%</span>
              </div>
            )}
          </div>

          {/* Camera switch button */}
          {availableCameras.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-black/50 text-white border-gray-600 hover:bg-black/70"
              onClick={switchCamera}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Switch Camera
            </Button>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {documentDetected ? (
            <p className="text-green-600">
              Document detected! Position for best quality and tap "Scan Document" when ready.
            </p>
          ) : (
            <p>Position your document within the frame. Make sure it's well-lit and the text is clearly visible.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button
          className="bg-seablue-600 hover:bg-seablue-700"
          disabled={!documentDetected || isCapturing}
          onClick={captureDocument}
        >
          {isCapturing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Scan className="mr-2 h-4 w-4" />
              Scan Document
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
