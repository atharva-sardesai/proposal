"use server"

import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from "docx";
import { ProposalData, Scope } from "../types/proposal";
import fs from "fs/promises";
import path from "path";

interface ServiceDetails {
  [key: string]: {
    description: string;
    deliverables: string[];
    timeline: string;
  };
}

export async function generateDOCX(data: ProposalData) {
  try {
    // Load service details
    const serviceDetailsPath = path.join(process.cwd(), "service-details.json");
    const serviceDetailsContent = await fs.readFile(serviceDetailsPath, "utf-8");
    const serviceDetails: ServiceDetails = JSON.parse(serviceDetailsContent);

    // Enrich scopes
    const enrichedScopes = (data.scopes || []).map((scope: Scope) => {
      const details = serviceDetails[scope.serviceType];
      return {
        ...scope,
        ...details,
      };
    });

    // Helper for empty values
    const safe = (val: any) => (val ? val : "N/A");

    // Build the document
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Project Proposal",
              heading: HeadingLevel.TITLE,
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: `Prepared for: ${safe(data.company.name)}`,
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: `Date: ${new Date().toLocaleDateString()}`,
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: "Company Details",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph(`Company: ${safe(data.company.name)}`),
            new Paragraph(`Address: ${safe(data.company.address)}`),
            new Paragraph(`Contact: ${safe(data.company.contactName)}`),
            new Paragraph(`Email: ${safe(data.company.contactEmail)}`),
            new Paragraph(`Phone: ${safe(data.company.contactPhone)}`),
            new Paragraph({ text: " ", spacing: { after: 200 } }),
            new Paragraph({
              text: "Project Dates",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph(`Start Date: ${safe(data.dates.startDate)}`),
            new Paragraph(`End Date: ${safe(data.dates.endDate)}`),
            new Paragraph({ text: " ", spacing: { after: 200 } }),
            new Paragraph({
              text: "Engagement Type",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph(`Type: ${safe(data.engagement.type)}`),
            new Paragraph(`Details: ${safe(data.engagement.details)}`),
            new Paragraph({ text: " ", spacing: { after: 200 } }),
            new Paragraph({
              text: "Scope of Work",
              heading: HeadingLevel.HEADING_2,
            }),
            ...enrichedScopes.map((scope, idx) => [
              new Paragraph({
                text: `${idx + 1}. ${safe(scope.serviceType)}`,
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph(`Description: ${safe(scope.description)}`),
              new Paragraph(`Deliverables: ${(scope.deliverables && Array.isArray(scope.deliverables)) ? scope.deliverables.join(", ") : safe(scope.deliverables)}`),
              new Paragraph(`Timeline: ${safe(scope.timeline)}`),
              new Paragraph({ text: " ", spacing: { after: 100 } }),
            ]).flat(),
            new Paragraph({
              text: "Financials",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph(`Quoted Amount: ${safe(data.financials.quotedAmount)} ${safe(data.financials.currency)}`),
            new Paragraph(`Payment Terms: ${safe(data.financials.paymentTerms)}`),
            new Paragraph({ text: " ", spacing: { after: 200 } }),
            new Paragraph({
              text: "Compliance",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph(`Requirements: ${Array.isArray(data.compliance?.requirements) ? data.compliance?.requirements.join(", ") : safe(data.compliance?.requirements)}`),
            new Paragraph(`Details: ${safe(data.compliance?.details)}`),
            new Paragraph({ text: " ", spacing: { after: 200 } }),
            new Paragraph({
              text: "Thank you for considering Seccomply!",
              heading: HeadingLevel.HEADING_2,
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

