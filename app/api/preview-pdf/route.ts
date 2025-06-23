import { type NextRequest, NextResponse } from "next/server"
import { generatePDF } from "@/lib/generate-pdf"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const result = await generatePDF(data)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to generate PDF" }, { status: 500 })
    }

    // Return the PDF as a downloadable file
    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${result.filename}"`,
      },
    })
  } catch (error) {
    console.error("Error in PDF preview generation API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

