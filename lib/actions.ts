"use server"

import { revalidatePath } from "next/cache"

// In-memory fallback for SSR (not persistent)
const proposalStore: Record<string, any> = typeof window === 'undefined' ? {} : ({} as any);

// This would connect to your database in a real application
export async function createProposal(data: any): Promise<{ id: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate a random ID for the proposal
  const id = `PROP-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`

  const proposal = { id, ...data };

  if (typeof window !== 'undefined' && window.localStorage) {
    // Save to localStorage in browser
    const all = JSON.parse(window.localStorage.getItem('proposals') || '{}');
    all[id] = proposal;
    window.localStorage.setItem('proposals', JSON.stringify(all));
  } else if (proposalStore) {
    // Fallback for SSR
    proposalStore[id] = proposal;
  }

  // In a real app, you would save this to a database
  console.log("Creating proposal:", { id, ...data })

  // Return the created proposal ID
  return { id }
}

export async function getProposalHistory() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would fetch this from a database
  // Returning an empty array for now
  return []
}

export async function sendProposalByEmail(data: any, email: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In a real app, you would send an email with the proposal
  console.log("Sending proposal to:", email, data)

  // Return success
  return { success: true }
}

export async function saveTemplateSettings(data) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would save this to a database
  console.log("Saving template settings:", data)

  // Revalidate the admin page
  revalidatePath("/admin")

  // Return success
  return { success: true }
}

export async function saveUserSettings(data) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would save this to a database
  console.log("Saving user settings:", data)

  // Revalidate the admin page
  revalidatePath("/admin")

  // Return success
  return { success: true }
}

export async function generatePDF(data: any) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In a real app, you would generate a PDF using a server-side PDF generation library
  console.log("Generating PDF for:", data)

  // Return a mock PDF URL
  return {
    url: `/api/proposals/download/${Math.random().toString(36).substring(2, 15)}`,
    success: true,
  }
}

export async function generateDOCX(data: any) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In a real app, you would generate a DOCX using a server-side DOCX generation library
  console.log("Generating DOCX for:", data)

  // Return a mock DOCX URL
  return {
    url: `/api/proposals/download/${Math.random().toString(36).substring(2, 15)}`,
    success: true,
  }
}

export async function getProposalById(id: string): Promise<any | null> {
  if (typeof window !== 'undefined' && window.localStorage) {
    const all = JSON.parse(window.localStorage.getItem('proposals') || '{}');
    return all[id] || null;
  } else if (proposalStore) {
    return proposalStore[id] || null;
  }
  return null;
}

