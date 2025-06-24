import { type NextRequest, NextResponse } from "next/server"
import { generateDOCX } from "@/lib/generate-docx"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const result = await generateDOCX(data)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to generate document" }, { status: 500 })
    }

    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        "Content-Type": result.contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${result.filename}"`,
      },
    })
  } catch (error) {
    console.error("Error in document generation API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

