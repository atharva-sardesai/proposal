"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Upload, X } from "lucide-react"

interface FileUploadProps {
  accept?: string
  maxSize?: number
  onUpload: (file: File) => void
}

export function FileUpload({ accept, maxSize = 5 * 1024 * 1024, onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (maxSize && selectedFile.size > maxSize) {
        toast({
          title: "File too large",
          description: `The file exceeds the maximum size of ${formatFileSize(maxSize)}.`,
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      onUpload(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]

      if (maxSize && droppedFile.size > maxSize) {
        toast({
          title: "File too large",
          description: `The file exceeds the maximum size of ${formatFileSize(maxSize)}.`,
          variant: "destructive",
        })
        return
      }

      setFile(droppedFile)
      onUpload(droppedFile)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-2">
      <Input type="file" ref={inputRef} accept={accept} onChange={handleFileChange} className="hidden" />

      {!file ? (
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">Drag and drop a file here, or click to select</p>
          <p className="text-xs text-muted-foreground mt-1">
            {accept ? `Accepted formats: ${accept.replace(/\./g, "")}` : "All file types accepted"} (Max:{" "}
            {formatFileSize(maxSize)})
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex items-center space-x-2">
            <div className="flex-1 truncate">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

