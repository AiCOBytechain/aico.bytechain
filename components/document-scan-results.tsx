"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, AlertTriangle, AlertCircle, Info, Plus, Edit, Trash2 } from "lucide-react"
import type { DocumentAnalysis, ExtractedItem, InventoryInsight } from "@/utils/document-scanner"

interface DocumentScanResultsProps {
  analysis: DocumentAnalysis
  onAddToInventory: (items: ExtractedItem[]) => void
  onEditItem: (item: ExtractedItem, index: number) => void
  onDeleteItem: (index: number) => void
  isEditing: boolean
}

export function DocumentScanResults({
  analysis,
  onAddToInventory,
  onEditItem,
  onDeleteItem,
  isEditing,
}: DocumentScanResultsProps) {
  const { scanResult, insights, summary } = analysis

  // Function to render status badge
  const renderStatusBadge = (status: InventoryInsight["status"]) => {
    switch (status) {
      case "low":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" /> Low Stock
          </Badge>
        )
      case "out_of_stock":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Out of Stock
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Info className="h-3 w-3 mr-1" /> High Stock
          </Badge>
        )
      case "optimal":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Optimal
          </Badge>
        )
      case "not_in_inventory":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Plus className="h-3 w-3 mr-1" /> New Item
          </Badge>
        )
      default:
        return null
    }
  }

  // Function to format confidence as percentage
  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`
  }

  return (
    <div className="space-y-6">
      {/* Document Info */}
      <Card>
        <CardHeader>
          <CardTitle>Document Analysis</CardTitle>
          <CardDescription>AI-powered analysis of your document</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">Invoice Number</h3>
                <p className="text-sm text-muted-foreground">{scanResult.invoiceNumber || "Not detected"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Date</h3>
                <p className="text-sm text-muted-foreground">{scanResult.invoiceDate || "Not detected"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Vendor</h3>
                <p className="text-sm text-muted-foreground">{scanResult.vendorName || "Not detected"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Total Amount</h3>
                <p className="text-sm text-muted-foreground">
                  {scanResult.totalAmount ? `$${scanResult.totalAmount.toFixed(2)}` : "Not detected"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium">Analysis Summary</h3>
              <p className="text-sm text-muted-foreground mt-1">{summary}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium">Confidence Score</h3>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-seablue-600 h-2.5 rounded-full"
                    style={{ width: `${scanResult.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-muted-foreground">{formatConfidence(scanResult.confidence)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extracted Items */}
      <Card>
        <CardHeader>
          <CardTitle>Extracted Items</CardTitle>
          <CardDescription>Items detected in your document with inventory insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Inventory Status</TableHead>
                <TableHead>Confidence</TableHead>
                {isEditing && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {insights.map((insight, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{insight.item.name}</TableCell>
                  <TableCell>{insight.item.quantity || 1}</TableCell>
                  <TableCell>{insight.item.price ? `$${insight.item.price.toFixed(2)}` : "N/A"}</TableCell>
                  <TableCell>{insight.item.category || "Other"}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {renderStatusBadge(insight.status)}
                      <p className="text-xs text-muted-foreground">{insight.recommendation}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatConfidence(insight.item.confidence)}</TableCell>
                  {isEditing && (
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => onEditItem(insight.item, index)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-seablue-600 hover:bg-seablue-700"
            onClick={() => onAddToInventory(scanResult.items)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Items to Inventory
          </Button>
        </CardFooter>
      </Card>

      {/* Raw Text (Collapsible) */}
      <details className="border rounded-lg">
        <summary className="cursor-pointer p-4 font-medium">View Raw Extracted Text</summary>
        <div className="p-4 pt-0 border-t">
          <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-4 rounded-md">{scanResult.rawText}</pre>
        </div>
      </details>
    </div>
  )
}
