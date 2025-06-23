"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { saveTemplateSettings, saveUserSettings } from "@/lib/actions"
import { FileUpload } from "@/components/file-upload"

export default function AdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTemplateSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await saveTemplateSettings({
        // Form data would be collected here
      })

      toast({
        title: "Settings Saved",
        description: "Template settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template settings.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await saveUserSettings({
        // Form data would be collected here
      })

      toast({
        title: "Settings Saved",
        description: "User settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save user settings.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>

      <Tabs defaultValue="templates">
        <TabsList className="mb-8">
          <TabsTrigger value="templates">Proposal Templates</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="documents">Legal Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Template Settings</CardTitle>
              <CardDescription>Customize the default proposal template and sections.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTemplateSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input id="template-name" defaultValue="Standard Proposal Template" />
                  </div>

                  <div>
                    <Label htmlFor="header-text">Header Text</Label>
                    <Input id="header-text" defaultValue="Project Proposal" />
                  </div>

                  <div>
                    <Label htmlFor="footer-text">Footer Text</Label>
                    <Textarea
                      id="footer-text"
                      defaultValue="This proposal includes our standard MSA and NDA. All terms and conditions apply."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Sections to Include</Label>

                    <div className="flex items-center space-x-2">
                      <Switch id="section-company" defaultChecked />
                      <Label htmlFor="section-company">Company Details</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="section-financials" defaultChecked />
                      <Label htmlFor="section-financials">Financial Details</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="section-scope" defaultChecked />
                      <Label htmlFor="section-scope">Scope of Work</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="section-engagement" defaultChecked />
                      <Label htmlFor="section-engagement">Engagement Type</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="section-compliance" defaultChecked />
                      <Label htmlFor="section-compliance">Compliance</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="section-dates" defaultChecked />
                      <Label htmlFor="section-dates">Project Dates</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="section-msa" defaultChecked />
                      <Label htmlFor="section-msa">MSA</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="section-nda" defaultChecked />
                      <Label htmlFor="section-nda">NDA</Label>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Template Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and their permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUserSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input id="admin-email" type="email" defaultValue="admin@company.com" />
                  </div>

                  <div className="space-y-2">
                    <Label>User Permissions</Label>

                    <div className="flex items-center space-x-2">
                      <Switch id="perm-create" defaultChecked />
                      <Label htmlFor="perm-create">Create Proposals</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="perm-edit" defaultChecked />
                      <Label htmlFor="perm-edit">Edit Templates</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="perm-view" defaultChecked />
                      <Label htmlFor="perm-view">View All Proposals</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="perm-admin" defaultChecked />
                      <Label htmlFor="perm-admin">Admin Access</Label>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save User Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>Customize the branding elements for your proposals.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Your Company Name" />
                  </div>

                  <div>
                    <Label>Company Logo</Label>
                    <FileUpload
                      accept="image/*"
                      maxSize={5 * 1024 * 1024} // 5MB
                      onUpload={(file) => console.log("File uploaded:", file)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input id="primary-color" type="color" defaultValue="#4f46e5" className="w-16 h-10" />
                      <Input defaultValue="#4f46e5" className="flex-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input id="secondary-color" type="color" defaultValue="#10b981" className="w-16 h-10" />
                      <Input defaultValue="#10b981" className="flex-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="font">Font Family</Label>
                    <Input id="font" defaultValue="Inter, sans-serif" />
                  </div>
                </div>

                <Button type="submit">Save Branding Settings</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
              <CardDescription>Manage the legal documents attached to proposals.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Master Service Agreement (MSA)</Label>
                    <FileUpload
                      accept=".pdf,.docx,.doc"
                      maxSize={10 * 1024 * 1024} // 10MB
                      onUpload={(file) => console.log("MSA uploaded:", file)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">Current file: MSA-v2.1.pdf</p>
                  </div>

                  <div>
                    <Label>Non-Disclosure Agreement (NDA)</Label>
                    <FileUpload
                      accept=".pdf,.docx,.doc"
                      maxSize={10 * 1024 * 1024} // 10MB
                      onUpload={(file) => console.log("NDA uploaded:", file)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">Current file: NDA-v1.3.pdf</p>
                  </div>

                  <div>
                    <Label>Terms and Conditions</Label>
                    <FileUpload
                      accept=".pdf,.docx,.doc"
                      maxSize={10 * 1024 * 1024} // 10MB
                      onUpload={(file) => console.log("T&C uploaded:", file)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">Current file: Terms-v2.0.pdf</p>
                  </div>
                </div>

                <Button type="submit">Save Document Settings</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

