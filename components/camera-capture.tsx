// components/camera-capture.tsx
//
// Real live camera preview with high-resolution capture, replacing the
// basic <input type="file" capture="environment"> approach — which hands
// control to the OS's generic camera picker and often compresses/downscales
// the photo. This component requests the camera directly via getUserMedia
// with explicit high-resolution constraints, shows a live preview, and
// captures a full-resolution frame on demand — much closer to using the
// phone's native camera app quality.
//
// Falls back gracefully to a file input if getUserMedia isn't available
// (e.g. desktop without a webcam, or permission denied).

"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, X, RotateCcw, Check } from "lucide-react"

interface CameraCaptureProps {
  open: boolean
  onClose: () => void
  onCapture: (base64: string, mediaType: string) => void
}

export function CameraCapture({ open, onClose, onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState("")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!open) return

    let cancelled = false

    async function startCamera() {
      setError("")
      setCapturedImage(null)
      setReady(false)

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            // Request the highest resolution the device camera supports,
            // rather than accepting whatever low default the browser picks.
            width: { ideal: 3840 },
            height: { ideal: 2160 },
          },
          audio: false,
        })

        if (cancelled) {
          stream.getTracks().forEach(t => t.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setReady(true)
        }
      } catch (err) {
        console.error("Camera access error:", err)
        setError("Could not access the camera. Check camera permissions, or use the file upload option instead.")
      }
    }

    startCamera()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [open])

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    // Capture at the video's native resolution, not a scaled-down display size
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95) // high quality JPEG
    setCapturedImage(dataUrl)
  }

  const handleRetake = () => {
    setCapturedImage(null)
  }

  const handleConfirm = () => {
    if (!capturedImage) return
    const base64 = capturedImage.split(",")[1]
    onCapture(base64, "image/jpeg")
    handleClose()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1]
      onCapture(base64, file.type)
      handleClose()
    }
    reader.readAsDataURL(file)
  }

  const handleClose = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCapturedImage(null)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={handleClose} className="text-white">
          <X className="h-6 w-6" />
        </button>
        <span className="text-sm font-medium text-white/80">
          {capturedImage ? "Review photo" : "Position drug in frame"}
        </span>
        <div className="w-6" />
      </div>

      {/* Camera / preview area */}
      <div className="relative flex-1 overflow-hidden">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-sm text-white/80">{error}</p>
            <label className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
              Upload a photo instead
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        ) : capturedImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={capturedImage} alt="Captured" className="h-full w-full object-contain" />
        ) : (
          <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      {!error && (
        <div className="flex items-center justify-center gap-6 p-6">
          {capturedImage ? (
            <>
              <button
                onClick={handleRetake}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white"
              >
                <RotateCcw className="h-4 w-4" /> Retake
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                <Check className="h-4 w-4" /> Use Photo
              </button>
            </>
          ) : (
            <button
              onClick={handleCapture}
              disabled={!ready}
              className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20 disabled:opacity-40"
            >
              <Camera className="h-7 w-7 text-white" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}