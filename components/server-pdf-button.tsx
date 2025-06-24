"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ProposalData } from "@/types/proposal"

export default function ServerPDFButton({ data }: { data: ProposalData }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true)

      // Call the API to generate the PDF
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      // Get the PDF blob
      const blob = await response.blob()

      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Proposal-${data.company?.name || "Client"}.pdf`
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "PDF Generated",
        description: "Your proposal PDF has been downloaded.",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button variant="outline" className="flex items-center gap-2" onClick={handleGeneratePDF} disabled={isGenerating}>
      <Download className="h-4 w-4" />
      {isGenerating ? "Generating..." : "Download PDF"}
    </Button>
  )
}

