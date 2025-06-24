"use server"

import { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, ImageRun, BorderStyle, IImageOptions, Header } from "docx";
import { ProposalData, Scope } from "../types/proposal";
import fs from "fs/promises";
import path from "path";

interface ServiceDetails {
  [key: string]: {
    description: string;
    deliverables: string[];
    timeline: string;
    targets?: string;
    testingApproach?: string;
    focusAreas?: string;
    methodology?: string;
    outOfScope?: string;
    name?: string;
  };
}

export async function generateDOCX(data: ProposalData) {
  try {
    // Load service details
    const serviceDetailsPath = path.join(process.cwd(), "service-details.json");
    const serviceDetailsContent = await fs.readFile(serviceDetailsPath, "utf-8");
    const serviceDetails: ServiceDetails = JSON.parse(serviceDetailsContent);

    // Load the logo image as a buffer
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    let logoBuffer: Uint8Array | undefined = undefined;
    try {
      const fileBuffer = await fs.readFile(logoPath);
      logoBuffer = new Uint8Array(Buffer.from(fileBuffer).buffer);
    } catch (e) {
      console.warn("Logo image not found, skipping logo in DOCX.");
    }

    // Compose the scopes array, filtering out empty scopes
    const scopes = (data.scopes && data.scopes.length > 0)
      ? data.scopes
          .filter(s =>
            s.serviceType && s.serviceType.trim() !== "" &&
            ((s.description && s.description.trim() !== "") ||
              (s.deliverables && s.deliverables.toString().trim() !== "") ||
              (s.timeline && s.timeline.trim() !== "") ||
              ((s as any).targets && (s as any).targets.trim() !== "") ||
              ((s as any).testingApproach && (s as any).testingApproach.trim() !== "") ||
              ((s as any).focusAreas && (s as any).focusAreas.trim() !== "") ||
              ((s as any).methodology && (s as any).methodology.trim() !== "") ||
              ((s as any).outOfScope && (s as any).outOfScope.trim() !== ""))
          )
          .map((s, i) => ({
            ...s,
            ...(s.serviceType && serviceDetails[s.serviceType] ? serviceDetails[s.serviceType] : {}),
            serviceType: s.serviceType || "",
            name: (s.serviceType && serviceDetails[s.serviceType]?.name) ? serviceDetails[s.serviceType].name : s.serviceType || "",
            deliverables: (() => {
              const d = s.deliverables;
              const sd = s.serviceType && serviceDetails[s.serviceType]?.deliverables;
              if (Array.isArray(d)) return d.join(", ");
              if (Array.isArray(sd)) return sd.join(", ");
              return d || sd || "";
            })(),
          }))
      : [];
    const firstScope = scopes[0] || {};

    const safe = (val: any) => (val ? val : "N/A");
    const join = (arr: any) => Array.isArray(arr) ? arr.join(", ") : safe(arr);

    // Helper for styled paragraphs
    const styledParagraph = (text: string, opts: any = {}) => new Paragraph({
      text,
      style: opts.heading ? "SectionHeader" : "NormalBig",
      ...opts,
    });

    // Format dates as YYYY-MM-DD
    const formatDateOnly = (dateStr: string) => {
      if (!dateStr) return "N/A";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "N/A";
      return d.toISOString().slice(0, 10);
    };

    // Compose the title with all service names
    const serviceNames = scopes.map(s => s.name || s.serviceType).filter(Boolean);
    let titleText = "Proposal for " + (serviceNames.length === 1
      ? serviceNames[0]
      : serviceNames.length === 2
        ? serviceNames.join(" & ")
        : serviceNames.slice(0, -1).join(", ") + " & " + serviceNames[serviceNames.length - 1]);
    const startDate = formatDateOnly(data.dates.startDate);
    const endDate = formatDateOnly(data.dates.endDate);

    const doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "NormalBig",
            name: "Normal Big",
            basedOn: "Normal",
            next: "NormalBig",
            run: {
              size: 28, // 14pt (half-points)
            },
            paragraph: {},
          },
          {
            id: "Title",
            name: "Title",
            basedOn: "Normal",
            next: "NormalBig",
            run: {
              size: 48, // 24pt
              bold: true,
            },
            paragraph: {
              spacing: { after: 300 },
            },
          },
          {
            id: "SectionHeader",
            name: "Section Header",
            basedOn: "NormalBig",
            next: "NormalBig",
            run: {
              color: "2563eb", // blue-600
              bold: true,
              size: 28,
            },
            paragraph: {},
          },
        ],
      },
      sections: [
        {
          headers: {
            default: logoBuffer
              ? new Header({
                  children: [
                    new Paragraph({
                      children: [
                        new ImageRun({
                          data: logoBuffer as Uint8Array,
                          transformation: { width: 160, height: 60 },
                        } as IImageOptions),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                })
              : undefined,
          },
          children: [
            new Paragraph({
              text: titleText,
              heading: HeadingLevel.TITLE,
              style: "Title",
            }),
            styledParagraph(`Client: ${safe(data.company.name)}`),
            styledParagraph(`Prepared By: SecComply`),
            styledParagraph(`Date: ${startDate}`),
            new Paragraph({ text: " ", spacing: { after: 200 } }),
            styledParagraph("Introduction", { heading: HeadingLevel.HEADING_2 }),
            styledParagraph(`SecComply is pleased to present this proposal for ${serviceNames.join(", ")} services. ${safe(firstScope.description)} Our objective is to help ${safe(data.company.name)} achieve its information security and compliance goals through a structured, phased, and customized approach aligned with industry best practices.`),
            new Paragraph({ text: " ", spacing: { after: 200 } }),
            ...scopes.flatMap((scope, idx) => [
              styledParagraph(`Scope of Services (${scope.name || scope.serviceType})`, { heading: HeadingLevel.HEADING_2 }),
              styledParagraph(`This section outlines the scope for ${safe(scope.name || scope.serviceType)}. The following activities will be conducted as part of the engagement:`),
              styledParagraph(`Targets: ${safe(scope.targets)}`),
              styledParagraph(`Testing/Assessment Approach: ${safe(scope.testingApproach)}`),
              styledParagraph(`Focus Areas: ${safe(scope.focusAreas)}`),
              styledParagraph(`Methodology: ${safe(scope.methodology)}`),
              new Paragraph({ text: " ", spacing: { after: 200 } }),
              styledParagraph(`Deliverables (${scope.name || scope.serviceType})`, { heading: HeadingLevel.HEADING_2 }),
              styledParagraph(`Upon completion, the following deliverables will be provided:`),
              styledParagraph(`${join(scope.deliverables)}`),
              new Paragraph({ text: " ", spacing: { after: 200 } }),
              styledParagraph(`Out of Scope (${scope.name || scope.serviceType})`, { heading: HeadingLevel.HEADING_2 }),
              styledParagraph(`The following are considered out of scope for this engagement:`),
              styledParagraph(`${safe(scope.outOfScope)}`),
              new Paragraph({ text: " ", spacing: { after: 200 } }),
              styledParagraph(`Timeline (${scope.name || scope.serviceType})`, { heading: HeadingLevel.HEADING_2 }),
              styledParagraph(`The proposed engagement will follow the timeline below:`),
              styledParagraph(`Start Date: ${startDate}`),
              styledParagraph(`End Date: ${endDate}`),
              styledParagraph(`Estimated Duration: ${safe(scope.timeline)}`),
              new Paragraph({ text: " ", spacing: { after: 200 } }),
            ]),
            styledParagraph("Roles and Responsibilities", { heading: HeadingLevel.HEADING_2 }),
            styledParagraph(`SecComply will be responsible for planning, execution, and reporting of the ${safe(firstScope.name || firstScope.serviceType)} activities. This includes:`),
            styledParagraph(`${safe(data.engagement.details)}`),
            styledParagraph(`The client, ${safe(data.company.name)}, will be expected to:`),
            styledParagraph(`- Provide required access and credentials`),
            styledParagraph(`- Coordinate with stakeholders`),
            styledParagraph(`- Support during testing and remediation`),
            new Paragraph({ text: " ", spacing: { after: 200 } }),
            styledParagraph("Cost & Commercials", { heading: HeadingLevel.HEADING_2 }),
            styledParagraph(`Quoted Amount: ${safe(data.financials.quotedAmount)} ${safe(data.financials.currency)}`),
            styledParagraph(`Payment Terms: ${safe(data.financials.paymentTerms)}`),
            styledParagraph(`50% of the payment is to be made in advance to initiate the project. The remaining 50% is payable upon successful delivery of all project deliverables. Any changes to the scope may affect the quoted amount and will be discussed and agreed upon in writing.`),
            new Paragraph({ text: " ", spacing: { after: 200 } }),
            styledParagraph("Compliance Requirements", { heading: HeadingLevel.HEADING_2 }),
            styledParagraph(`Compliance requirements relevant to this engagement include:`),
            styledParagraph(`${join(data.compliance?.requirements)}`),
            styledParagraph(`Additional Details: ${safe(data.compliance?.details)}`),
            new Paragraph({ text: " ", spacing: { after: 200 } }),
            styledParagraph("Contact Details", { heading: HeadingLevel.HEADING_2 }),
            styledParagraph(`Contact Person: ${safe(data.company.contactName)}`),
            styledParagraph(`Email: ${safe(data.company.contactEmail)}`),
            styledParagraph(`Phone: ${safe(data.company.contactPhone)}`),
            styledParagraph(`Address: ${safe(data.company.address)}`),
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

