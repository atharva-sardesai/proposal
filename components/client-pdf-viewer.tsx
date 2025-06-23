"use client"

import dynamic from "next/dynamic"

// Create a simple placeholder component to use while loading
const LoadingPDF = () => (
  <div className="flex items-center justify-center h-full">
    <p className="text-muted-foreground">Loading PDF preview...</p>
  </div>
)

// Dynamically import the PDF viewer with no SSR
const SimplePDFViewer = dynamic(() => import("./simple-pdf-viewer"), {
  ssr: false,
  loading: () => <LoadingPDF />,
})

export default function ClientPDFViewer({ data, onEmailClick, onDownloadClick }) {
  return (
    <div className="h-full">
      <SimplePDFViewer data={data} onEmailClick={onEmailClick} onDownloadClick={onDownloadClick} />
    </div>
  )
}

