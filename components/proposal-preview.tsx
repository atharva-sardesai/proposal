"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Mail, FileSignature } from "lucide-react"
// PDFViewer has been replaced with ClientPDFViewer
import { sendProposalByEmail } from "@/lib/actions"
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
import ServerDOCXButton from "@/components/server-docx-button"

export default function ProposalPreview({ data }) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [emailAddress, setEmailAddress] = useState(data.company.contactEmail || "")
  const [isSending, setIsSending] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")
  const [showNDA, setShowNDA] = useState(false)

  const handleSendEmail = async () => {
    try {
      setIsSending(true)
      await sendProposalByEmail(data, emailAddress)
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

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount)
  }

  const getPaymentTermsText = (terms) => {
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

  const getEngagementTypeText = (type) => {
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

  const getServiceTypeText = (type) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Proposal Preview</h2>
        <p className="text-muted-foreground">Review your proposal before generating the final document.</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <ServerDOCXButton data={data} />
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
                      <p>{data.company.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p>{data.company.address || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                      <p>{data.company.contactName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                      <p>{data.company.contactEmail || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                      <p>{data.company.contactPhone || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Financial Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Quoted Amount</p>
                      <p>
                        {data.financials.quotedAmount
                          ? formatCurrency(data.financials.quotedAmount, data.financials.currency)
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Payment Terms</p>
                      <p>{getPaymentTermsText(data.financials.paymentTerms) || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Scope of Work</h3>
                  <div className="space-y-4">
                    {Array.isArray(data.scopes) && data.scopes.length > 0 ? (
                      data.scopes.map((scope, idx) => (
                        <div key={idx} className="border rounded p-3 mb-2">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                            <p>{getServiceTypeText(scope.serviceType) || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Description</p>
                            <p className="whitespace-pre-line">{scope.description || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Deliverables</p>
                            <p className="whitespace-pre-line">{scope.deliverables || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                            <p className="whitespace-pre-line">{scope.timeline || "N/A"}</p>
                          </div>
                        </div>
                      ))
                    ) : data.scope ? (
                      <div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                          <p>{getServiceTypeText(data.scope.serviceType) || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Description</p>
                          <p className="whitespace-pre-line">{data.scope.description || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Deliverables</p>
                          <p className="whitespace-pre-line">{data.scope.deliverables || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                          <p className="whitespace-pre-line">{data.scope.timeline || "N/A"}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">No scope of work defined.</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Engagement Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Engagement Type</p>
                      <p>{getEngagementTypeText(data.engagement.type) || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Project Dates</p>
                      <p>
                        {data.dates.startDate ? format(new Date(data.dates.startDate), "PPP") : "N/A"} to{" "}
                        {data.dates.endDate ? format(new Date(data.dates.endDate), "PPP") : "N/A"}
                      </p>
                    </div>
                  </div>
                  {data.engagement.details && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground">Additional Details</p>
                      <p className="whitespace-pre-line">{data.engagement.details}</p>
                    </div>
                  )}
                </div>

                {data.compliance.requirements && data.compliance.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Compliance Requirements</h3>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Compliance Types</p>
                      <ul className="list-disc list-inside">
                        {data.compliance.requirements.map((req) => (
                          <li key={req}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    {data.compliance.details && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground">Additional Details</p>
                        <p className="whitespace-pre-line">{data.compliance.details}</p>
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
                    shall not include information that: (i) is or becomes generally known to the public; (ii) was known
                    to Receiving Party prior to its disclosure by Disclosing Party; (iii) is received from a third party
                    without restriction; or (iv) is independently developed by Receiving Party.
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
                    <p>{data.company.name || "[Client Company Name]"}</p>
                    <div className="border-t border-black mt-16 mb-2"></div>
                    <p>Signature</p>
                    <p>
                      {data.company.contactName || "[Client Representative Name]"},{" "}
                      {data.company.contactName ? "Representative" : "[Title]"}
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
  )
}

