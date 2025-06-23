"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Mail, FileText, FileSignature, ArrowLeft } from "lucide-react"
import { sendProposalByEmail, getProposalById } from "@/lib/actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import ServerDOCXButton from "@/components/server-docx-button"

// PDFViewer has been replaced with ClientPDFViewer
// import { PDFViewer } from "@/components/pdf-viewer"

// Mock data for demonstration
const mockProposals = {
  "PROP-001": {
    id: "PROP-001",
    company: {
      name: "Acme Inc.",
      address: "123 Business St, City, State, ZIP",
      contactName: "John Doe",
      contactEmail: "john@acme.com",
      contactPhone: "(555) 123-4567",
    },
    financials: {
      quotedAmount: "15000",
      paymentTerms: "net30",
      currency: "USD",
    },
    scope: {
      serviceType: "iso27001-audit",
      description:
        "Comprehensive audit of the organization's Information Security Management System (ISMS) against ISO 27001:2013 standards.",
      deliverables: "- Detailed audit report\n- Gap analysis document\n- Compliance status report",
      timeline: "6 weeks",
    },
    engagement: {
      type: "one-time",
      details: "One-time comprehensive audit",
    },
    compliance: {
      requirements: ["iso27001", "gdpr"],
      details: "Focus on ISO 27001 compliance with GDPR considerations",
    },
    dates: {
      startDate: "2023-06-01T00:00:00.000Z",
      endDate: "2023-07-15T00:00:00.000Z",
    },
    status: "sent",
    createdAt: "2023-05-15T00:00:00.000Z",
  },
  "PROP-002": {
    id: "PROP-002",
    company: {
      name: "TechCorp Solutions",
      address: "456 Tech Blvd, Innovation City, CA 90210",
      contactName: "Jane Smith",
      contactEmail: "jane@techcorp.com",
      contactPhone: "(555) 987-6543",
    },
    financials: {
      quotedAmount: "25000",
      paymentTerms: "net45",
      currency: "USD",
    },
    scope: {
      serviceType: "soc2-type2",
      description: "SOC 2 Type 2 assessment evaluating both the design and operating effectiveness of controls.",
      deliverables: "- Readiness assessment report\n- Control matrix documentation\n- Final SOC 2 Type 2 report",
      timeline: "12 weeks",
    },
    engagement: {
      type: "ongoing",
      details: "Initial assessment with quarterly follow-ups",
    },
    compliance: {
      requirements: ["soc2", "hipaa"],
      details: "SOC 2 compliance with HIPAA considerations for healthcare data",
    },
    dates: {
      startDate: "2023-07-01T00:00:00.000Z",
      endDate: "2023-09-30T00:00:00.000Z",
    },
    status: "viewed",
    createdAt: "2023-06-10T00:00:00.000Z",
  },
  "PROP-003": {
    id: "PROP-003",
    company: {
      name: "Global Enterprises",
      address: "789 Global Way, International City, NY 10001",
      contactName: "Robert Johnson",
      contactEmail: "robert@globalent.com",
      contactPhone: "(555) 456-7890",
    },
    financials: {
      quotedAmount: "42000",
      paymentTerms: "net30",
      currency: "USD",
    },
    scope: {
      serviceType: "vapt",
      description: "Comprehensive Vulnerability Assessment and Penetration Testing (VAPT) of IT infrastructure.",
      deliverables:
        "- Detailed vulnerability assessment report\n- Penetration testing findings\n- Remediation recommendations",
      timeline: "4 weeks",
    },
    engagement: {
      type: "one-time",
      details: "One-time assessment with optional follow-up",
    },
    compliance: {
      requirements: ["pci"],
      details: "Focus on PCI DSS compliance requirements",
    },
    dates: {
      startDate: "2023-08-15T00:00:00.000Z",
      endDate: "2023-09-15T00:00:00.000Z",
    },
    status: "accepted",
    createdAt: "2023-08-05T00:00:00.000Z",
  },
}

// Function to generate a mock proposal for any ID
function generateMockProposal(id: string) {
  // Create a deterministic but seemingly random number based on the ID
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // List of company names to choose from
  const companyNames = [
    "Acme Corp",
    "TechSolutions",
    "Global Innovations",
    "Cyber Security Inc.",
    "Data Systems",
    "Cloud Enterprises",
    "Secure Networks",
    "Digital Compliance",
    "InfoSec Solutions",
    "Compliance Tech",
    "Security First",
    "Data Guard",
  ]

  // List of contact names
  const contactNames = [
    "John Smith",
    "Jane Doe",
    "Robert Johnson",
    "Emily Williams",
    "Michael Brown",
    "Sarah Davis",
    "David Miller",
    "Lisa Wilson",
    "James Taylor",
    "Jennifer Martinez",
    "Thomas Anderson",
    "Jessica Thompson",
  ]

  // List of service types
  const serviceTypes = [
    "iso27001-audit",
    "iso27001-implementation",
    "iso27001-implementation-audit",
    "soc2-type1",
    "soc2-type2",
    "vapt",
    "security-assessment",
    "cloud-security-assessment",
  ]

  // List of engagement types
  const engagementTypes = ["one-time", "ongoing", "retainer"]

  // List of compliance requirements
  const complianceReqs = ["iso27001", "soc2", "gdpr", "hipaa", "pci", "ccpa"]

  // Generate a date within the last year
  const createdAt = new Date()
  createdAt.setMonth(createdAt.getMonth() - (hash % 12))

  // Generate start and end dates
  const startDate = new Date(createdAt)
  startDate.setDate(startDate.getDate() + 14) // Start 2 weeks after creation

  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + 3) // End 3 months after start

  // Generate a quoted amount between 10,000 and 100,000
  const quotedAmount = 10000 + (hash % 90000)

  // Select items based on the hash
  const companyName = companyNames[hash % companyNames.length]
  const contactName = contactNames[(hash + 1) % contactNames.length]
  const serviceType = serviceTypes[(hash + 2) % serviceTypes.length]
  const engagementType = engagementTypes[(hash + 3) % engagementTypes.length]

  // Select 1-3 compliance requirements
  const requirements = []
  for (let i = 0; i < 3; i++) {
    if ((hash + i) % 2 === 0) {
      requirements.push(complianceReqs[(hash + i) % complianceReqs.length])
    }
  }

  // Generate a status based on the hash
  const statuses = ["draft", "sent", "viewed", "accepted", "rejected"]
  const status = statuses[hash % statuses.length]

  // Return the generated proposal
  return {
    id,
    company: {
      name: companyName,
      address: `${123 + (hash % 877)} Business Ave, Suite ${100 + (hash % 900)}, Business City, BC ${10000 + (hash % 90000)}`,
      contactName,
      contactEmail: `${contactName.split(" ")[0].toLowerCase()}@${companyName.toLowerCase().replace(/\s+/g, "")}.com`,
      contactPhone: `(${100 + (hash % 900)}) ${100 + (hash % 900)}-${1000 + (hash % 9000)}`,
    },
    financials: {
      quotedAmount: quotedAmount.toString(),
      paymentTerms: ["net15", "net30", "net45", "net60"][hash % 4],
      currency: "USD",
    },
    scope: {
      serviceType,
      description: `Comprehensive ${serviceType.replace(/-/g, " ")} service tailored to the client's specific needs and requirements.`,
      deliverables:
        "- Detailed assessment report\n- Findings and recommendations\n- Executive summary\n- Technical documentation",
      timeline: `${4 + (hash % 12)} weeks`,
    },
    engagement: {
      type: engagementType,
      details: `${
        engagementType === "one-time"
          ? "One-time comprehensive assessment"
          : engagementType === "ongoing"
            ? "Ongoing service with quarterly reviews"
            : "Retainer agreement with monthly support"
      }`,
    },
    compliance: {
      requirements,
      details:
        requirements.length > 0
          ? `Focus on ${requirements.join(", ")} compliance requirements and best practices.`
          : "General compliance assessment based on industry standards.",
    },
    dates: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    status,
    createdAt: createdAt.toISOString(),
  }
}

type Proposal = {
  id: string
  company: {
    name: string
    address: string
    contactName: string
    contactEmail: string
    contactPhone: string
  }
  financials: {
    quotedAmount: string
    paymentTerms: string
    currency: string
  }
  scopes: Array<{
    serviceType: string
    description: string
    deliverables: string
    timeline: string
    [key: string]: any
  }>
  engagement: {
    type: string
    details: string
  }
  compliance: {
    requirements: string[]
    details: string
  }
  dates: {
    startDate: string
    endDate: string
  }
  createdAt?: string
}

export default function ProposalDetailPage() {
  const router = useRouter()
  // @ts-ignore
  const proposal = typeof window !== 'undefined' && window.history.state && window.history.state.usr ? window.history.state.usr : null
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [emailAddress, setEmailAddress] = useState(proposal?.company?.contactEmail || "")
  const [isSending, setIsSending] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")
  const [showNDA, setShowNDA] = useState(false)

  if (!proposal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Proposal Not Found</h1>
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/10">
          <p className="text-lg font-semibold mb-2">No proposal data found.</p>
          <Button onClick={() => router.push("/proposals/new")}>Create New Proposal</Button>
        </div>
      </div>
    )
  }

  const handleSendEmail = async () => {
    try {
      setIsSending(true)
      await sendProposalByEmail(proposal, emailAddress)
      setEmailDialogOpen(false)
      toast({
        title: "Email Sent",
        description: `Proposal has been sent to ${emailAddress}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const formatCurrency = (amount: string, currency: string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(num)
  }

  const getPaymentTermsText = (terms: string) => {
    switch (terms) {
      case "net15":
        return "Net 15 Days"
      case "net30":
        return "Net 30 Days"
      case "net45":
        return "Net 45 Days"
      case "net60":
        return "Net 60 Days"
      case "immediate":
        return "Immediate Payment"
      case "custom":
        return "Custom Terms"
      default:
        return terms
    }
  }

  const getEngagementTypeText = (type: string) => {
    switch (type) {
      case "one-time":
        return "One-time Project"
      case "ongoing":
        return "Ongoing Services"
      case "retainer":
        return "Retainer Agreement"
      default:
        return type
    }
  }

  const getServiceTypeText = (type: string) => {
    switch (type) {
      case "iso27001-audit":
        return "ISO 27001 Audit Only"
      case "iso27001-implementation":
        return "ISO 27001 Implementation Only"
      case "iso27001-implementation-audit":
        return "ISO 27001 Implementation + Audit"
      case "soc2-type1":
        return "SOC 2 Type 1"
      case "soc2-type2":
        return "SOC 2 Type 2"
      case "vapt":
        return "Vulnerability Assessment and Penetration Testing (VAPT)"
      case "security-assessment":
        return "Security Assessment"
      case "cloud-security-assessment":
        return "Cloud Security Assessment"
      default:
        return type || "N/A"
    }
  }

  const formatAmount = (amount: string, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount)
  }

  const formatPaymentTerms = (terms: string) => {
    switch (terms) {
      case "net15":
        return "Net 15 Days"
      case "net30":
        return "Net 30 Days"
      case "net45":
        return "Net 45 Days"
      case "net60":
        return "Net 60 Days"
      case "immediate":
        return "Immediate Payment"
      case "custom":
        return "Custom Terms"
      default:
        return terms
    }
  }

  const getRequirementText = (value: string): string => {
    // ... existing code ...
    return value
  }

  const getInitials = (name: string): string => {
    // ... existing code ...
    return name
  }

  const getTimelineText = (timeline: string): string => {
    // ... existing code ...
    return timeline
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Proposal {proposal.id}</h1>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Proposal for {proposal.company.name}</h2>
          <p className="text-muted-foreground">
            Created on {typeof proposal.createdAt === 'string' && !isNaN(new Date(proposal.createdAt as string).getTime())
              ? format(new Date(proposal.createdAt as string), "MMMM d, yyyy")
              : "N/A"}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <ServerDOCXButton data={proposal} />
          <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Proposal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Proposal by Email</DialogTitle>
                <DialogDescription>Enter the email address where you want to send this proposal.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="client@example.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setEmailDialogOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSendEmail} disabled={isSending}>
                  {isSending ? "Sending..." : "Send Proposal"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowNDA(!showNDA)}>
            <FileSignature className="h-4 w-4" />
            {showNDA ? "Hide Legal Documents" : "View Legal Documents"}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            {showNDA && <TabsTrigger value="nda">NDA</TabsTrigger>}
            {showNDA && <TabsTrigger value="payment-terms">Payment Terms</TabsTrigger>}
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="border-b pb-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold">Seccomply</h3>
                        <p className="text-sm text-muted-foreground">Shivani Tikadia, CEO</p>
                      </div>
                      <img
                        src="https://seccomply.net/wp-content/uploads/2023/05/seccomply-logo.png"
                        alt="Seccomply Logo"
                        className="h-12 object-contain"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Company Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                        <p>{proposal.company.name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p>{proposal.company.address || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                        <p>{proposal.company.contactName || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                        <p>{proposal.company.contactEmail || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                        <p>{proposal.company.contactPhone || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Financial Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Quoted Amount</p>
                        <p>
                          {proposal.financials.quotedAmount
                            ? formatCurrency(proposal.financials.quotedAmount, proposal.financials.currency)
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Payment Terms</p>
                        <p>{getPaymentTermsText(proposal.financials.paymentTerms) || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Scope of Work</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                        <p>{getServiceTypeText(proposal.scopes[0].serviceType) || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="whitespace-pre-line">{proposal.scopes[0].description || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Deliverables</p>
                        <p className="whitespace-pre-line">{proposal.scopes[0].deliverables || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                        <p className="whitespace-pre-line">{proposal.scopes[0].timeline || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Engagement Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Engagement Type</p>
                        <p>{getEngagementTypeText(proposal.engagement.type) || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Project Dates</p>
                        <p>
                          {proposal.dates.startDate ? format(new Date(proposal.dates.startDate), "PPP") : "N/A"} to{" "}
                          {proposal.dates.endDate ? format(new Date(proposal.dates.endDate), "PPP") : "N/A"}
                        </p>
                      </div>
                    </div>
                    {proposal.engagement.details && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground">Additional Details</p>
                        <p className="whitespace-pre-line">{proposal.engagement.details}</p>
                      </div>
                    )}
                  </div>

                  {proposal.compliance.requirements && proposal.compliance.requirements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Compliance Requirements</h3>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Compliance Types</p>
                        <ul className="list-disc list-inside">
                          {proposal.compliance.requirements.map((req) => (
                            <li key={req}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      {proposal.compliance.details && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-muted-foreground">Additional Details</p>
                          <p className="whitespace-pre-line">{proposal.compliance.details}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nda">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">NON-DISCLOSURE AGREEMENT</h2>
                  </div>

                  <div className="mb-6">
                    <p className="mb-4">
                      This Non-Disclosure Agreement (the "Agreement") is entered into as of the date of the proposal
                      between Seccomply ("Disclosing Party") and the client company ("Receiving Party").
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">1. Purpose</h3>
                    <p>
                      The parties wish to explore a business opportunity of mutual interest, and in connection with this
                      opportunity, Disclosing Party may disclose to Receiving Party certain confidential technical and
                      business information which Disclosing Party desires Receiving Party to treat as confidential.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">2. Confidential Information</h3>
                    <p>
                      "Confidential Information" means any information disclosed by Disclosing Party to Receiving Party,
                      either directly or indirectly, in writing, orally or by inspection of tangible objects, including
                      without limitation documents, business plans, source code, software, documentation, financial
                      analysis, marketing plans, customer names, customer list, customer data. Confidential Information
                      shall not include information that: (i) is or becomes generally known to the public; (ii) was
                      known to Receiving Party prior to its disclosure by Disclosing Party; (iii) is received from a
                      third party without restriction; or (iv) is independently developed by Receiving Party.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">3. Non-use and Non-disclosure</h3>
                    <p>
                      Receiving Party agrees not to use any Confidential Information for any purpose except to evaluate
                      and engage in discussions concerning a potential business relationship between the parties.
                      Receiving Party agrees not to disclose any Confidential Information to third parties or to its
                      employees, except to those employees who are required to have the information in order to evaluate
                      or engage in discussions concerning the contemplated business relationship.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">4. Maintenance of Confidentiality</h3>
                    <p>
                      Receiving Party agrees that it shall take reasonable measures to protect the secrecy of and avoid
                      disclosure and unauthorized use of the Confidential Information. Without limiting the foregoing,
                      Receiving Party shall take at least those measures that it takes to protect its own most highly
                      confidential information and shall ensure that its employees who have access to Confidential
                      Information have signed a non-disclosure agreement protecting confidential information.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">5. Term</h3>
                    <p>
                      This Agreement shall remain in effect for a period of two (2) years from the date of disclosure of
                      Confidential Information.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">6. Miscellaneous</h3>
                    <p>
                      This Agreement shall be binding upon and for the benefit of the parties, their successors and
                      assigns. This Agreement shall be governed by and construed in accordance with the laws of the
                      jurisdiction in which Seccomply is located, without reference to conflict of laws principles.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div>
                      <p className="font-medium">DISCLOSING PARTY:</p>
                      <p>Seccomply</p>
                      <div className="border-t border-black mt-16 mb-2"></div>
                      <p>Signature</p>
                      <p>Shivani Tikadia, CEO</p>
                    </div>

                    <div>
                      <p className="font-medium">RECEIVING PARTY:</p>
                      <p>{proposal.company.name || "[Client Company Name]"}</p>
                      <div className="border-t border-black mt-16 mb-2"></div>
                      <p>Signature</p>
                      <p>
                        {proposal.company.contactName || "[Client Representative Name]"},{" "}
                        {proposal.company.contactName ? "Representative" : "[Title]"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-terms">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">PAYMENT TERMS</h2>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">1. Advance Payment:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        A payment of 50% of the total project cost is required as an advance before commencing the work.
                      </li>
                      <li>This advance payment ensures resource allocation and commitment to the agreed timelines.</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">2. Final Payment:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        The remaining 50% of the total project cost shall be payable upon successful delivery of the
                        assessment report, including all agreed-upon deliverables.
                      </li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">3. Payment Schedule and Terms:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>The advance payment must be cleared within [3] days of signing the agreement.</li>
                      <li>The final payment is to be made within [6] days of delivery of the final deliverables.</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Approval Process for Additional Work:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Any additional scope will be discussed in detail with the client prior to commencement.</li>
                      <li>A formal agreement will be reached, outlining the additional cost, deliverables.</li>
                      <li>This ensures transparency and alignment with the client's needs and expectations.</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Additional Scope and Billing</h3>
                    <p className="mb-2">
                      Any additional scope of work that may arise outside of the defined assessment will be billed
                      separately. This includes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Requests for deeper analysis or assessments beyond the agreed-upon scope.</li>
                      <li>Additional domains or systems introduced during the engagement.</li>
                      <li>Remediation or implementation of recommended controls.</li>
                    </ul>
                    <p className="mt-4 mb-2">The cost for such additional services will be based on:</p>
                    <ul className="list-disc pl-5">
                      <li>The specific requirements.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

