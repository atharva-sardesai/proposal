"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/file-upload"
import Image from 'next/image'

export default function BrandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "Seccomply",
    ceoName: "Shivani Tikadia",
    companyAddress: "123 Security Ave, Cyber City, 12345",
    companyEmail: "info@seccomply.net",
    companyPhone: "+1 (555) 123-4567",
    companyWebsite: "seccomply.net",
    primaryColor: "#4f46e5",
    secondaryColor: "#10b981",
    fontFamily: "Inter, sans-serif",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would save to a database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Branding Updated",
        description: "Your company branding settings have been updated successfully.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update branding settings.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Company Branding</h1>

      <Card>
        <CardHeader>
          <CardTitle>Branding Settings</CardTitle>
          <CardDescription>Customize the branding elements for your proposals.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="ceoName">CEO Name</Label>
                <Input id="ceoName" name="ceoName" value={formData.ceoName} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="companyAddress">Company Address</Label>
                <Input
                  id="companyAddress"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <Input
                    id="companyEmail"
                    name="companyEmail"
                    type="email"
                    value={formData.companyEmail}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="companyPhone">Company Phone</Label>
                  <Input id="companyPhone" name="companyPhone" value={formData.companyPhone} onChange={handleChange} />
                </div>
              </div>

              <div>
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Company Logo</Label>
                <div className="mb-2">
                  <Image
                    src="https://seccomply.net/wp-content/uploads/2023/05/seccomply-logo.png"
                    alt="Seccomply Logo"
                    width={48}
                    height={48}
                    className="h-12 object-contain"
                  />
                </div>
                <FileUpload
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                  onUpload={(file) => console.log("File uploaded:", file)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="w-16 h-10"
                    />
                    <Input
                      name="primaryColorHex"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      name="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={handleChange}
                      className="w-16 h-10"
                    />
                    <Input
                      name="secondaryColorHex"
                      value={formData.secondaryColor}
                      onChange={handleChange}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Input id="fontFamily" name="fontFamily" value={formData.fontFamily} onChange={handleChange} />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Branding Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

