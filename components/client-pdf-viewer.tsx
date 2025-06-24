"use client"

import dynamic from "next/dynamic"
import { ProposalData } from "@/types/proposal";

// Create a simple placeholder component to use while loading
const LoadingPDF = () => (
  <div className="flex items-center justify-center h-full">
    <p className="text-muted-foreground">Loading PDF preview...</p>
  </div>
)

// Dynamically import the PDF viewer with no SSR
const SimplePDFViewer = dynamic<ClientPDFViewerProps>(() => import("./simple-pdf-viewer").then((mod) => mod.SimplePDFViewer), {
  ssr: false,
  loading: () => <LoadingPDF />,
})

interface ClientPDFViewerProps {
  data: ProposalData;
  onEmailClick: () => void;
  onDownloadClick: () => void;
}

export default function ClientPDFViewer({ data, onEmailClick, onDownloadClick }: ClientPDFViewerProps) {
  return (
    <div className="h-full">
      <SimplePDFViewer data={data} onEmailClick={onEmailClick} onDownloadClick={onDownloadClick} />
    </div>
  )
}

