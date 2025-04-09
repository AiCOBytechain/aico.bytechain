"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, Tag, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export default function MarketplacePage() {
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("")

  // Sample marketplace items (overstocked inventory)
  const marketplaceItems = [
    {
      id: 1,
      name: "Product G - Electronics",
      description: "High-end electronics product with premium features",
      originalPrice: 899.99,
      discountPrice: 749.99,
      quantity: 250,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Main Warehouse",
      condition: "New",
    },
    {
      id: 2,
      name: "Product J - Office Supplies",
      description: "Premium office supplies for professional environments",
      originalPrice: 129.99,
      discountPrice: 99.99,
      quantity: 180,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Office Division",
      condition: "New",
    },
    {
      id: 3,
      name: "Product K - Home Decor",
      description: "Stylish home decoration items for modern homes",
      originalPrice: 249.99,
      discountPrice: 189.99,
      quantity: 120,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Home Department",
      condition: "New",
    },
    {
      id: 4,
      name: "Product L - Kitchen Appliances",
      description: "High-quality kitchen appliances with warranty",
      originalPrice: 399.99,
      discountPrice: 329.99,
      quantity: 85,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Kitchen Division",
      condition: "New",
    },
    {
      id: 5,
      name: "Product M - Sporting Goods",
      description: "Professional sporting equipment for athletes",
      originalPrice: 199.99,
      discountPrice: 159.99,
      quantity: 150,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Sports Department",
      condition: "New",
    },
    {
      id: 6,
      name: "Product N - Outdoor Equipment",
      description: "Durable outdoor equipment for all weather conditions",
      originalPrice: 349.99,
      discountPrice: 279.99,
      quantity: 95,
      image: "/placeholder.svg?height=200&width=200",
      seller: "Outdoor Division",
      condition: "New",
    },
  ]

  // Calculate discount percentage
  const calculateDiscount = (original: number, discounted: number) => {
    return Math.round(((original - discounted) / original) * 100)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Marketplace</h2>
        <Button className="bg-seablue-600 hover:bg-seablue-700">
          <ShoppingCart className="mr-2 h-4 w-4" /> My Orders
        </Button>
      </div>

      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search marketplace..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
            <DropdownMenuItem>Category</DropdownMenuItem>
            <DropdownMenuItem>Price Range</DropdownMenuItem>
            <DropdownMenuItem>Discount %</DropdownMenuItem>
            <DropdownMenuItem>Seller</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaceItems.map((item) => (
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
                    <p className="ml-2 text-sm text-muted-foreground line-through">${item.originalPrice.toFixed(2)}</p>
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
    </div>
  )
}

