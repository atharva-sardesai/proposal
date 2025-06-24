import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, History, Settings } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Proposal Automation Portal</h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Generate professional, branded proposals in minutes with our automated system.
        </p>

        <div className="flex justify-center w-full max-w-5xl">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create New Proposal</CardTitle>
                <CardDescription>Generate a new proposal for a client</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <FileText className="h-24 w-24 text-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/proposals/new" className="w-full">
                  <Button className="w-full">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

