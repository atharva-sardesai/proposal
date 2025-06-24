"use server"

import { renderToBuffer } from "@react-pdf/renderer"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { format } from "date-fns"
import { ProposalData } from "@/types/proposal"

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
  },
})

export async function generatePDF(data: ProposalData) {
  try {
    // Create a PDF document
    const MyDocument = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.companyName}>Seccomply</Text>
            <Text style={styles.text}>Shivani Tikadia, CEO</Text>
            <Text style={styles.title}>Project Proposal</Text>
            <Text style={styles.subtitle}>Prepared for: {data.company?.name || "Client"}</Text>
            <Text style={styles.text}>Date: {format(new Date(), "MMMM d, yyyy")}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Client Information</Text>
            <Text style={styles.text}>Company: {data.company?.name || "N/A"}</Text>
            <Text style={styles.text}>Address: {data.company?.address || "N/A"}</Text>
            <Text style={styles.text}>Contact: {data.company?.contactName || "N/A"}</Text>
            <Text style={styles.text}>Email: {data.company?.contactEmail || "N/A"}</Text>
            <Text style={styles.text}>Phone: {data.company?.contactPhone || "N/A"}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Project Dates</Text>
            <Text style={styles.text}>
              Start Date: {data.dates?.startDate ? format(new Date(data.dates.startDate), "MMMM d, yyyy") : "N/A"}
            </Text>
            <Text style={styles.text}>
              End Date: {data.dates?.endDate ? format(new Date(data.dates.endDate), "MMMM d, yyyy") : "N/A"}
            </Text>
          </View>

          {data.scopes?.map((scope, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.header}>Scope of Work: {scope.serviceType}</Text>
              <Text>{scope.description}</Text>
            </View>
          ))}

          <View style={styles.section}>
            <Text style={styles.header}>Financial Details</Text>
            <Text style={styles.text}>
              Quoted Amount:{" "}
              {data.financials?.quotedAmount ? `${data.financials.currency} ${data.financials.quotedAmount}` : "N/A"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Payment Terms</Text>
            <Text style={styles.text}>• 50% advance payment required before commencing work</Text>
            <Text style={styles.text}>• 50% final payment upon delivery of deliverables</Text>
            <Text style={styles.text}>• Advance payment due within 3 days of signing</Text>
            <Text style={styles.text}>• Final payment due within 6 days of delivery</Text>
          </View>

          <Text style={styles.footer}>
            This proposal is from Seccomply and includes our standard terms and conditions.
          </Text>
        </Page>
      </Document>
    )

    // Generate PDF as a buffer
    const pdfBuffer = await renderToBuffer(MyDocument)

    // Return the PDF buffer
    return {
      success: true,
      buffer: pdfBuffer,
      contentType: "application/pdf",
      filename: `Proposal-${data.company?.name || "Client"}.pdf`,
    }
  } catch (error: any) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate PDF")
  }
}

