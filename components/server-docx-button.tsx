"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ProposalData } from "../types/proposal"

export default function ServerDOCXButton({ data }: { data: ProposalData }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateDOCX = async () => {
    try {
      setIsGenerating(true)

      const response = await fetch("/api/generate-docx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate document")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Proposal-${data?.company?.name || "Client"}.docx`
      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Document Generated",
        description: "Your proposal has been downloaded as a DOCX file.",
      })
    } catch (error) {
      console.error("Error generating document:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to generate document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button variant="outline" className="flex items-center gap-2" onClick={handleGenerateDOCX} disabled={isGenerating}>
      <FileText className="h-4 w-4" />
      {isGenerating ? "Generating..." : "Export as DOCX"}
    </Button>
  )
}

