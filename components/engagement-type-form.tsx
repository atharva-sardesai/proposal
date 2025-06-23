"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  type: z.enum(["one-time", "ongoing", "retainer"]),
  details: z.string().optional(),
})

export default function EngagementTypeForm({ data, updateData, onContinue }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      type: "one-time",
      details: "",
    },
  })

  function onSubmit(values) {
    updateData(values)
    if (onContinue) onContinue()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Engagement Type</h2>
        <p className="text-muted-foreground">Select the type of engagement for this proposal.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Engagement Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="one-time" />
                      </FormControl>
                      <FormLabel className="font-normal">One-time Project</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ongoing" />
                      </FormControl>
                      <FormLabel className="font-normal">Ongoing Services</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="retainer" />
                      </FormControl>
                      <FormLabel className="font-normal">Retainer Agreement</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional details about the engagement type..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Provide any additional information about the engagement type.</FormDescription>
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

