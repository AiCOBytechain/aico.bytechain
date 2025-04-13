"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Building2, Search, Truck, Plus, Clock } from "lucide-react"

export default function B2BRequestsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedB2bRequest, setSelectedB2bRequest] = useState<any>(null)
  const [showB2bResponseModal, setShowB2bResponseModal] = useState(false)

  // Sample B2B special requests (expanded list)
  const b2bRequests = [
    {
      id: 201,
      productName: "Bulk Office Chairs",
      description: "Looking for 50 ergonomic office chairs for our new office space",
      quantity: 50,
      price: "Negotiable",
      category: "furniture",
      businessName: "TechCorp Inc.",
      status: "Open",
      date: "2023-11-15",
    },
    {
      id: 202,
      productName: "Custom Branded Notebooks",
      description: "Need 200 notebooks with our company logo for corporate event",
      quantity: 200,
      price: "Under $10 per unit",
      category: "office supplies",
      businessName: "Marketing Solutions Ltd.",
      status: "In Progress",
      date: "2023-11-12",
    },
    {
      id: 203,
      productName: "Bulk Server Equipment",
      description: "Looking for server racks and networking equipment for data center expansion",
      quantity: "Multiple units",
      price: "Enterprise pricing",
      category: "electronics",
      businessName: "DataHost Systems",
      status: "Open",
      date: "2023-11-16",
    },
    {
      id: 204,
      productName: "Wholesale Office Supplies",
      description: "Seeking bulk pricing on various office supplies for corporate headquarters",
      quantity: "Large order",
      price: "Competitive pricing",
      category: "office supplies",
      businessName: "Global Enterprises",
      status: "Open",
      date: "2023-11-18",
    },
    {
      id: 205,
      productName: "Bulk Monitors",
      description: "Need 75 monitors for new development team, prefer 27-inch 4K displays",
      quantity: 75,
      price: "Under $300 per unit",
      category: "electronics",
      businessName: "Software Solutions Inc.",
      status: "Open",
      date: "2023-11-19",
    },
    {
      id: 206,
      productName: "Conference Room Furniture",
      description: "Complete furniture set for 5 conference rooms including tables and chairs",
      quantity: "5 sets",
      price: "Premium quality, budget flexible",
      category: "furniture",
      businessName: "Executive Offices LLC",
      status: "In Progress",
      date: "2023-11-14",
    },
    {
      id: 207,
      productName: "Bulk Laptops",
      description: "Business-grade laptops for sales team, minimum i7 processor, 16GB RAM",
      quantity: 25,
      price: "Corporate pricing",
      category: "electronics",
      businessName: "Sales Force Pro",
      status: "Open",
      date: "2023-11-17",
    },
  ]

  // Filter B2B requests based on search, category, and status
  const filteredRequests = b2bRequests.filter((request) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      request.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.businessName.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by category
    const matchesCategory = selectedCategory === "all" || request.category === selectedCategory

    // Filter by status
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/market?tab=b2b")} className="hidden md:flex">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Market
          </Button>
          <h2 className="text-3xl font-bold tracking-tight text-seablue-900">B2B Requests</h2>
        </div>
        <Button className="bg-seablue-600 hover:bg-seablue-700" onClick={() => router.push("/market?tab=b2b")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Request
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Search Requests</CardTitle>
          <CardDescription>Find business-to-business requests by keyword, category, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by product, description, or business..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="office supplies">Office Supplies</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* B2B Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{request.productName}</CardTitle>
                <Badge className={request.status === "Open" ? "bg-green-500" : "bg-amber-500"}>{request.status}</Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Building2 className="h-3 w-3" /> {request.businessName}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm mb-3">{request.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Quantity:</span> {request.quantity}
                </div>
                <div>
                  <span className="text-muted-foreground">Budget:</span> {request.price}
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span> {request.category}
                </div>
                <div>
                  <span className="text-muted-foreground">Posted:</span> {request.date}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-seablue-600 hover:bg-seablue-700"
                onClick={() => {
                  // Open response form modal
                  setSelectedB2bRequest(request)
                  setShowB2bResponseModal(true)
                }}
              >
                <Truck className="mr-2 h-4 w-4" /> Respond to Request
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* B2B Response Modal */}
      {showB2bResponseModal && selectedB2bRequest && (
        <Dialog open={showB2bResponseModal} onOpenChange={setShowB2bResponseModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Respond to B2B Request</DialogTitle>
              <DialogDescription>
                Provide your response to {selectedB2bRequest.businessName}'s request for{" "}
                {selectedB2bRequest.productName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="offer-price">Your Offer Price</Label>
                <Input id="offer-price" placeholder="Enter your price per unit" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="available-quantity">Available Quantity</Label>
                <Input id="available-quantity" placeholder="How many units can you provide?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-time">Estimated Delivery Time</Label>
                <Select>
                  <SelectTrigger id="delivery-time">
                    <SelectValue placeholder="Select delivery timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3">1-3 days</SelectItem>
                    <SelectItem value="3-7">3-7 days</SelectItem>
                    <SelectItem value="7-14">1-2 weeks</SelectItem>
                    <SelectItem value="14-30">2-4 weeks</SelectItem>
                    <SelectItem value="30+">More than 4 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="response-message">Message</Label>
                <Textarea
                  id="response-message"
                  placeholder="Provide details about your offer, product specifications, etc."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between sm:justify-end">
              <Button variant="outline" onClick={() => setShowB2bResponseModal(false)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                className="bg-seablue-600 hover:bg-seablue-700"
                onClick={() => {
                  // Submit response logic
                  toast({
                    title: "Response Submitted",
                    description: `Your response to ${selectedB2bRequest.businessName} has been sent.`,
                  })
                  setShowB2bResponseModal(false)
                }}
              >
                Submit Response
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {filteredRequests.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Matching Requests</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search filters to find more B2B requests.</p>
        </div>
      )}
    </div>
  )
}
