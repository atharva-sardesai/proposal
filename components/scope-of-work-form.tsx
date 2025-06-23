"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

const formSchema = z.object({
  serviceType: z.string().min(1, { message: "Service type is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  deliverables: z.string().min(10, { message: "Deliverables must be at least 10 characters." }),
  timeline: z.string().min(5, { message: "Timeline must be at least 5 characters." }),
})

// Predefined content for each service type
const serviceTypeContent = {
  "iso27001-audit": {
    description:
      "Comprehensive audit of the organization's Information Security Management System (ISMS) against ISO 27001:2013 standards. This includes evaluation of existing controls, documentation review, and gap analysis to determine compliance with the standard.",
    deliverables:
      "- Detailed audit report highlighting findings and observations\n- Gap analysis document\n- Compliance status report\n- Recommendations for remediation\n- Statement of applicability review\n- Executive summary presentation",
  },
  "iso27001-implementation": {
    description:
      "End-to-end implementation of an Information Security Management System (ISMS) compliant with ISO 27001:2013 standards. This includes developing policies, procedures, and controls to protect information assets and manage information security risks.",
    deliverables:
      "- ISMS policy and procedure documentation\n- Risk assessment methodology and reports\n- Statement of Applicability (SoA)\n- Security controls implementation plan\n- ISMS manual and supporting documents\n- Staff awareness training materials\n- Implementation roadmap and timeline",
  },
  "iso27001-implementation-audit": {
    description:
      "Complete ISO 27001:2013 implementation and certification support, including development of an Information Security Management System (ISMS), implementation of required controls, and preparation for certification audit. This comprehensive service ensures your organization achieves ISO 27001 certification.",
    deliverables:
      "- ISMS policy and procedure documentation\n- Risk assessment methodology and reports\n- Statement of Applicability (SoA)\n- Security controls implementation\n- Internal audit reports\n- Management review documentation\n- Pre-certification gap analysis\n- Certification audit support\n- Remediation guidance for any non-conformities",
  },
  "soc2-type1": {
    description:
      "SOC 2 Type 1 assessment evaluating the design of controls relevant to Security, Availability, Processing Integrity, Confidentiality, and/or Privacy Trust Services Criteria at a specific point in time. This assessment verifies that your controls are suitably designed to meet the applicable trust services criteria.",
    deliverables:
      "- Readiness assessment report\n- Control matrix documentation\n- Gap analysis report\n- Remediation recommendations\n- SOC 2 Type 1 audit coordination\n- Final SOC 2 Type 1 report preparation support",
  },
  "soc2-type2": {
    description:
      "SOC 2 Type 2 assessment evaluating both the design and operating effectiveness of controls relevant to Security, Availability, Processing Integrity, Confidentiality, and/or Privacy Trust Services Criteria over a period of time (typically 6-12 months). This assessment verifies that your controls are not only suitably designed but also operating effectively.",
    deliverables:
      "- Readiness assessment report\n- Control matrix documentation\n- Gap analysis report\n- Remediation recommendations\n- Ongoing control monitoring support\n- SOC 2 Type 2 audit coordination\n- Final SOC 2 Type 2 report preparation support",
  },
  vapt: {
    description:
      "Comprehensive Vulnerability Assessment and Penetration Testing (VAPT) of your organization's IT infrastructure, applications, and networks to identify security vulnerabilities, weaknesses, and potential entry points for attackers. This includes both automated scanning and manual testing techniques.",
    deliverables:
      "- Detailed vulnerability assessment report\n- Penetration testing findings report\n- Risk severity classification\n- Exploitation proof of concepts\n- Remediation recommendations with priorities\n- Executive summary presentation\n- Technical vulnerability details and evidence",
  },
  "security-assessment": {
    description:
      "Holistic security assessment of your organization's security posture, including review of policies, procedures, technical controls, physical security, and human factors. This assessment provides a comprehensive view of your current security state and identifies areas for improvement.",
    deliverables:
      "- Comprehensive security assessment report\n- Gap analysis against industry standards\n- Risk register with prioritized findings\n- Security control effectiveness evaluation\n- Remediation roadmap with short and long-term recommendations\n- Executive presentation of findings",
  },
  "cloud-security-assessment": {
    description:
      "Specialized assessment of your cloud environment security across infrastructure, configurations, access controls, and data protection. This assessment evaluates your cloud security posture against best practices and compliance requirements specific to cloud platforms (AWS, Azure, GCP, etc.).",
    deliverables:
      "- Cloud security posture report\n- Configuration review findings\n- Identity and access management assessment\n- Data protection controls evaluation\n- Cloud-specific vulnerability findings\n- Compliance gap analysis\n- Remediation recommendations prioritized by risk\n- Cloud security architecture improvement recommendations",
  },
}

export default function ScopeOfWorkForm({ data, updateData, onContinue }) {
  // data is now an array of service scopes
  const [services, setServices] = useState(data && Array.isArray(data) ? data : [])
  const [editingIndex, setEditingIndex] = useState(-1)
  const [form, setForm] = useState({
    serviceType: "",
    description: "",
    deliverables: "",
    timeline: "",
  })

  // When editing, populate form
  function handleEdit(index) {
    setEditingIndex(index)
    setForm(services[index])
  }

  function handleRemove(index) {
    const updated = services.filter((_, i) => i !== index)
    setServices(updated)
    updateData(updated)
  }

  function handleAddOrUpdate(e) {
    e.preventDefault()
    let updated
    if (editingIndex >= 0) {
      updated = services.map((s, i) => (i === editingIndex ? form : s))
    } else {
      updated = [...services, form]
    }
    setServices(updated)
    updateData(updated)
    setEditingIndex(-1)
    setForm({ serviceType: "", description: "", deliverables: "", timeline: "" })
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Scope of Work</h2>
        <p className="text-muted-foreground">Define the scope of work for this proposal. You can add multiple services.</p>
      </div>
      <form onSubmit={handleAddOrUpdate} className="space-y-4">
        <div>
          <label className="block font-medium">Service Type</label>
          <select name="serviceType" value={form.serviceType} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select a service type</option>
            <option value="iso27001-audit">ISO 27001 Audit Only</option>
            <option value="iso27001-implementation">ISO 27001 Implementation Only</option>
            <option value="iso27001-implementation-audit">ISO 27001 Implementation + Audit</option>
            <option value="soc2-type1">SOC 2 Type 1</option>
            <option value="soc2-type2">SOC 2 Type 2</option>
            <option value="vapt">VAPT</option>
            <option value="security-assessment">Security Assessment</option>
            <option value="cloud-security-assessment">Cloud Security Assessment</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Project Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded p-2 min-h-[80px]" />
        </div>
        <div>
          <label className="block font-medium">Deliverables</label>
          <textarea name="deliverables" value={form.deliverables} onChange={handleChange} className="w-full border rounded p-2 min-h-[80px]" />
        </div>
        <div>
          <label className="block font-medium">Timeline</label>
          <textarea name="timeline" value={form.timeline} onChange={handleChange} className="w-full border rounded p-2 min-h-[40px]" />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="w-full">{editingIndex >= 0 ? "Update Service" : "Add Service"}</Button>
          {editingIndex >= 0 && (
            <Button type="button" variant="outline" onClick={() => { setEditingIndex(-1); setForm({ serviceType: "", description: "", deliverables: "", timeline: "" }) }}>Cancel</Button>
          )}
        </div>
      </form>
      <div>
        <h3 className="font-semibold mb-2">Added Services</h3>
        {services.length === 0 && <div className="text-muted-foreground">No services added yet.</div>}
        <ul className="space-y-2">
          {services.map((svc, i) => (
            <li key={i} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="font-medium">{svc.serviceType}</div>
                <div className="text-sm text-muted-foreground">{svc.description}</div>
                <div className="text-xs">Deliverables: {svc.deliverables}</div>
                <div className="text-xs">Timeline: {svc.timeline}</div>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => handleEdit(i)}>Edit</Button>
                <Button type="button" size="sm" variant="destructive" onClick={() => handleRemove(i)}>Remove</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end">
        <Button type="button" onClick={onContinue} disabled={services.length === 0}>Save and Continue</Button>
      </div>
    </div>
  )
}

