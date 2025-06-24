"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProposalData } from "../types/proposal"

export default function ScopeOfWorkForm({ data, updateData, onContinue }: { data: ProposalData['scopes']; updateData: (data: ProposalData['scopes']) => void; onContinue: () => void }) {
  // data is now an array of service scopes
  const [services, setServices] = useState(data && Array.isArray(data) ? data : [])
  const [editingIndex, setEditingIndex] = useState(-1)
  const defaultScope = { serviceType: "", description: "", deliverables: "", timeline: "" };
  const [form, setForm] = useState<{ serviceType: string; description: string; deliverables: string; timeline: string }>(defaultScope);

  // When editing, populate form
  function handleEdit(index: number) {
    setEditingIndex(index)
    setForm({
      serviceType: services[index].serviceType || "",
      description: services[index].description || "",
      deliverables: services[index].deliverables || "",
      timeline: services[index].timeline || "",
    })
  }

  function handleRemove(index: number) {
    const updated = services.filter((_, i) => i !== index)
    setServices(updated)
    updateData(updated)
  }

  function handleAddOrUpdate(e: React.FormEvent) {
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
    setForm(defaultScope)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
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
          <select name="serviceType" value={form.serviceType} onChange={handleSelectChange} className="w-full border rounded p-2">
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
            <Button type="button" variant="outline" onClick={() => { setEditingIndex(-1); setForm(defaultScope) }}>Cancel</Button>
          )}
        </div>
      </form>
      <div>
        <h3 className="font-semibold mb-2">Added Services</h3>
        {services.length === 0 && <div className="text-muted-foreground">No services added yet.</div>}
        <ul className="space-y-2">
          {services.map((svc, i: number) => (
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

