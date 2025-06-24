import { type NextRequest, NextResponse } from "next/server"
import { generatePDF } from "@/lib/generate-pdf"
import { ProposalData } from "@/types/proposal"

export async function POST(request: NextRequest) {
  try {
    const data: ProposalData = await request.json()

    const result = await generatePDF(data)

    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
      },
    })
  } catch (error: any) {
    console.error("Error in PDF preview API:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

