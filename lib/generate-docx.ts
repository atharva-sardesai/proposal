"use server"

import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } from "docx";

export async function generateDOCX(data: any) {
  try {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: `Proposal for ${data.company?.name || "Client"}`,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: `Date: ${data.dates?.startDate || ""}` }),
            new Paragraph({ text: `Proposal ID: ${data.id || ""}` }),
            new Paragraph({ text: `Contact Person: ${data.company?.contactName || ""}` }),
            new Paragraph({ text: `Email: ${data.company?.contactEmail || ""}` }),
            new Paragraph({ text: `Phone: ${data.company?.contactPhone || ""}` }),
            new Paragraph({ text: `Address: ${data.company?.address || ""}` }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Engagement Type", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: data.engagement?.type || "" }),
            new Paragraph({ text: "Engagement Details", heading: HeadingLevel.HEADING_3 }),
            new Paragraph({ text: data.engagement?.details || "" }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Services & Scope of Work", heading: HeadingLevel.HEADING_2 }),
            ...((Array.isArray(data.scopes) ? data.scopes : []).map((scope: any, idx: number) => [
              new Paragraph({
                text: `Service: ${scope.serviceType || ""}`,
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({ text: `Description: ${scope.description || ""}` }),
              new Paragraph({ text: `Deliverables: ${scope.deliverables || ""}` }),
              new Paragraph({ text: `Timeline: ${scope.timeline || ""}` }),
              new Paragraph({ text: "---" }),
            ]).flat()),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Financials", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: `Quoted Amount: ${data.financials?.quotedAmount || ""} ${data.financials?.currency || ""}` }),
            new Paragraph({ text: `Payment Terms: ${data.financials?.paymentTerms || ""}` }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Compliance", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Compliance Requirements:" }),
            ...(Array.isArray(data.compliance?.requirements) && data.compliance.requirements.length > 0
              ? data.compliance.requirements.map((req: string) => new Paragraph({ text: `- ${req}` }))
              : [new Paragraph({ text: "- None" })]),
            new Paragraph({ text: `Additional Details: ${data.compliance?.details || ""}` }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Project Dates", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: `Start Date: ${data.dates?.startDate || ""}` }),
            new Paragraph({ text: `End Date: ${data.dates?.endDate || ""}` }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Thank you for considering our proposal." }),
            new Paragraph({
              children: [
                new TextRun({ text: "Seccomply", bold: true })
              ]
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return {
      success: true,
      buffer,
      contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      filename: `Proposal-${data.company?.name || "Client"}.docx`,
    };
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

