"use client"
import FallbackPDFPreview from "@/components/fallback-pdf-preview"

export function PDFViewer({ onEmailClick, onDownloadClick }: { onEmailClick: () => void; onDownloadClick: () => void }) {
  // This is now just a wrapper that always uses the fallback
  // The actual PDF rendering is handled by ClientPDFViewer
  return <FallbackPDFPreview onEmailClick={onEmailClick} onDownloadClick={onDownloadClick} />
}

