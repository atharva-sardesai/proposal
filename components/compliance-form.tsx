"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

const complianceTypes = [
  { id: "iso27001", label: "ISO 27001" },
  { id: "soc2", label: "SOC 2" },
  { id: "gdpr", label: "GDPR" },
  { id: "hipaa", label: "HIPAA" },
  { id: "pci", label: "PCI DSS" },
  { id: "ccpa", label: "CCPA" },
]

const formSchema = z.object({
  requirements: z.array(z.string()).optional(),
  details: z.string().optional(),
})

interface ComplianceFormProps {
  data: z.infer<typeof formSchema> | null;
  updateData: (data: z.infer<typeof formSchema>) => void;
  onContinue: () => void;
}

export default function ComplianceForm({ data, updateData, onContinue }: ComplianceFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      requirements: [],
      details: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateData(values)
    if (onContinue) onContinue()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Compliance Requirements</h2>
        <p className="text-muted-foreground">Select the compliance requirements for this proposal.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="requirements"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Compliance Types</FormLabel>
                  <FormDescription>Select all compliance requirements that apply to this project.</FormDescription>
                </div>
                {complianceTypes.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="requirements"
                    render={({ field }) => {
                      return (
                        <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                return checked
                                  ? field.onChange([...currentValue, item.id])
                                  : field.onChange(currentValue.filter((value) => value !== item.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item.label}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Compliance Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional compliance details or requirements..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Provide any additional compliance information or requirements.</FormDescription>
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

