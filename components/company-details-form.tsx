"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  contactName: z.string().min(2, { message: "Contact name must be at least 2 characters." }),
  contactEmail: z.string().email({ message: "Please enter a valid email address." }),
  contactPhone: z.string().min(10, { message: "Please enter a valid phone number." }),
})

export default function CompanyDetailsForm({ data, updateData, onContinue }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      name: "",
      address: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    },
  })

  function onSubmit(values) {
    updateData(values)
    if (onContinue) onContinue()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Company Details</h2>
        <p className="text-muted-foreground">Enter the client company information for the proposal.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Business St, City, State, ZIP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Point of Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@acme.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Save and Continue
          </Button>
        </form>
      </Form>
    </div>
  )
}

