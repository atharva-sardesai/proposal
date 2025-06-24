"use server"

import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";
import { ProposalData, Scope } from "../types/proposal";
import htmlDocx from "html-docx-js";

interface ServiceDetails {
  [key: string]: {
    description: string;
    deliverables: string[];
    timeline: string;
  };
}

export async function generateDOCX(data: ProposalData) {
  try {
    const templatePath = path.join(process.cwd(), "proposal-template.md");
    const templateContent = await fs.readFile(templatePath, "utf-8");

    const serviceDetailsPath = path.join(process.cwd(), "service-details.json");
    const serviceDetailsContent = await fs.readFile(serviceDetailsPath, "utf-8");
    const serviceDetails: ServiceDetails = JSON.parse(serviceDetailsContent);

    const enrichedScopes = (data.scopes || []).map((scope: Scope) => {
      const details = serviceDetails[scope.serviceType];
      return {
        ...scope,
        ...details,
      };
    });

    const fullData = {
      ...data,
      scopes: enrichedScopes,
    };

    const template = handlebars.compile(templateContent);
    const renderedMarkdown = template(fullData);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <style>
      body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; }
      h1 { font-size: 24pt; text-align: center; font-weight: bold; }
      h2 { font-size: 18pt; font-weight: bold; }
      h3 { font-size: 14pt; font-weight: bold; }
      strong { font-weight: bold; }
      ul { list-style-type: disc; margin-left: 40px; }
      p { margin-bottom: 10px; }
      </style>
      </head>
      <body>
      ${renderedMarkdown
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br>")}
      </body>
      </html>
    `;

    const generated = htmlDocx.asBlob(htmlContent) as Blob;

    const buffer = Buffer.from(await generated.arrayBuffer());

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

