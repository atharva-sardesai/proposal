"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Mail } from "lucide-react"
import FallbackPDFPreview from "@/components/fallback-pdf-preview"

export function SimplePDFViewer({ data, onEmailClick, onDownloadClick }: { data: unknown; onEmailClick: () => void; onDownloadClick: () => void }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const generatePDFPreview = async () => {
      try {
        setIsLoading(true)

        // Call the API to generate a temporary PDF preview
        const response = await fetch("/api/preview-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to generate PDF preview")
        }

        // Get the PDF blob
        const blob = await response.blob()

        // Create a URL for the blob
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
        setHasError(false)
      } catch (error) {
        console.error("Error generating PDF preview:", error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (data) {
      generatePDFPreview()
    }

    // Clean up the URL when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl, data])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Generating PDF preview...</p>
      </div>
    )
  }

  if (hasError || !pdfUrl) {
    return <FallbackPDFPreview onEmailClick={onEmailClick} onDownloadClick={onDownloadClick} />
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end gap-4 p-2 bg-muted/20">
        <Button variant="outline" className="flex items-center gap-2" onClick={onDownloadClick}>
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={onEmailClick}>
          <Mail className="h-4 w-4" />
          Email Proposal
        </Button>
      </div>
      <div className="flex-1 bg-muted/10">
        <iframe src={pdfUrl} className="w-full h-full border-0" title="PDF Preview" />
      </div>
    </div>
  )
}

