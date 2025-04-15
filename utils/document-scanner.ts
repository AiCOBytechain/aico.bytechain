import { SAMPLE_INVENTORY } from "@/data/sample-inventory"

// Types for document scanning
export interface ExtractedItem {
  name: string
  quantity?: number
  price?: number
  category?: string
  confidence: number
}

export interface ScanResult {
  items: ExtractedItem[]
  totalAmount?: number
  vendorName?: string
  invoiceDate?: string
  invoiceNumber?: string
  confidence: number
  rawText: string
}

export interface InventoryInsight {
  item: ExtractedItem
  currentStock?: number
  status: "low" | "optimal" | "high" | "out_of_stock" | "not_in_inventory"
  recommendation: string
}

export interface DocumentAnalysis {
  scanResult: ScanResult
  insights: InventoryInsight[]
  summary: string
}

// Mock OCR function - in a real app, this would use a library like Tesseract.js or a cloud API
const performOCR = async (imageData: string | Blob): Promise<string> => {
  // Simulate OCR processing time
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // For demo purposes, return a mock invoice text
  return `
    INVOICE #INV-2023-1045
    Date: 2023-11-25
    
    Vendor: Office Supplies Co.
    
    Items:
    1. Ergonomic Chair x2 - $249.99 each
    2. Wireless Keyboard x5 - $79.99 each
    3. LED Monitor - 27" x3 - $349.99 each
    4. USB-C Hub x10 - $45.99 each
    5. Desk Lamp x4 - $39.99 each
    
    Subtotal: $2,789.85
    Tax (8%): $223.19
    Total: $3,013.04
  `
}

// Parse extracted text into structured data
const parseInvoiceText = (text: string): ScanResult => {
  // This is a simplified parser - a real one would be more robust
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)

  // Extract invoice number
  const invoiceNumberMatch = text.match(/INVOICE\s+#?([A-Z0-9-]+)/i)
  const invoiceNumber = invoiceNumberMatch ? invoiceNumberMatch[1] : undefined

  // Extract date
  const dateMatch = text.match(/Date:?\s+([0-9]{1,4}[-/.][0-9]{1,2}[-/.][0-9]{1,4})/i)
  const invoiceDate = dateMatch ? dateMatch[1] : undefined

  // Extract vendor
  const vendorMatch = text.match(/Vendor:?\s+(.+)/i)
  const vendorName = vendorMatch ? vendorMatch[1] : undefined

  // Extract items
  const items: ExtractedItem[] = []
  let inItemsSection = false

  for (const line of lines) {
    if (line.toLowerCase().includes("items:")) {
      inItemsSection = true
      continue
    }

    if (inItemsSection && (line.toLowerCase().includes("subtotal") || line.toLowerCase().includes("total"))) {
      inItemsSection = false
      continue
    }

    if (inItemsSection) {
      // Try to match item patterns like "1. Product Name x2 - $249.99 each"
      const itemMatch = line.match(/\d+\.\s+(.+?)(?:\s+x(\d+))?\s+-\s+\$(\d+\.\d+)/i)

      if (itemMatch) {
        const name = itemMatch[1].trim()
        const quantity = itemMatch[2] ? Number.parseInt(itemMatch[2]) : 1
        const price = Number.parseFloat(itemMatch[3])

        // Determine category based on name (simplified)
        let category = "Other"
        if (name.toLowerCase().includes("chair") || name.toLowerCase().includes("desk")) {
          category = "Furniture"
        } else if (
          name.toLowerCase().includes("keyboard") ||
          name.toLowerCase().includes("mouse") ||
          name.toLowerCase().includes("hub")
        ) {
          category = "Accessories"
        } else if (name.toLowerCase().includes("monitor") || name.toLowerCase().includes("laptop")) {
          category = "Electronics"
        } else if (name.toLowerCase().includes("lamp")) {
          category = "Office Supplies"
        }

        items.push({
          name,
          quantity,
          price,
          category,
          confidence: 0.85 + Math.random() * 0.1, // Simulate confidence score between 85-95%
        })
      }
    }
  }

  // Extract total amount
  const totalMatch = text.match(/Total:?\s+\$?([0-9,]+\.[0-9]{2})/i)
  const totalAmount = totalMatch ? Number.parseFloat(totalMatch[1].replace(/,/g, "")) : undefined

  return {
    items,
    totalAmount,
    vendorName,
    invoiceDate,
    invoiceNumber,
    confidence: 0.9, // Overall confidence score
    rawText: text,
  }
}

// Analyze extracted items against inventory
const analyzeInventory = (scanResult: ScanResult): InventoryInsight[] => {
  const insights: InventoryInsight[] = []

  for (const item of scanResult.items) {
    // Find matching item in inventory
    const inventoryItem = SAMPLE_INVENTORY.find(
      (invItem) =>
        invItem.name.toLowerCase().includes(item.name.toLowerCase()) ||
        item.name.toLowerCase().includes(invItem.name.toLowerCase()),
    )

    if (inventoryItem) {
      const currentStock = inventoryItem.quantity
      let status: InventoryInsight["status"] = "optimal"
      let recommendation = ""

      // Determine status based on current stock and ordered quantity
      if (currentStock === 0) {
        status = "out_of_stock"
        recommendation = `Item is out of stock. This order will replenish inventory.`
      } else if (currentStock <= 3) {
        status = "low"
        recommendation = `Current stock is low (${currentStock} units). This order will help replenish inventory.`
      } else if (currentStock >= 20 && item.quantity && item.quantity > 5) {
        status = "high"
        recommendation = `Current stock is already high (${currentStock} units). Consider reducing order quantity.`
      } else {
        status = "optimal"
        recommendation = `Current stock level is optimal (${currentStock} units).`
      }

      insights.push({
        item,
        currentStock,
        status,
        recommendation,
      })
    } else {
      // Item not found in inventory
      insights.push({
        item,
        status: "not_in_inventory",
        recommendation: "This item is not in your current inventory. Consider adding it as a new item.",
      })
    }
  }

  return insights
}

// Generate a summary of the analysis
const generateSummary = (insights: InventoryInsight[]): string => {
  const lowStockCount = insights.filter((i) => i.status === "low").length
  const outOfStockCount = insights.filter((i) => i.status === "out_of_stock").length
  const highStockCount = insights.filter((i) => i.status === "high").length
  const newItemsCount = insights.filter((i) => i.status === "not_in_inventory").length

  let summary = `Analysis complete. Found ${insights.length} items in the document. `

  if (outOfStockCount > 0) {
    summary += `${outOfStockCount} items are currently out of stock. `
  }

  if (lowStockCount > 0) {
    summary += `${lowStockCount} items have low stock levels. `
  }

  if (highStockCount > 0) {
    summary += `${highStockCount} items already have high stock levels. `
  }

  if (newItemsCount > 0) {
    summary += `${newItemsCount} items are not in your current inventory. `
  }

  return summary
}

// Main function to scan document and analyze results
export const scanDocument = async (imageData: string | Blob): Promise<DocumentAnalysis> => {
  try {
    // Step 1: Perform OCR to extract text
    const extractedText = await performOCR(imageData)

    // Step 2: Parse the extracted text
    const scanResult = parseInvoiceText(extractedText)

    // Step 3: Analyze against inventory
    const insights = analyzeInventory(scanResult)

    // Step 4: Generate summary
    const summary = generateSummary(insights)

    return {
      scanResult,
      insights,
      summary,
    }
  } catch (error) {
    console.error("Error scanning document:", error)
    throw new Error("Failed to scan document. Please try again.")
  }
}

// Function to detect document edges in an image (simplified)
export const detectDocumentEdges = async (
  imageData: string | Blob,
): Promise<{
  hasDocument: boolean
  confidence: number
  corners?: { x: number; y: number }[]
}> => {
  // In a real app, this would use computer vision to detect document edges
  // For demo purposes, we'll simulate detection
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Randomly determine if we "detected" a document (90% chance of success)
  const hasDocument = Math.random() > 0.1
  const confidence = hasDocument ? 0.7 + Math.random() * 0.3 : 0.3 + Math.random() * 0.3

  // If document detected, generate corner points
  let corners
  if (hasDocument) {
    // Simulate document corners with some random variation
    corners = [
      { x: 50 + Math.random() * 20, y: 50 + Math.random() * 20 },
      { x: 550 - Math.random() * 20, y: 50 + Math.random() * 20 },
      { x: 550 - Math.random() * 20, y: 750 - Math.random() * 20 },
      { x: 50 + Math.random() * 20, y: 750 - Math.random() * 20 },
    ]
  }

  return {
    hasDocument,
    confidence,
    corners,
  }
}

// Function to enhance document image quality (simplified)
export const enhanceDocumentImage = async (imageData: string | Blob): Promise<string> => {
  // In a real app, this would apply image processing techniques
  // For demo purposes, we'll just return the original image
  await new Promise((resolve) => setTimeout(resolve, 700))

  // If imageData is a Blob, convert it to a data URL
  if (imageData instanceof Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(imageData)
    })
  }

  return imageData
}
