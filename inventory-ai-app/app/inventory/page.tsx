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
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function InventoryPage() {
  // Sample inventory data with stock levels and predictions
  const inventoryItems = [
    {
      id: 1,
      name: "Product A",
      category: "Electronics",
      quantity: 150,
      price: 299.99,
      status: "In Stock",
      stockLevel: "optimal",
      prediction: "stable",
      lastUpdated: "2023-11-15",
    },
    {
      id: 2,
      name: "Product B",
      category: "Furniture",
      quantity: 45,
      price: 599.99,
      status: "Low Stock",
      stockLevel: "low",
      prediction: "understocked",
      lastUpdated: "2023-11-10",
    },
    {
      id: 3,
      name: "Product C",
      category: "Clothing",
      quantity: 200,
      price: 49.99,
      status: "In Stock",
      stockLevel: "optimal",
      prediction: "stable",
      lastUpdated: "2023-11-12",
    },
    {
      id: 4,
      name: "Product D",
      category: "Electronics",
      quantity: 75,
      price: 199.99,
      status: "In Stock",
      stockLevel: "optimal",
      prediction: "stable",
      lastUpdated: "2023-11-14",
    },
    {
      id: 5,
      name: "Product E",
      category: "Home Goods",
      quantity: 10,
      price: 129.99,
      status: "Low Stock",
      stockLevel: "low",
      prediction: "understocked",
      lastUpdated: "2023-11-08",
    },
    {
      id: 6,
      name: "Product F",
      category: "Clothing",
      quantity: 0,
      price: 79.99,
      status: "Out of Stock",
      stockLevel: "out",
      prediction: "understocked",
      lastUpdated: "2023-11-01",
    },
    {
      id: 7,
      name: "Product G",
      category: "Electronics",
      quantity: 350,
      price: 899.99,
      status: "In Stock",
      stockLevel: "high",
      prediction: "overstocked",
      lastUpdated: "2023-11-05",
    },
    {
      id: 8,
      name: "Product H",
      category: "Furniture",
      quantity: 5,
      price: 1299.99,
      status: "Low Stock",
      stockLevel: "low",
      prediction: "understocked",
      lastUpdated: "2023-11-03",
    },
  ]

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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">Inventory</h2>
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
          <CardDescription>Manage your inventory items, track stock levels, and view AI predictions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search products..." className="w-full pl-8" />
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
                  <DropdownMenuItem>Stock Level</DropdownMenuItem>
                  <DropdownMenuItem>AI Prediction</DropdownMenuItem>
                  <DropdownMenuItem>Price Range</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center">
                        Name
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>AI Prediction</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow key={item.id}>
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
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Track History</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              {item.prediction === "overstocked" ? "List in Marketplace" : "Reorder"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

