"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  LineChart,
  TrendingDown,
  TrendingUp,
  Tag,
  ShoppingCart,
  Search,
  Filter,
  Building2,
  Truck,
  ExternalLink,
  PlusCircle,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Minus, Plus, Check } from "lucide-react"

export default function MarketAIPage() {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false)
  const [showAddToCartModal, setShowAddToCartModal] = useState(false)
  const [selectedB2bRequest, setSelectedB2bRequest] = useState<any>(null)
  const [showB2bResponseModal, setShowB2bResponseModal] = useState(false)
  const [discountFilter, setDiscountFilter] = useState<string | null>(null)
  const [productQuantity, setProductQuantity] = useState(1)

  const [activeTab, setActiveTab] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Get the tab from URL parameters
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get("tab")
      // Return the tab parameter if it's valid, otherwise default to "analysis"
      return tabParam === "marketplace" || tabParam === "discounts" || tabParam === "b2b" || tabParam === "analysis"
        ? tabParam
        : "analysis"
    }
    return "analysis"
  })

  // Update URL when tab changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.set("tab", activeTab)
      window.history.replaceState({}, "", url.toString())
    }
  }, [activeTab])

  // Add this useEffect to handle URL parameters for tab selection
  useEffect(() => {
    // Check for tab parameter in URL
    const searchParams = new URLSearchParams(window.location.search)
    const tabParam = searchParams.get("tab")

    // Set active tab if valid parameter is found
    if (tabParam && ["analysis", "marketplace", "discounts", "b2b"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [])

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVendor, setSelectedVendor] = useState("all")
  const [searchSources, setSearchSources] = useState({
    internal: true,
    amazon: true,
    temu: true,
    alibaba: true,
    ebay: true,
  })
  const [b2bFormData, setB2bFormData] = useState({
    productName: "",
    description: "",
    quantity: "",
    price: "",
    category: "electronics",
    businessName: "",
    contactEmail: "",
    specialRequirements: "",
  })
  const [isB2bSubmitting, setIsB2bSubmitting] = useState(false)
  const [b2bSubmitSuccess, setB2bSubmitSuccess] = useState(false)

  // Handle file change for product image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setImagePreview(event.target.result as string)
        }
      }

      reader.readAsDataURL(file)
    }
  }

  // Handle product submit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    // Simulate API call
    setTimeout(() => {
      setIsUploading(false)
      setUploadSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setUploadSuccess(false)
        setImagePreview(null)
        const form = e.target as HTMLFormElement
        form.reset()
      }, 2000)
    }, 1500)
  }

  // Handle B2B form input changes
  const handleB2bInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setB2bFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle B2B form submission
  const handleB2bSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsB2bSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsB2bSubmitting(false)
      setB2bSubmitSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setB2bSubmitSuccess(false)
        setB2bFormData({
          productName: "",
          description: "",
          quantity: "",
          price: "",
          category: "electronics",
          businessName: "",
          contactEmail: "",
          specialRequirements: "",
        })
      }, 3000)
    }, 1500)
  }

  // Toggle search source
  const toggleSearchSource = (source: keyof typeof searchSources) => {
    setSearchSources((prev) => ({
      ...prev,
      [source]: !prev[source],
    }))
  }

  // Sample products for the marketplace (original market page)
  const marketplaceProducts = [
    {
      id: 1,
      name: "Premium Office Chair",
      description: "Ergonomic office chair with lumbar support and adjustable height",
      price: 249.99,
      quantity: 15,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Office Solutions Inc.",
      date: "2023-11-10",
      category: "furniture",
      source: "internal",
    },
    {
      id: 2,
      name: "Wireless Keyboard",
      description: "Bluetooth mechanical keyboard with RGB backlight",
      price: 89.99,
      quantity: 30,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Tech Supplies Ltd.",
      date: "2023-11-12",
      category: "electronics",
      source: "internal",
    },
    {
      id: 3,
      name: "Desk Lamp",
      description: "LED desk lamp with adjustable brightness and color temperature",
      price: 45.99,
      quantity: 25,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Home Office Essentials",
      date: "2023-11-15",
      category: "accessories",
      source: "internal",
    },
    {
      id: 4,
      name: "Ergonomic Mouse",
      description: "Vertical ergonomic mouse for reduced wrist strain",
      price: 39.99,
      quantity: 45,
      image: "/placeholder.svg?height=200&width=200",
      seller: "TechMart",
      date: "2023-11-14",
      category: "accessories",
      source: "external",
      vendor: "amazon",
    },
    {
      id: 5,
      name: "Wireless Earbuds",
      description: "Noise cancelling earbuds with 24-hour battery life",
      price: 79.99,
      quantity: 18,
      image: "/placeholder.svg?height=200&width=200",
      seller: "AudioTech",
      date: "2023-11-16",
      category: "electronics",
      source: "external",
      vendor: "temu",
    },
    {
      id: 6,
      name: "Portable Monitor",
      description: "15.6-inch portable monitor with USB-C connection",
      price: 169.99,
      quantity: 12,
      image: "/placeholder.svg?height=200&width=200",
      seller: "DisplayTech",
      date: "2023-11-17",
      category: "electronics",
      source: "external",
      vendor: "alibaba",
    },
  ]

  // Sample marketplace items (from marketplace page)
  const marketplaceDiscountItems = [
    {
      id: 101,
      name: "Product G - Electronics",
      description: "High-end electronics product with premium features",
      originalPrice: 899.99,
      discountPrice: 749.99,
      quantity: 250,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Main Warehouse",
      condition: "New",
      source: "internal",
    },
    {
      id: 102,
      name: "Product J - Office Supplies",
      description: "Premium office supplies for professional environments",
      originalPrice: 129.99,
      discountPrice: 99.99,
      quantity: 180,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Office Division",
      condition: "New",
      source: "internal",
    },
    {
      id: 103,
      name: "Product K - Home Decor",
      description: "Stylish home decoration items for modern homes",
      originalPrice: 249.99,
      discountPrice: 189.99,
      quantity: 120,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Home Department",
      condition: "New",
      source: "internal",
    },
    {
      id: 104,
      name: "Product L - Kitchen Appliances",
      description: "High-quality kitchen appliances with warranty",
      originalPrice: 399.99,
      discountPrice: 329.99,
      quantity: 85,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Kitchen Division",
      condition: "New",
      source: "internal",
    },
    {
      id: 105,
      name: "Product M - Sporting Goods",
      description: "Professional sporting equipment for athletes",
      originalPrice: 199.99,
      discountPrice: 159.99,
      quantity: 150,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Sports Department",
      condition: "New",
      source: "internal",
    },
    {
      id: 106,
      name: "Product N - Outdoor Equipment",
      description: "Durable outdoor equipment for all weather conditions",
      originalPrice: 349.99,
      discountPrice: 279.99,
      quantity: 95,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Outdoor Division",
      condition: "New",
      source: "internal",
    },
  ]

  // Sample B2B special requests
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
  ]

  // Calculate discount percentage
  const calculateDiscount = (original: number, discounted: number) => {
    return Math.round(((original - discounted) / original) * 100)
  }

  // Filter products based on search, category, and vendor
  const filteredProducts = marketplaceProducts.filter((product) => {
    // Check if the product source is enabled in search sources
    if (product.source === "internal" && !searchSources.internal) return false
    if (product.source === "external") {
      const vendor = product.vendor as string
      if (!searchSources[vendor as keyof typeof searchSources]) return false
    }

    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by category
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

    // Filter by vendor
    const matchesVendor =
      selectedVendor === "all" ||
      (selectedVendor === "internal" && product.source === "internal") ||
      (product.source === "external" && product.vendor === selectedVendor)

    return matchesSearch && matchesCategory && matchesVendor
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Market AiCO</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </div>

      <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="discounts">Discount Items</TabsTrigger>
          <TabsTrigger value="b2b">B2B Requests</TabsTrigger>
        </TabsList>

        {/* Market Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-seablue-900">+8.2%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Competitor Price Index</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-seablue-900">-3.5%</div>
                <p className="text-xs text-muted-foreground">Competitors lowering prices</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Share</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-seablue-900">12.7%</div>
                <p className="text-xs text-muted-foreground">+1.3% from last quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demand Forecast</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-seablue-900">+15.3%</div>
                <p className="text-xs text-muted-foreground">Expected growth next quarter</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Market Trend Analysis</CardTitle>
                <CardDescription>AiCO-powered analysis of market trends affecting your inventory</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full bg-seablue-50 rounded-md flex items-center justify-center">
                  <LineChart className="h-8 w-8 text-seablue-300" />
                  <span className="ml-2 text-sm text-muted-foreground">Market Trends Chart</span>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Seasonal Demand</CardTitle>
                <CardDescription>Seasonal patterns in market demand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-seablue-50 rounded-md flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-seablue-300" />
                  <span className="ml-2 text-sm text-muted-foreground">Seasonal Demand Chart</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Market Opportunities</CardTitle>
              <CardDescription>AiCO-identified opportunities for growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Emerging Market Segment</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          AiCO has identified a growing demand for eco-friendly products in your category. Consider
                          expanding your inventory with sustainable options.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Price Optimization</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          Analysis shows potential for 5-8% price increase on premium products without significant
                          impact on sales volume.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingDown className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Declining Category</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          The market for Product Category X is showing signs of decline. Consider reducing inventory
                          allocation and exploring alternative product lines.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-4">
          <div className="flex flex-col space-y-4">
            {/* Enhanced Search Bar */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Search Products</CardTitle>
                <CardDescription>Find products from multiple sources in one place</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products across multiple platforms..."
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
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="office supplies">Office Supplies</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="amazon">Amazon</SelectItem>
                        <SelectItem value="temu">Temu</SelectItem>
                        <SelectItem value="alibaba">Alibaba</SelectItem>
                        <SelectItem value="ebay">eBay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="search-internal"
                        checked={searchSources.internal}
                        onCheckedChange={() => toggleSearchSource("internal")}
                      />
                      <Label htmlFor="search-internal" className="text-sm">
                        Internal Inventory
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="search-amazon"
                        checked={searchSources.amazon}
                        onCheckedChange={() => toggleSearchSource("amazon")}
                      />
                      <Label htmlFor="search-amazon" className="text-sm">
                        Amazon
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="search-temu"
                        checked={searchSources.temu}
                        onCheckedChange={() => toggleSearchSource("temu")}
                      />
                      <Label htmlFor="search-temu" className="text-sm">
                        Temu
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="search-alibaba"
                        checked={searchSources.alibaba}
                        onCheckedChange={() => toggleSearchSource("alibaba")}
                      />
                      <Label htmlFor="search-alibaba" className="text-sm">
                        Alibaba
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="search-ebay"
                        checked={searchSources.ebay}
                        onCheckedChange={() => toggleSearchSource("ebay")}
                      />
                      <Label htmlFor="search-ebay" className="text-sm">
                        eBay
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.source === "external" && (
                      <Badge className="absolute top-2 left-2 bg-blue-500 flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {product.vendor}
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="text-2xl font-bold text-seablue-900">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Available</p>
                        <p className="font-medium">{product.quantity} units</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Seller: {product.seller}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Open product details modal
                        setSelectedProduct(product)
                        setShowProductDetailsModal(true)
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      className="bg-seablue-600 hover:bg-seablue-700"
                      onClick={() => {
                        // Add to cart with quantity selector
                        setSelectedProduct(product)
                        setShowAddToCartModal(true)
                      }}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Discount Items Tab (from original marketplace page) */}
        <TabsContent value="discounts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Discounted Items</h3>
            <Button
              className="bg-seablue-600 hover:bg-seablue-700"
              onClick={() => {
                // Navigate to orders page
                router.push("/orders")
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> My Orders
            </Button>
          </div>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search discounted items..." className="w-full pl-8" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDiscountFilter("category")}>
                  <div className="flex items-center">
                    Category
                    {discountFilter === "category" && <Check className="ml-2 h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDiscountFilter("price")}>
                  <div className="flex items-center">
                    Price Range
                    {discountFilter === "price" && <Check className="ml-2 h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDiscountFilter("discount")}>
                  <div className="flex items-center">
                    Discount %{discountFilter === "discount" && <Check className="ml-2 h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDiscountFilter("seller")}>
                  <div className="flex items-center">
                    Seller
                    {discountFilter === "seller" && <Check className="ml-2 h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceDiscountItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    {calculateDiscount(item.originalPrice, item.discountPrice)}% OFF
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-seablue-900">${item.discountPrice.toFixed(2)}</p>
                        <p className="ml-2 text-sm text-muted-foreground line-through">
                          ${item.originalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p className="font-medium">{item.quantity} units</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Seller: {item.seller}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">View Details</Button>
                  <Button className="bg-seablue-600 hover:bg-seablue-700">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* B2B Special Requests Tab */}
        <TabsContent value="b2b" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* B2B Request Form */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Submit B2B Request</CardTitle>
                <CardDescription>Create a special request for business-to-business transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleB2bSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={b2bFormData.businessName}
                      onChange={handleB2bInputChange}
                      placeholder="Your company name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={b2bFormData.contactEmail}
                      onChange={handleB2bInputChange}
                      placeholder="business@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      name="productName"
                      value={b2bFormData.productName}
                      onChange={handleB2bInputChange}
                      placeholder="What are you looking for?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      name="category"
                      value={b2bFormData.category}
                      onValueChange={(value) => setB2bFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="office supplies">Office Supplies</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        value={b2bFormData.quantity}
                        onChange={handleB2bInputChange}
                        placeholder="How many units?"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Budget/Price</Label>
                      <Input
                        id="price"
                        name="price"
                        value={b2bFormData.price}
                        onChange={handleB2bInputChange}
                        placeholder="Budget or price range"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <Textarea
                      id="specialRequirements"
                      name="specialRequirements"
                      value={b2bFormData.specialRequirements}
                      onChange={handleB2bInputChange}
                      placeholder="Any specific requirements or details"
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-seablue-600 hover:bg-seablue-700"
                    disabled={isB2bSubmitting || b2bSubmitSuccess}
                  >
                    {isB2bSubmitting ? (
                      <>Submitting...</>
                    ) : b2bSubmitSuccess ? (
                      <>Request Submitted Successfully</>
                    ) : (
                      <>Submit B2B Request</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* B2B Requests Listings */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>B2B Special Requests</CardTitle>
                <CardDescription>Browse business requests and opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Active Requests</h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Building2 className="h-3 w-3 mr-1" /> B2B Only
                    </Badge>
                  </div>

                  {b2bRequests.map((request) => (
                    <Card key={request.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{request.productName}</CardTitle>
                          <Badge className={request.status === "Open" ? "bg-green-500" : "bg-amber-500"}>
                            {request.status}
                          </Badge>
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

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // Navigate to full B2B requests page
                      router.push("/market/b2b-requests")
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> View All B2B Requests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Product Details Modal */}
      {showProductDetailsModal && selectedProduct && (
        <Dialog open={showProductDetailsModal} onOpenChange={setShowProductDetailsModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>{selectedProduct.description}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <img
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  className="col-span-4 w-full h-48 object-contain rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Price</Label>
                  <p className="text-xl font-bold">${selectedProduct.price?.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Available</Label>
                  <p>{selectedProduct.quantity} units</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Seller</Label>
                  <p>{selectedProduct.seller}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="capitalize">{selectedProduct.category}</p>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between sm:justify-end">
              <Button variant="outline" onClick={() => setShowProductDetailsModal(false)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                className="bg-seablue-600 hover:bg-seablue-700"
                onClick={() => {
                  setShowProductDetailsModal(false)
                  setShowAddToCartModal(true)
                }}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add to Cart Modal */}
      {showAddToCartModal && selectedProduct && (
        <Dialog open={showAddToCartModal} onOpenChange={setShowAddToCartModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add to Cart</DialogTitle>
              <DialogDescription>Specify quantity and options for {selectedProduct.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <div className="col-span-3 flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                    disabled={productQuantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(Number.parseInt(e.target.value) || 1)}
                    min={1}
                    max={selectedProduct.quantity}
                    className="w-20 mx-2 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setProductQuantity(Math.min(selectedProduct.quantity, productQuantity + 1))}
                    disabled={productQuantity >= selectedProduct.quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Total</Label>
                <div className="col-span-3">
                  <p className="text-xl font-bold">${(selectedProduct.price * productQuantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between sm:justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAddToCartModal(false)
                  if (showProductDetailsModal) {
                    setShowProductDetailsModal(true)
                  }
                }}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowAddToCartModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-seablue-600 hover:bg-seablue-700"
                  onClick={() => {
                    // Add to cart logic
                    toast({
                      title: "Added to Cart",
                      description: `${productQuantity} × ${selectedProduct.name} added to your cart.`,
                    })
                    setShowAddToCartModal(false)
                    setProductQuantity(1)
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
    </div>
  )
}
