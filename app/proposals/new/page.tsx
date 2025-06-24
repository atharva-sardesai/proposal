"use client"

import { useState, useEffect } from "react"
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
import { toast } from "@/hooks/use-toast"
import { ProposalData, Scope } from "../../../types/proposal"

const emptyProposal: ProposalData = {
  company: { name: "", address: "", contactName: "", contactEmail: "", contactPhone: "" },
  financials: { quotedAmount: "", paymentTerms: "net30", currency: "USD" },
  scopes: [{ serviceType: "", description: "", deliverables: "", timeline: "" }],
  engagement: { type: "one-time", details: "" },
  compliance: { requirements: [], details: "" },
  dates: { startDate: "", endDate: "" },
}

function normalizeCompany(company: Partial<ProposalData['company']> | undefined): ProposalData['company'] {
  return {
    name: company?.name ?? "",
    address: company?.address ?? "",
    contactName: company?.contactName ?? "",
    contactEmail: company?.contactEmail ?? "",
    contactPhone: company?.contactPhone ?? "",
  };
}

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
  const [formData, setFormData] = useState<ProposalData>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("proposalFormData")
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...emptyProposal,
          ...parsed,
          company: normalizeCompany(parsed.company),
        };
      }
    }
    return emptyProposal
  })
  const [activeTab, setActiveTab] = useState("company")

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("proposalFormData", JSON.stringify(formData))
    }
  }, [formData])

  const updateFormData = <T extends keyof ProposalData>(section: T, data: ProposalData[T]) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const updateScopes = (scopes: Scope[] | undefined) => {
    setFormData((prev) => ({
      ...prev,
      scopes: scopes,
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
        description: (error as unknown as Error).message || "Failed to generate proposal.",
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
              <CompanyDetailsForm data={formData.company ? formData.company : null} updateData={(data: ProposalData['company']) => updateFormData("company", data)} onContinue={handleNext} />
            </TabsContent>

            <TabsContent value="financials">
              <FinancialsForm data={formData.financials ?? { quotedAmount: "", paymentTerms: "net30", currency: "USD" }} updateData={(data: ProposalData['financials']) => updateFormData("financials", data)} onContinue={handleNext} />
            </TabsContent>

            <TabsContent value="scope">
              <ScopeOfWorkForm data={formData.scopes ? formData.scopes : []} updateData={updateScopes} onContinue={handleNext} />
            </TabsContent>

            <TabsContent value="engagement">
              <EngagementTypeForm data={formData.engagement ?? { type: "one-time", details: "" }} updateData={(data: ProposalData['engagement']) => updateFormData("engagement", data)} onContinue={handleNext} />
            </TabsContent>

            <TabsContent value="compliance">
              <ComplianceForm data={formData.compliance ? formData.compliance : null} updateData={(data: ProposalData['compliance']) => updateFormData("compliance", data)} onContinue={handleNext} />
            </TabsContent>

            <TabsContent value="dates">
              <DatesForm data={formData.dates ?? { startDate: "", endDate: "" }} updateData={(data: ProposalData['dates']) => updateFormData("dates", data)} onContinue={handleNext} />
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
                    setFormData(emptyProposal)
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

