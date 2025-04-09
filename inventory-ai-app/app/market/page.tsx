"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, TrendingDown, TrendingUp, ImageIcon, DollarSign, Tag, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MarketAIPage() {
  const [activeTab, setActiveTab] = useState("analysis")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Sample products for the marketplace
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
    },
  ]

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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Market AI</h2>
      </div>

      <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
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
                <CardDescription>AI-powered analysis of market trends affecting your inventory</CardDescription>
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
              <CardDescription>AI-identified opportunities for growth</CardDescription>
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
                          AI has identified a growing demand for eco-friendly products in your category. Consider
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
          <div className="grid gap-4 md:grid-cols-3">
            {/* Product Upload Form */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>List a Product</CardTitle>
                <CardDescription>Upload a product to sell in the marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-image">Product Image</Label>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full flex flex-col items-center justify-center">
                        {imagePreview ? (
                          <div className="relative w-full h-40 mb-2">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Product preview"
                              className="w-full h-full object-contain rounded-md"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-4">
                            <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Upload product image</p>
                          </div>
                        )}
                        <Input
                          id="product-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <Label
                          htmlFor="product-image"
                          className="cursor-pointer bg-seablue-50 text-seablue-600 hover:bg-seablue-100 px-4 py-2 rounded-md text-sm font-medium"
                        >
                          {imagePreview ? "Change Image" : "Select Image"}
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input id="product-name" placeholder="Enter product name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-category">Category</Label>
                    <Select defaultValue="office">
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="office">Office Supplies</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-price">Price ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id="product-price"
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-quantity">Quantity</Label>
                      <Input id="product-quantity" type="number" min="1" step="1" placeholder="1" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea
                      id="product-description"
                      placeholder="Enter product details, specifications, condition, etc."
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-seablue-600 hover:bg-seablue-700"
                    disabled={isUploading || uploadSuccess}
                  >
                    {isUploading ? (
                      <>Uploading...</>
                    ) : uploadSuccess ? (
                      <>Product Listed Successfully</>
                    ) : (
                      <>List Product</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Product Listings */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Marketplace Listings</CardTitle>
                <CardDescription>Browse products available for purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {marketplaceProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <Badge className="bg-seablue-600">${product.price.toFixed(2)}</Badge>
                        </div>
                        <CardDescription className="line-clamp-2 mt-1">{product.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">Seller: {product.seller}</span>
                          </div>
                          <div className="text-muted-foreground">Qty: {product.quantity}</div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm" className="bg-seablue-600 hover:bg-seablue-700">
                          <ShoppingCart className="h-4 w-4 mr-1" /> Buy Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline">View All Products</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

