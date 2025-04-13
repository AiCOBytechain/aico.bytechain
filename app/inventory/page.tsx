"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Plus,
  Search,
  Upload,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit,
  Sparkles,
  Eye,
  FileText,
  Tag,
  Trash2,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function InventoryPage() {
  // State for search, filter, and sort
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  // State for product details and AI description
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [showDescriptionEditor, setShowDescriptionEditor] = useState(false)
  const [editedDescription, setEditedDescription] = useState("")
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [aiGeneratedDescription, setAiGeneratedDescription] = useState("")
  const [descriptionSource, setDescriptionSource] = useState<"ai" | "manual" | "">("")

  // Sample inventory data with stock levels and predictions
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: "Premium Ergonomic Office Chair",
      category: "Furniture",
      quantity: 150,
      price: 299.99,
      status: "In Stock",
      stockLevel: "optimal",
      prediction: "stable",
      lastUpdated: "2023-11-15",
      description:
        "High-quality ergonomic office chair with lumbar support, adjustable height, and premium cushioning for all-day comfort.",
      descriptionSource: "manual",
      specifications: {
        material: "Mesh and leather",
        dimensions: '26"W x 26"D x 38-42"H',
        weight: "35 lbs",
        color: "Black",
        adjustable: "Yes",
        warranty: "5 years",
      },
    },
    {
      id: 2,
      name: "Wireless Bluetooth Keyboard",
      category: "Electronics",
      quantity: 45,
      price: 89.99,
      status: "Low Stock",
      stockLevel: "low",
      prediction: "understocked",
      lastUpdated: "2023-11-10",
      description:
        "Compact wireless keyboard with Bluetooth connectivity, backlit keys, and multi-device pairing capability.",
      descriptionSource: "ai",
      specifications: {
        connectivity: "Bluetooth 5.0",
        battery: "Rechargeable Li-ion",
        compatibility: "Windows, macOS, iOS, Android",
        backlit: "Yes",
        dimensions: '14.5"W x 5"D x 0.8"H',
        weight: "1.2 lbs",
      },
    },
    {
      id: 3,
      name: "Professional Desk Lamp",
      category: "Lighting",
      quantity: 200,
      price: 49.99,
      status: "In Stock",
      stockLevel: "optimal",
      prediction: "stable",
      lastUpdated: "2023-11-12",
      description: "",
      descriptionSource: "",
      specifications: {
        type: "LED",
        brightness: "800 lumens",
        colorTemperature: "3000K-6000K adjustable",
        powerSource: "USB-C or AC adapter",
        dimensions: '6"W x 6"D x 18"H',
        features: "Touch controls, 5 brightness levels",
      },
    },
    {
      id: 4,
      name: "Ultra-Wide Curved Monitor",
      category: "Electronics",
      quantity: 75,
      price: 499.99,
      status: "In Stock",
      stockLevel: "optimal",
      prediction: "stable",
      lastUpdated: "2023-11-14",
      description:
        "34-inch ultra-wide curved monitor with 4K resolution, 144Hz refresh rate, and HDR support for immersive viewing experience.",
      descriptionSource: "ai",
      specifications: {
        size: "34 inches",
        resolution: "3440 x 1440",
        refreshRate: "144Hz",
        panel: "IPS",
        ports: "HDMI 2.1, DisplayPort 1.4, USB-C",
        features: "HDR10, AMD FreeSync",
      },
    },
    {
      id: 5,
      name: "Adjustable Standing Desk",
      category: "Furniture",
      quantity: 10,
      price: 429.99,
      status: "Low Stock",
      stockLevel: "low",
      prediction: "understocked",
      lastUpdated: "2023-11-08",
      description: "",
      descriptionSource: "",
      specifications: {
        material: "Bamboo top, aluminum frame",
        dimensions: '60"W x 30"D x 25-50"H',
        weight: "120 lbs",
        adjustmentType: "Electric motor",
        presets: "4 programmable height presets",
        maxWeight: "300 lbs",
      },
    },
    {
      id: 6,
      name: "Wireless Charging Pad",
      category: "Electronics",
      quantity: 0,
      price: 39.99,
      status: "Out of Stock",
      stockLevel: "out",
      prediction: "understocked",
      lastUpdated: "2023-11-01",
      description:
        "Fast wireless charging pad compatible with all Qi-enabled devices, featuring 15W power delivery and sleek, minimalist design.",
      descriptionSource: "manual",
      specifications: {
        power: "15W",
        compatibility: "Qi-enabled devices",
        dimensions: '4"W x 4"D x 0.4"H',
        input: "USB-C",
        features: "LED indicator, foreign object detection",
      },
    },
    {
      id: 7,
      name: "Premium Noise-Cancelling Headphones",
      category: "Electronics",
      quantity: 350,
      price: 249.99,
      status: "In Stock",
      stockLevel: "high",
      prediction: "overstocked",
      lastUpdated: "2023-11-05",
      description:
        "Over-ear noise-cancelling headphones with premium audio quality, 30-hour battery life, and comfortable memory foam ear cushions.",
      descriptionSource: "ai",
      specifications: {
        type: "Over-ear",
        connectivity: "Bluetooth 5.0, 3.5mm jack",
        batteryLife: "30 hours",
        noiseReduction: "Active noise cancellation",
        charging: "USB-C",
        weight: "9.8 oz",
      },
    },
    {
      id: 8,
      name: "Executive Office Desk",
      category: "Furniture",
      quantity: 5,
      price: 899.99,
      status: "Low Stock",
      stockLevel: "low",
      prediction: "understocked",
      lastUpdated: "2023-11-03",
      description: "",
      descriptionSource: "",
      specifications: {
        material: "Solid oak wood",
        dimensions: '72"W x 36"D x 30"H',
        weight: "180 lbs",
        features: "Built-in cable management, 3 drawers",
        finish: "Natural wood with matte coating",
        assembly: "Required",
      },
    },
  ])

  // Function to render stock level indicator
  const renderStockIndicator = (level: string) => {
    switch (level) {
      case "high":
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>High</span>
          </div>
        )
      case "optimal":
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Optimal</span>
          </div>
        )
      case "low":
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span>Low</span>
          </div>
        )
      case "out":
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Out</span>
          </div>
        )
      default:
        return null
    }
  }

  // Function to render prediction badge
  const renderPredictionBadge = (prediction: string) => {
    switch (prediction) {
      case "overstocked":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <AlertTriangle className="h-3 w-3 mr-1" /> Overstocked
          </Badge>
        )
      case "stable":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Stable
          </Badge>
        )
      case "understocked":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" /> Understocked
          </Badge>
        )
      default:
        return null
    }
  }

  // Function to render description source badge
  const renderDescriptionSourceBadge = (source: string) => {
    if (!source) return null

    switch (source) {
      case "ai":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Sparkles className="h-3 w-3 mr-1" /> AI Generated
          </Badge>
        )
      case "manual":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <Edit className="h-3 w-3 mr-1" /> Manually Edited
          </Badge>
        )
      default:
        return null
    }
  }

  // Function to filter and sort inventory items
  const getFilteredAndSortedItems = () => {
    return inventoryItems
      .filter((item) => {
        // Apply search filter
        const matchesSearch =
          searchQuery === "" ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))

        // Apply category filter
        const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

        // Apply stock filter
        const matchesStock =
          stockFilter === "all" ||
          (stockFilter === "in_stock" && item.stockLevel !== "out") ||
          (stockFilter === "low_stock" && item.stockLevel === "low") ||
          (stockFilter === "out_of_stock" && item.stockLevel === "out") ||
          (stockFilter === "overstocked" && item.stockLevel === "high")

        return matchesSearch && matchesCategory && matchesStock
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortField === "name") {
          return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        } else if (sortField === "price") {
          return sortDirection === "asc" ? a.price - b.price : b.price - a.price
        } else if (sortField === "quantity") {
          return sortDirection === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity
        } else if (sortField === "lastUpdated") {
          return sortDirection === "asc"
            ? new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
            : new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        }
        return 0
      })
  }

  // Function to handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Function to generate AI description
  const generateAIDescription = () => {
    if (!selectedProduct) return

    setIsGeneratingDescription(true)

    // Simulate AI description generation
    setTimeout(() => {
      let generatedDescription = ""

      // Generate description based on product specifications
      const specs = selectedProduct.specifications

      if (selectedProduct.category === "Electronics") {
        generatedDescription = `High-performance ${selectedProduct.name.toLowerCase()} designed for professional use. `

        if (specs.connectivity) {
          generatedDescription += `Features ${specs.connectivity} connectivity for seamless pairing. `
        }

        if (specs.batteryLife) {
          generatedDescription += `Enjoy up to ${specs.batteryLife} of continuous use on a single charge. `
        }

        if (specs.resolution) {
          generatedDescription += `Crisp ${specs.resolution} resolution delivers stunning visuals. `
        }

        generatedDescription += `This premium device combines cutting-edge technology with elegant design for an exceptional user experience.`
      } else if (selectedProduct.category === "Furniture") {
        generatedDescription = `Elegant ${selectedProduct.name.toLowerCase()} crafted for both style and functionality. `

        if (specs.material) {
          generatedDescription += `Made from high-quality ${specs.material} for durability and aesthetic appeal. `
        }

        if (specs.dimensions) {
          generatedDescription += `With dimensions of ${specs.dimensions}, it fits perfectly in any professional environment. `
        }

        if (specs.adjustable === "Yes" || specs.adjustmentType) {
          generatedDescription += `Fully adjustable to provide optimal comfort throughout your workday. `
        }

        generatedDescription += `An investment in quality that enhances any workspace.`
      } else if (selectedProduct.category === "Lighting") {
        generatedDescription = `Modern ${selectedProduct.name.toLowerCase()} designed to enhance productivity and comfort. `

        if (specs.brightness) {
          generatedDescription += `Provides bright ${specs.brightness} illumination for clear visibility. `
        }

        if (specs.colorTemperature) {
          generatedDescription += `Adjustable color temperature (${specs.colorTemperature}) allows customization for different tasks and preferences. `
        }

        if (specs.features) {
          generatedDescription += `Includes ${specs.features} for convenient operation. `
        }

        generatedDescription += `The perfect lighting solution for your workspace.`
      } else {
        generatedDescription = `Premium quality ${selectedProduct.name.toLowerCase()} designed for professional use. `
        generatedDescription += `This versatile product combines functionality with elegant design, making it a valuable addition to any setting. `
        generatedDescription += `Built to last with attention to detail and high-quality materials.`
      }

      setAiGeneratedDescription(generatedDescription)
      setIsGeneratingDescription(false)
    }, 1500)
  }

  // Function to save description
  const saveDescription = () => {
    if (!selectedProduct) return

    // Update the inventory item with the new description
    const updatedItems = inventoryItems.map((item) => {
      if (item.id === selectedProduct.id) {
        return {
          ...item,
          description: editedDescription,
          descriptionSource: descriptionSource,
        }
      }
      return item
    })

    setInventoryItems(updatedItems)
    setShowDescriptionEditor(false)

    toast({
      title: "Description updated",
      description: "Product description has been successfully updated.",
    })
  }

  // Function to view product details
  const viewProductDetails = (product: any) => {
    setSelectedProduct(product)
    setEditedDescription(product.description || "")
    setDescriptionSource(product.descriptionSource || "")
    setShowProductDetails(true)
  }

  // Function to open description editor
  const openDescriptionEditor = () => {
    setShowDescriptionEditor(true)
    setAiGeneratedDescription("")
  }

  // Get filtered and sorted items
  const filteredItems = getFilteredAndSortedItems()

  // Get unique categories for filter
  const categories = Array.from(new Set(inventoryItems.map((item) => item.category)))

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Inventory Catalogue</h2>
        <div className="flex space-x-2">
          <Link href="/upload">
            <Button variant="outline" className="bg-white">
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Button>
          </Link>
          <Button className="bg-seablue-600 hover:bg-seablue-700">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Catalogue</CardTitle>
          <CardDescription>Manage your inventory items, track stock levels, and view AiCO predictions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Enhanced Search and Filter Controls */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Stock Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Levels</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="overstocked">Overstocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSortChange("name")}>
                      <div className="flex items-center">
                        Name
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortChange("quantity")}>
                      <div className="flex items-center">
                        Quantity
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortChange("price")}>
                      <div className="flex items-center">
                        Price
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>AiCO Prediction</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortChange("lastUpdated")}>
                      <div className="flex items-center">
                        Last Updated
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No products found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id} className={item.stockLevel === "out" ? "bg-red-50" : ""}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>{renderStockIndicator(item.stockLevel)}</TableCell>
                        <TableCell>{renderPredictionBadge(item.prediction)}</TableCell>
                        <TableCell>{item.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => viewProductDetails(item)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" /> Track History
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                {item.prediction === "overstocked" ? (
                                  <>
                                    <Tag className="mr-2 h-4 w-4" /> List in Marketplace
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="mr-2 h-4 w-4" /> Reorder
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details Dialog */}
      <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>View and manage detailed information for this product</DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Product Name</Label>
                    <p className="font-medium">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p>{selectedProduct.category}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Price</Label>
                    <p className="font-medium">${selectedProduct.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Quantity</Label>
                    <p>{selectedProduct.quantity} units</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Stock Level</Label>
                    <div>{renderStockIndicator(selectedProduct.stockLevel)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">AiCO Prediction</Label>
                    <div>{renderPredictionBadge(selectedProduct.prediction)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Updated</Label>
                    <p>{selectedProduct.lastUpdated}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p>{selectedProduct.status}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="description" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">Product Description</h3>
                    {selectedProduct.descriptionSource &&
                      renderDescriptionSourceBadge(selectedProduct.descriptionSource)}
                  </div>
                  <Button onClick={openDescriptionEditor}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Description
                  </Button>
                </div>

                {selectedProduct.description ? (
                  <div className="p-4 border rounded-md bg-white">
                    <p>{selectedProduct.description}</p>
                  </div>
                ) : (
                  <div className="p-4 border rounded-md bg-gray-50 text-center">
                    <p className="text-muted-foreground">No description available</p>
                    <Button variant="outline" className="mt-2" onClick={openDescriptionEditor}>
                      <Plus className="mr-2 h-4 w-4" /> Add Description
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="specifications" className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Product Specifications</h3>

                {selectedProduct.specifications ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableBody>
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </TableCell>
                            <TableCell>{value as string}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-4 border rounded-md bg-gray-50 text-center">
                    <p className="text-muted-foreground">No specifications available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProductDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Description Editor Dialog */}
      <Dialog open={showDescriptionEditor} onOpenChange={setShowDescriptionEditor}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Product Description</DialogTitle>
            <DialogDescription>Create or edit the description for {selectedProduct?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Current Description</h3>
              <Button variant="outline" onClick={generateAIDescription} disabled={isGeneratingDescription}>
                {isGeneratingDescription ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                  </>
                )}
              </Button>
            </div>

            <Textarea
              placeholder="Enter product description here..."
              className="min-h-[150px]"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />

            {aiGeneratedDescription && (
              <div className="space-y-2 border p-4 rounded-md bg-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                    <h4 className="font-medium text-purple-700">AI Generated Description</h4>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditedDescription(aiGeneratedDescription)
                      setDescriptionSource("ai")
                    }}
                  >
                    Use This
                  </Button>
                </div>
                <p className="text-sm text-purple-700">{aiGeneratedDescription}</p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Label>Description Source:</Label>
              <Select
                value={descriptionSource}
                onValueChange={(value) => setDescriptionSource(value as "ai" | "manual" | "")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select source">{descriptionSource || "Not specified"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not specified">Not specified</SelectItem>
                  <SelectItem value="ai">AI Generated</SelectItem>
                  <SelectItem value="manual">Manually Edited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDescriptionEditor(false)}>
              Cancel
            </Button>
            <Button onClick={saveDescription} className="bg-seablue-600 hover:bg-seablue-700">
              Save Description
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
