"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  quotedAmount: z.string().min(1, { message: "Quoted amount is required." }),
  paymentTerms: z.string(),
  currency: z.string(),
})

export default function FinancialsForm({ data, updateData, onContinue }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      quotedAmount: "",
      paymentTerms: "net30",
      currency: "USD",
    },
  })

  function onSubmit(values) {
    updateData(values)
    if (onContinue) onContinue()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Financial Details</h2>
        <p className="text-muted-foreground">Enter the financial information for this proposal.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="quotedAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quoted Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="10000" {...field} />
                  </FormControl>
                  <FormDescription>Enter the amount without currency symbols</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="paymentTerms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Terms</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="net15">Net 15 Days</SelectItem>
                    <SelectItem value="net30">Net 30 Days</SelectItem>
                    <SelectItem value="net45">Net 45 Days</SelectItem>
                    <SelectItem value="net60">Net 60 Days</SelectItem>
                    <SelectItem value="immediate">Immediate Payment</SelectItem>
                    <SelectItem value="custom">Custom Terms</SelectItem>
                  </SelectContent>
                </Select>
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

