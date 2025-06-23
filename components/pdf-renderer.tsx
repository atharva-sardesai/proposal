"use client"

import { useState, useEffect } from "react"
import FallbackPDFPreview from "@/components/fallback-pdf-preview"
import { format } from "date-fns"

// We'll only import react-pdf components after checking we're in a browser
let Document, Page, Text, View, StyleSheet, PDFViewer

export function PDFRenderer({ data, onEmailClick, onDownloadClick }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [ReactPDF, setReactPDF] = useState(null)

  useEffect(() => {
    // Only import react-pdf in the browser
    const loadReactPDF = async () => {
      try {
        // Dynamic import of react-pdf components
        const reactPDF = await import("@react-pdf/renderer")

        // Set the imported components
        Document = reactPDF.Document
        Page = reactPDF.Page
        Text = reactPDF.Text
        View = reactPDF.View
        StyleSheet = reactPDF.StyleSheet
        PDFViewer = reactPDF.PDFViewer

        setReactPDF(reactPDF)
        setIsLoaded(true)
      } catch (error) {
        console.error("Error loading react-pdf:", error)
        setHasError(true)
      }
    }

    loadReactPDF()

    // Add error handler for uncaught errors
    const handleError = () => {
      setHasError(true)
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  // If we're still loading or had an error, show the fallback
  if (!isLoaded || hasError) {
    return <FallbackPDFPreview onEmailClick={onEmailClick} onDownloadClick={onDownloadClick} />
  }

  try {
    // Now we can safely use the react-pdf components
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

    // Create Document Component
    const ProposalDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.companyName}>Seccomply</Text>
            <Text style={styles.text}>Shivani Tikadia, CEO</Text>
            <Text style={styles.title}>Project Proposal</Text>
            <Text style={styles.subtitle}>Prepared for: {data.company.name || "Client"}</Text>
            <Text style={styles.text}>Date: {format(new Date(), "MMMM d, yyyy")}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Client Information</Text>
            <Text style={styles.text}>Company: {data.company.name || "N/A"}</Text>
            <Text style={styles.text}>Address: {data.company.address || "N/A"}</Text>
            <Text style={styles.text}>Contact: {data.company.contactName || "N/A"}</Text>
            <Text style={styles.text}>Email: {data.company.contactEmail || "N/A"}</Text>
            <Text style={styles.text}>Phone: {data.company.contactPhone || "N/A"}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Project Details</Text>
            <Text style={styles.text}>
              Start Date: {data.dates.startDate ? format(new Date(data.dates.startDate), "MMMM d, yyyy") : "N/A"}
            </Text>
            <Text style={styles.text}>
              End Date: {data.dates.endDate ? format(new Date(data.dates.endDate), "MMMM d, yyyy") : "N/A"}
            </Text>
            <Text style={styles.text}>Service Type: {data.scope.serviceType || "N/A"}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Financial Details</Text>
            <Text style={styles.text}>
              Quoted Amount:{" "}
              {data.financials.quotedAmount ? `${data.financials.currency} ${data.financials.quotedAmount}` : "N/A"}
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

    return (
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <ProposalDocument />
      </PDFViewer>
    )
  } catch (err) {
    console.error("Error rendering PDF:", err)
    return <FallbackPDFPreview onEmailClick={onEmailClick} onDownloadClick={onDownloadClick} />
  }
}

