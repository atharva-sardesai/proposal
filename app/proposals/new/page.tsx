"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CompanyDetailsForm from "@/components/company-details-form"
import FinancialsForm from "@/components/financials-form"
import ScopeOfWorkForm from "@/components/scope-of-work-form"
import EngagementTypeForm from "@/components/engagement-type-form"
import ComplianceForm from "@/components/compliance-form"
import DatesForm from "@/components/dates-form"
import ProposalPreview from "@/components/proposal-preview"
import { createProposal } from "@/lib/actions"
import { toast } from "@/hooks/use-toast"

const tabs = [
  { id: "company", label: "Company Details" },
  { id: "financials", label: "Financials" },
  { id: "scope", label: "Scope of Work" },
  { id: "engagement", label: "Engagement Type" },
  { id: "compliance", label: "Compliance" },
  { id: "dates", label: "Project Dates" },
  { id: "preview", label: "Preview" },
]

export default function NewProposalPage() {
  const router = useRouter()
  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("proposalFormData")
      if (saved) return JSON.parse(saved)
    }
    return {
      company: { name: "", address: "", contactName: "", contactEmail: "", contactPhone: "" },
      financials: { quotedAmount: "", paymentTerms: "net30", currency: "USD" },
      scopes: [{ serviceType: "", description: "", deliverables: "", timeline: "" }],
      engagement: { type: "one-time", details: "" },
      compliance: { requirements: [], details: "" },
      dates: { startDate: "", endDate: "" },
    }
  })
  const [activeTab, setActiveTab] = useState("company")

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("proposalFormData", JSON.stringify(formData))
    }
  }, [formData])

  const updateFormData = (section: any, data: any) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      [section]: data,
    }))
  }

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id)
    }
  }

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id)
    }
  }

  const handleSubmit = async () => {
    try {
      // Generate DOCX and download
      const response = await fetch("/api/generate-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate document")
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Proposal-${formData.company?.name || "Client"}.docx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({
        title: "Proposal Generated",
        description: "Your proposal DOCX has been downloaded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to generate proposal.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Proposal</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <Card>
          <CardContent className="pt-6">
            <TabsContent value="company">
              <CompanyDetailsForm data={formData.company} updateData={(data: any) => updateFormData("company", data)} onContinue={handleNext} />
            </TabsContent>

            <TabsContent value="financials">
              <FinancialsForm data={formData.financials} updateData={(data: any) => updateFormData("financials", data)} onContinue={handleNext} />
            </TabsContent>

            <TabsContent value="scope">
              <ScopeOfWorkForm data={formData.scopes} updateData={(data: any) => updateFormData("scopes", data)} onContinue={handleNext} />
            </TabsContent>

            <TabsContent value="engagement">
              <EngagementTypeForm data={formData.engagement} updateData={(data: any) => updateFormData("engagement", data)} onContinue={handleNext} />
            </TabsContent>

            <TabsContent value="compliance">
              <ComplianceForm data={formData.compliance} updateData={(data: any) => updateFormData("compliance", data)} onContinue={handleNext} />
            </TabsContent>

            <TabsContent value="dates">
              <DatesForm data={formData.dates} updateData={(data: any) => updateFormData("dates", data)} onContinue={handleNext} />
            </TabsContent>

            <TabsContent value="preview">
              <ProposalPreview data={formData} />
              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.localStorage.setItem("proposalFormData", JSON.stringify(formData))
                    toast({ title: "Saved", description: "Your proposal has been saved." })
                  }}
                >
                  Save Progress
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    window.localStorage.removeItem("proposalFormData")
                    setFormData({
                      company: { name: "", address: "", contactName: "", contactEmail: "", contactPhone: "" },
                      financials: { quotedAmount: "", paymentTerms: "net30", currency: "USD" },
                      scopes: [{ serviceType: "", description: "", deliverables: "", timeline: "" }],
                      engagement: { type: "one-time", details: "" },
                      compliance: { requirements: [], details: "" },
                      dates: { startDate: "", endDate: "" },
                    })
                    toast({ title: "Cleared", description: "Form has been reset." })
                  }}
                >
                  Clear Form
                </Button>
              </div>
            </TabsContent>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevious} disabled={activeTab === "company"}>
                Previous
              </Button>

              {activeTab !== "preview" ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSubmit}>Generate Proposal</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}

