"use client"

import { FileText, Download, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FallbackPDFViewProps {
  onEmailClick: () => void;
}

export default function FallbackPDFView({ onEmailClick }: FallbackPDFViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-bold mb-2">PDF Preview Unavailable</h3>
      <p className="mb-4 text-muted-foreground">
        There was an issue generating the PDF preview. You can still download the PDF or send it via email.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={onEmailClick}>
          <Mail className="h-4 w-4" />
          Email Proposal
        </Button>
      </div>
    </div>
  )
}

