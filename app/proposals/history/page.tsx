"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Mail, Search } from "lucide-react"
import { format } from "date-fns"
import { getProposalHistory } from "@/lib/actions"
import { ProposalData } from "@/types/proposal"

export default function ProposalHistoryPage() {
  const [proposals, setProposals] = useState<ProposalData[]>([])
  const [filteredProposals, setFilteredProposals] = useState<ProposalData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const data = await getProposalHistory()
        setProposals(data)
        setFilteredProposals(data)
      } catch (error) {
        console.error("Failed to fetch proposals:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProposals()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProposals(proposals)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = proposals.filter(
        (proposal) =>
          (proposal.company?.name && proposal.company.name.toLowerCase().includes(query)) ||
          (proposal.company?.contactName && proposal.company.contactName.toLowerCase().includes(query)) ||
          (proposal.id && proposal.id.toString().includes(query)),
      )
      setFilteredProposals(filtered)
    }
  }, [searchQuery, proposals])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "sent":
        return <Badge variant="secondary">Sent</Badge>
      case "viewed":
        return <Badge variant="default">Viewed</Badge>
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Proposal History</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Proposals</CardTitle>
          <CardDescription>Find proposals by client name, contact person, or proposal ID.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search proposals..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Proposals</CardTitle>
          <CardDescription>View and manage all your created proposals.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading proposals...</p>
            </div>
          ) : filteredProposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="mb-4 text-muted-foreground">No proposals found</p>
              <Link href="/proposals/new">
                <Button>Create New Proposal</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Using mock data for demonstration */}
                {filteredProposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell className="font-medium">{proposal.id}</TableCell>
                    <TableCell>{proposal.company?.name}</TableCell>
                    <TableCell>{proposal.company?.contactName}</TableCell>
                    <TableCell>{proposal.createdAt ? format(new Date(proposal.createdAt), "MMM d, yyyy") : 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(proposal.status || 'draft')}</TableCell>
                    <TableCell>{proposal.financials?.quotedAmount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/proposals/view/${proposal.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

