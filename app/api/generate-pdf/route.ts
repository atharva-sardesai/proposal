import { type NextRequest, NextResponse } from "next/server"
import { generatePDF } from "@/lib/generate-pdf"
import { ProposalData } from "@/types/proposal"

export async function POST(request: NextRequest) {
  try {
    const data: ProposalData = await request.json()

    const result = await generatePDF(data)

    // Return the PDF as a downloadable file
    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
        "Content-Disposition": `attachment; filename="${result.filename}"`,
      },
    })
  } catch (error: any) {
    console.error("Error in PDF generation API:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

