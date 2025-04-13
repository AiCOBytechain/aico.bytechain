"use client"

import React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send,
  Loader2,
  FileSpreadsheet,
  Upload,
  FileUp,
  Download,
  Edit,
  Check,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  BarChart,
  Package,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  LineChart,
  PieChart,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TypingIndicator } from "@/components/typing-indicator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample inventory data for AI to reference
const SAMPLE_INVENTORY = [
  { id: 1, name: "Laptop - ThinkPad X1", quantity: 5, price: 1299.99, category: "Electronics", status: "In Stock" },
  { id: 2, name: "Ergonomic Chair", quantity: 10, price: 249.99, category: "Furniture", status: "In Stock" },
  { id: 3, name: "Wireless Keyboard", quantity: 15, price: 79.99, category: "Accessories", status: "In Stock" },
  { id: 4, name: 'LED Monitor - 27"', quantity: 8, price: 349.99, category: "Electronics", status: "In Stock" },
  { id: 5, name: "USB-C Hub", quantity: 20, price: 45.99, category: "Accessories", status: "In Stock" },
  { id: 6, name: "Office Desk", quantity: 3, price: 399.99, category: "Furniture", status: "Low Stock" },
  { id: 7, name: "Wireless Mouse", quantity: 2, price: 59.99, category: "Accessories", status: "Low Stock" },
  { id: 8, name: "Desk Lamp", quantity: 0, price: 39.99, category: "Office Supplies", status: "Out of Stock" },
]

// Enhanced AI prompts for more relevant responses
const ENHANCED_AI_PROMPTS = {
  lowStock: [
    "Based on current inventory data, these items are running low:\n\n{items}\n\nI recommend restocking these items soon to avoid stockouts.",
    "You're running low on the following items:\n\n{items}\n\nConsider placing orders soon to maintain optimal inventory levels.",
    "Inventory alert: Low stock detected for these items:\n\n{items}\n\nWould you like me to prepare a restock recommendation?",
  ],
  restock: [
    "Based on historical sales data and current inventory levels, I recommend restocking:\n\n{items}\n\nWould you like me to prepare a purchase order for these items?",
    "Here's my restock recommendation based on your sales velocity and current stock:\n\n{items}\n\nShall I generate a purchase order draft?",
    "To maintain optimal inventory levels, you should restock these items:\n\n{items}\n\nI can help you create a purchase order if needed.",
  ],
  optimize: [
    "To optimize your inventory turnover, I recommend:\n\n{recommendations}\n\nWould you like a detailed analysis of your inventory turnover rates by category?",
    "Here are my optimization suggestions for improving your inventory efficiency:\n\n{recommendations}\n\nI can provide more detailed category-specific recommendations if needed.",
    "Based on my analysis, these changes would optimize your inventory performance:\n\n{recommendations}\n\nWould you like me to simulate the impact of these changes?",
  ],
  analyze: [
    "Based on Q3 sales data analysis:\n\n{analysis}\n\nKey insights:\n{insights}",
    "Here's my analysis of your recent sales performance:\n\n{analysis}\n\nKey takeaways:\n{insights}",
    "After analyzing your Q3 data, I've found these patterns:\n\n{analysis}\n\nStrategic insights:\n{insights}",
  ],
  predict: [
    "Based on historical data and market trends, here's my demand forecast for next month:\n\n{forecast}\n\nI recommend adjusting your inventory accordingly.",
    "Looking at your sales history and market indicators, I predict the following demand changes:\n\n{forecast}\n\nWould you like me to suggest inventory adjustments based on this forecast?",
    "My demand prediction model shows these trends for next month:\n\n{forecast}\n\nShall I create a procurement plan based on these projections?",
  ],
}

// Message type definition
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function AIConsultationPage() {
  const [activeTab, setActiveTab] = useState("chat")
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<{ name: string; quantity: string; category: string; price: string }>({
    name: "",
    quantity: "",
    category: "",
    price: "",
  })
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const [errorState, setErrorState] = useState<{
    message: string | null
    type: "api" | "processing" | "connection" | null
    retryable: boolean
  }>({
    message: null,
    type: null,
    retryable: false,
  })

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AiCO inventory consultant. I can help you manage inventory, analyze stock levels, and provide recommendations. How can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const [showFollowUpPrompt, setShowFollowUpPrompt] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const router = useRouter()

  // Refs for cleanup
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Preload the logo image
  useEffect(() => {
    const img = new Image()
    img.onload = () => setLogoLoaded(true)
    img.src = "/images/aico-enhanced-logo.png"
  }, [])

  // Cleanup function for timeouts
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout)
    }
  }, [])

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping, aiThinking, showFollowUpPrompt])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value)
    if (apiError) {
      setApiError(null)
    }
  }

  // Get a random response template from the enhanced prompts
  const getRandomTemplate = (type: keyof typeof ENHANCED_AI_PROMPTS): string => {
    const templates = ENHANCED_AI_PROMPTS[type]
    return templates[Math.floor(Math.random() * templates.length)]
  }

  // Format template with data
  const formatTemplate = (template: string, data: Record<string, string>): string => {
    let result = template
    for (const [key, value] of Object.entries(data)) {
      result = result.replace(`{${key}}`, value)
    }
    return result
  }

  // Add a timeout tracking function
  const addTimeout = useCallback((timeout: NodeJS.Timeout) => {
    timeoutRefs.current.push(timeout)
    return timeout
  }, [])

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || isTyping) return

    // Reset states
    setShowFollowUpPrompt(false)
    setApiError(null)
    setIsLoading(true)
    setAiThinking(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      // Call our API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Simulate typing delay
      setAiThinking(false)
      setIsTyping(true)

      // Add AI response after a delay
      const typingTimeout = addTimeout(
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: data.content || data.text || "I'm sorry, I couldn't process that request.",
            },
          ])

          setIsTyping(false)
          setIsLoading(false)

          // Show follow-up prompt after a delay
          const followUpTimeout = addTimeout(
            setTimeout(() => {
              setShowFollowUpPrompt(true)
            }, 500),
          )
        }, 1500),
      )
    } catch (error) {
      console.error("Chat error:", error)
      setAiThinking(false)
      setIsTyping(false)
      setIsLoading(false)

      // Check if it's a response error that we can parse
      let errorMessage = "An error occurred while processing your request. Please try again."
      let errorType: "api" | "processing" | "connection" = "api"
      let isRetryable = true

      if (error instanceof Error) {
        errorMessage = error.message

        // Check for custom error properties
        if ((error as any).errorType) {
          errorType = (error as any).errorType === "connection_error" ? "connection" : "api"
          isRetryable = (error as any).retryable !== false
        }
      }

      // Try to extract more information if it's a fetch error
      try {
        if (error instanceof Response || (error as any).status) {
          const status = (error as any).status
          if (status === 503) {
            errorMessage = "The AI service is temporarily unavailable. Using fallback responses."
            errorType = "api"
          }
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError)
      }

      // Set centralized error state
      setErrorState({
        message: errorMessage,
        type: errorType,
        retryable: isRetryable,
      })

      setApiError(errorMessage)

      // Use a fallback response for reliability
      handleFallbackResponse(input)

      toast({
        title: "Using Fallback Mode",
        description: "There was a temporary issue with the AI service. Using local processing instead.",
        variant: "default",
      })

      // Automatically retry after a delay if it's a retryable error
      if (isRetryable) {
        const retryTimeout = addTimeout(
          setTimeout(() => {
            setApiError(null)
            setErrorState((prev) => ({ ...prev, message: null }))
          }, 5000),
        )
      }
    }
  }

  // Enhanced fallback response handler when API fails
  const handleFallbackResponse = (query: string) => {
    const userQuery = query.toLowerCase()
    let aiResponse = ""

    if (userQuery.includes("low stock") || userQuery.includes("running low")) {
      const lowStockItems = SAMPLE_INVENTORY.filter((item) => item.status === "Low Stock" || item.quantity <= 3)
        .map((item) => `• ${item.name}: ${item.quantity} units remaining`)
        .join("\n")

      const template = getRandomTemplate("lowStock")
      aiResponse = formatTemplate(template, { items: lowStockItems })
    } else if (userQuery.includes("restock")) {
      const restockItems = [
        "• Wireless Mouse (Priority: High)",
        "• Office Desk (Priority: Medium)",
        "• Desk Lamp (Priority: High - currently out of stock)",
      ].join("\n")

      const template = getRandomTemplate("restock")
      aiResponse = formatTemplate(template, { items: restockItems })
    } else if (userQuery.includes("optimize") || userQuery.includes("turnover")) {
      const recommendations = [
        "1. Implement a just-in-time (JIT) inventory system for high-volume items",
        "2. Consider reducing stock levels for USB-C Hubs (currently overstocked)",
        "3. Set up automatic reorder points for frequently purchased items",
        "4. Review your Ergonomic Chairs inventory - sales have slowed in the past month",
      ].join("\n")

      const template = getRandomTemplate("optimize")
      aiResponse = formatTemplate(template, { recommendations })
    } else if (userQuery.includes("analyze") || userQuery.includes("trends")) {
      const analysis = [
        "• Electronics category has shown 15% growth compared to Q2",
        "• Furniture sales have decreased by 8%",
        "• Accessories remain steady with 2% growth",
      ].join("\n")

      const insights = [
        "• Laptops and monitors are your top performers",
        "• Office desk sales typically increase in September-October",
        "• Consider running a promotion on furniture items to boost sales",
      ].join("\n")

      const template = getRandomTemplate("analyze")
      aiResponse = formatTemplate(template, { analysis, insights })
    } else if (userQuery.includes("predict") || userQuery.includes("demand")) {
      const forecast = [
        "• Electronics: Expected 12% increase (seasonal trend)",
        "• Furniture: Expected 5% increase (back-to-office trend)",
        "• Accessories: Expected 8% increase (follows electronics trend)",
      ].join("\n")

      const template = getRandomTemplate("predict")
      aiResponse = formatTemplate(template, { forecast })
    } else {
      aiResponse =
        "I've analyzed your inventory data and found some interesting insights:\n\n" +
        "• You currently have 8 items that are low in stock or out of stock\n" +
        "• Your electronics category has the highest value at $14,249.87\n" +
        "• Your inventory turnover rate is 4.2, which is good for your industry\n\n" +
        "Would you like me to provide specific recommendations for any category?"
    }

    // Simulate typing delay
    const typingTimeout = addTimeout(
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: aiResponse,
          },
        ])

        setIsTyping(false)
        setIsLoading(false)

        // Show follow-up prompt after a delay
        const followUpTimeout = addTimeout(
          setTimeout(() => {
            setShowFollowUpPrompt(true)
          }, 500),
        )
      }, 1500),
    )
  }

  // Function to handle quick inventory queries
  const handleInventoryQuery = useCallback((query: string) => {
    // Reset the input field
    setInput("")

    // Create a synthetic submit event
    const event = {
      preventDefault: () => {},
    } as React.FormEvent

    // Set the input and submit
    setInput(query)
    setTimeout(() => {
      handleSubmit(event)
    }, 100)
  }, [])

  const suggestedQuestions = [
    "What products are running low on stock?",
    "Analyze sales trends for the last quarter",
    "Recommend optimal inventory levels for laptops",
    "Predict demand for next month based on historical data",
    "Which items should I restock soon?",
    "How can I optimize my inventory turnover?",
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0]

        // Check file size (max 10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select a file smaller than 10MB",
            variant: "destructive",
          })
          return
        }

        setFile(selectedFile)
        setFileName(selectedFile.name)
      }
    } catch (error) {
      console.error("Error handling file:", error)
      toast({
        title: "Error",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const processInventoryFile = () => {
    if (!file) return

    setIsProcessing(true)

    // Simulate processing an Excel file
    const timeout = setTimeout(() => {
      try {
        // Use sample inventory data
        setInventoryItems(SAMPLE_INVENTORY.slice(0, 5))
        setIsProcessing(false)
        setIsComplete(true)
      } catch (error) {
        console.error("Error processing file:", error)
        setIsProcessing(false)
        toast({
          title: "Processing Error",
          description: "There was an error processing your file. Please try again.",
          variant: "destructive",
        })
      }
    }, 2000)

    timeoutRefs.current.push(timeout)
  }

  const startEditing = (index: number) => {
    try {
      const item = inventoryItems[index]
      if (!item) return

      setEditingItem(index)
      setEditValues({
        name: item.name,
        quantity: item.quantity.toString(),
        category: item.category,
        price: item.price.toString(),
      })
    } catch (error) {
      console.error("Error starting edit:", error)
      toast({
        title: "Error",
        description: "Could not edit this item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const saveEdit = (index: number) => {
    try {
      // Validate inputs
      const quantity = Number.parseInt(editValues.quantity)
      const price = Number.parseFloat(editValues.price)

      if (isNaN(quantity) || isNaN(price)) {
        toast({
          title: "Invalid Input",
          description: "Please enter valid numbers for quantity and price",
          variant: "destructive",
        })
        return
      }

      const updatedItems = [...inventoryItems]
      updatedItems[index] = {
        ...updatedItems[index],
        name: editValues.name.trim() || "Unnamed Item",
        quantity: quantity,
        category: editValues.category.trim() || "Uncategorized",
        price: price,
      }

      setInventoryItems(updatedItems)
      setEditingItem(null)
    } catch (error) {
      console.error("Error saving edit:", error)
      toast({
        title: "Error",
        description: "Could not save your changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditChange = (field: string, value: string) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addNewItem = () => {
    try {
      const newItem = {
        id: Date.now(), // Use timestamp for unique ID
        name: "New Item",
        quantity: 1,
        price: 0.0,
        category: "Other",
        status: "In Stock",
      }

      setInventoryItems((prev) => [...prev, newItem])
      setEditingItem(inventoryItems.length)
      setEditValues({
        name: newItem.name,
        quantity: newItem.quantity.toString(),
        price: newItem.price.toString(),
        category: newItem.category,
      })
    } catch (error) {
      console.error("Error adding item:", error)
      toast({
        title: "Error",
        description: "Could not add a new item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteItem = (index: number) => {
    try {
      const updatedItems = [...inventoryItems]
      updatedItems.splice(index, 1)
      setInventoryItems(updatedItems)
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        title: "Error",
        description: "Could not delete this item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const saveToInventory = () => {
    try {
      // In a real app, this would save the processed items to the inventory
      toast({
        title: "Success",
        description: "Items saved to inventory successfully!",
      })
      router.push("/inventory")
    } catch (error) {
      console.error("Error saving to inventory:", error)
      toast({
        title: "Error",
        description: "Could not save to inventory. Please try again.",
      })
    }
  }

  const downloadTemplate = () => {
    try {
      // In a real app, this would generate and download an Excel template
      toast({
        title: "Template Downloaded",
        description: "Template downloaded successfully!",
      })
    } catch (error) {
      console.error("Error downloading template:", error)
      toast({
        title: "Error",
        description: "Could not download template. Please try again.",
      })
    }
  }

  // Function to get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Create a memoized message content component
  const MemoizedMessageContent = React.memo(({ content }: { content: string }) => (
    <>
      {content.split("\n").map((text, i) => (
        <p key={i} className={i > 0 ? "mt-2" : ""}>
          {text}
        </p>
      ))}
    </>
  ))

  // Function to retry connection
  const handleRetryConnection = () => {
    if (isRetrying) return

    setIsRetrying(true)
    setApiError(null)
    setErrorState((prev) => ({ ...prev, message: null }))

    // Show a toast to indicate retry attempt
    toast({
      title: "Retrying Connection",
      description: "Attempting to reconnect to the AI service...",
    })

    // Use a simulated response for reliability
    handleInventoryQuery("What products are running low on stock?").finally(() => setIsRetrying(false))
  }

  return (
   <div className="relative min-h-[calc(100vh-4rem)]">
     {/* Background with logo */}
     <div 
       className="absolute inset-0 z-0 overflow-hidden"
       style={{
         backgroundColor: 'rgba(0, 102, 204, 0.02)', // Very subtle seablue color
       }}
     >
       {logoLoaded && (
         <div className="absolute inset-0 flex items-center justify-center opacity-5">
           <img 
             src="/images/aico-enhanced-logo.png" 
             alt="AiCO Background" 
             className="w-[70%] max-w-[600px] object-contain"
             style={{
               filter: 'blur(3px)',
             }}
           />
         </div>
       )}
     </div>

     {/* Content */}
     <div className="relative z-10 flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold tracking-tight text-seablue-900">AI Consultation</h2>
       </div>

       <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
         <TabsList>
           <TabsTrigger value="chat" className="flex items-center gap-2">
             <Sparkles className="h-4 w-4" />
             AI Assistant
           </TabsTrigger>
           <TabsTrigger value="inventory-count" className="flex items-center gap-2">
             <Package className="h-4 w-4" />
             Inventory Counting
           </TabsTrigger>
           <TabsTrigger value="analytics" className="flex items-center gap-2">
             <BarChart className="h-4 w-4" />
             AI Analytics
           </TabsTrigger>
         </TabsList>

         <TabsContent value="chat" className="space-y-4">
           <div className="relative">
             {/* Background with logo - same as main background but scoped to this tab */}
             <div 
               className="absolute inset-0 z-0 overflow-hidden rounded-lg"
               style={{
                 backgroundColor: 'rgba(0, 102, 204, 0.05)', // Seablue color with low opacity
               }}
             >
               {logoLoaded && (
                 <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <img 
                     src="/images/aico-enhanced-logo.png" 
                     alt="AiCO Background" 
                     className="w-[70%] max-w-[600px] object-contain"
                     style={{
                       filter: 'blur(2px)',
                     }}
                   />
                 </div>
               )}
             </div>
             
             {/* Content with relative positioning to appear above background */}
             <div className="relative z-10 p-6 bg-white/80 backdrop-blur-sm rounded-lg">
               <div className="grid gap-4 md:grid-cols-2">
                 {/* AI Assistant Card with background */}
                 <div className="col-span-1 relative">
                   {/* Card-specific background */}
                   <div 
                     className="absolute inset-0 z-0 overflow-hidden rounded-lg"
                     style={{
                       backgroundColor: 'rgba(0, 102, 204, 0.03)', // Very subtle seablue color
                     }}
                   >
                     {logoLoaded && (
                       <div className="absolute inset-0 flex items-center justify-center opacity-8">
                         <img 
                           src="/images/aico-enhanced-logo.png" 
                           alt="AiCO Background" 
                           className="w-[60%] max-w-[300px] object-contain"
                           style={{
                             filter: 'blur(1px)',
                           }}
                         />
                       </div>
                     )}
                   </div>
                   
                   <Card className="relative z-10 border-seablue-100 bg-white/90 backdrop-blur-sm">
                     <CardHeader>
                       <div className="flex items-center space-x-3">
                         {/* Replace AIAvatar with small logo */}
                         {logoLoaded && (
                           <img 
                             src="/images/aico-enhanced-logo.png" 
                             alt="AiCO" 
                             className="h-10 w-10 object-contain"
                           />
                         )}
                         <div>
                           <CardTitle>Ask AI Assistant</CardTitle>
                           <CardDescription>Get intelligent recommendations and insights about your inventory</CardDescription>
                         </div>
                       </div>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div className="flex items-center gap-2">
                         <Badge variant="outline" className="bg-seablue-50 text-seablue-700 border-seablue-200">
                           <Sparkles className="h-3 w-3 mr-1" /> AI Powered
                         </Badge>
                         <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                           Real-time Analysis
                         </Badge>
                       </div>

                       {apiError && (
                         <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                           <AlertTriangle className="h-4 w-4 inline-block mr-2" />
                           {apiError}
                           <Button 
                             variant="outline" 
                             size="sm" 
                             className="ml-2 bg-white" 
                             onClick={handleRetryConnection}
                             disabled={isRetrying}
                           >
                             {isRetrying ? (
                               <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                             ) : (
                               <RefreshCw className="h-3 w-3 mr-1" />
                             )}
                             Retry
                           </Button>
                         </div>
                       )}

                       <div className="space-y-1">
                         <h3 className="text-sm font-medium">Suggested Questions</h3>
                         <div className="grid gap-2">
                           {suggestedQuestions.map((question, index) => (
                             <Button
                               key={index}
                               variant="outline"
                               onClick={() => handleInventoryQuery(question)}
                               disabled={isLoading || isTyping}
                               className="justify-start text-left h-auto py-2 bg-white/80"
                             >
                               {question}
                             </Button>
                           ))}
                         </div>
                       </div>
                       <div className="space-y-1">
                         <h3 className="text-sm font-medium">Custom Query</h3>
                         <div className="flex items-start space-x-3">
                           <Textarea
                             placeholder="Type your inventory question here..."
                             className="min-h-[100px] flex-grow bg-white/90"
                             value={input}
                             onChange={handleInputChange}
                             disabled={isLoading || isTyping}
                           />
                         </div>
                       </div>
                     </CardContent>
                     <CardFooter>
                       <form onSubmit={handleSubmit} className="w-full">
                         <Button
                           type="submit"
                           className="w-full bg-seablue-600 hover:bg-seablue-700"
                           disabled={isLoading || isTyping || !input.trim()}
                         >
                           {isLoading || isTyping ? (
                             <>
                               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                               {isTyping ? "AI is responding..." : "Processing..."}
                             </>
                           ) : (
                             <>
                               <Send className="mr-2 h-4 w-4" /> Send Query
                             </>
                           )}
                         </Button>
                       </form>
                     </CardFooter>
                   </Card>
                 </div>

                 {/* Conversation Card with background */}
                 <div className="col-span-1 relative">
                   {/* Card-specific background */}
                   <div 
                     className="absolute inset-0 z-0 overflow-hidden rounded-lg"
                     style={{
                       backgroundColor: 'rgba(0, 102, 204, 0.03)', // Very subtle seablue color
                     }}
                   >
                     {logoLoaded && (
                       <div className="absolute inset-0 flex items-center justify-center opacity-8">
                         <img 
                           src="/images/aico-enhanced-logo.png" 
                           alt="AiCO Background" 
                           className="w-[60%] max-w-[300px] object-contain"
                           style={{
                             filter: 'blur(1px)',
                           }}
                         />
                       </div>
                     )}
                   </div>
                   
                   <Card className="relative z-10 border-seablue-100 bg-white/90 backdrop-blur-sm">
                     <CardHeader>
                       <CardTitle>Conversation</CardTitle>
                       <CardDescription>Your conversation with the AI assistant</CardDescription>
                     </CardHeader>
                     <CardContent>
                       <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
                         {messages.map((message, index) => (
                           <div
                             key={message.id}
                             className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"} message-appear`}
                             style={{ animationDelay: `${index * 0.1}s` }}
                           >
                             <div
                               className={`flex items-start space-x-2 max-w-[80%] ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
                             >
                               {message.role === "assistant" ? (
                                 <div className="flex-shrink-0">
                                   {logoLoaded && (
                                     <img 
                                       src="/images/aico-enhanced-logo.png" 
                                       alt="AiCO" 
                                       className="h-8 w-8 object-contain rounded-full bg-white/90 p-1 border border-seablue-100"
                                     />
                                   )}
                                 </div>
                               ) : (
                                 <Avatar className="h-7 w-7 bg-seablue-600">
                                   <AvatarFallback>{getInitials("User")}</AvatarFallback>
                                 </Avatar>
                               )}
                               <div
                                 className={`rounded-lg p-3 ${
                                   message.role === "assistant" ? "bg-white border border-seablue-100" : "bg-seablue-600 text-white"
                                 }`}
                               >
                                 <MemoizedMessageContent content={message.content} />
                               </div>
                             </div>
                           </div>
                         ))}

                         {/* Typing indicator */}
                         {isTyping && (
                           <div className="flex justify-start message-appear">
                             <div className="flex items-start space-x-2">
                               <div className="flex-shrink-0">
                                 {logoLoaded && (
                                   <img 
                                     src="/images/aico-enhanced-logo.png" 
                                     alt="AiCO" 
                                     className="h-8 w-8 object-contain rounded-full bg-white/90 p-1 border border-seablue-100"
                                   />
                                 )}
                               </div>
                               <div className="rounded-lg p-3 bg-white border border-seablue-100 flex items-center">
                                 <TypingIndicator />
                               </div>
                             </div>
                           </div>
                         )}

                         {/* AI thinking indicator */}
                         {aiThinking && !isTyping && (
                           <div className="flex justify-start message-appear">
                             <div className="flex items-start space-x-2">
                               <div className="flex-shrink-0">
                                 {logoLoaded && (
                                   <img 
                                     src="/images/aico-enhanced-logo.png" 
                                     alt="AiCO" 
                                     className="h-8 w-8 object-contain rounded-full bg-white/90 p-1 border border-seablue-100"
                                   />
                                 )}
                               </div>
                               <div className="rounded-lg p-3 bg-white border border-seablue-100">Analyzing inventory data...</div>
                             </div>
                           </div>
                         )}

                         {/* Follow-up prompt */}
                         {showFollowUpPrompt && !apiError && (
                           <div className="flex justify-start follow-up-prompt">
                             <div className="flex items-start space-x-2">
                               <div className="flex-shrink-0">
                                 {logoLoaded && (
                                   <img 
                                     src="/images/aico-enhanced-logo.png" 
                                     alt="AiCO" 
                                     className="h-8 w-8 object-contain rounded-full bg-white/90 p-1 border border-seablue-100"
                                   />
                                 )}
                               </div>
                               <div className="rounded-lg p-3 bg-white border-l-4 border-seablue-400 border border-seablue-100">
                                 <p>What is your next question?</p>
                               </div>
                             </div>
                           </div>
                         )}

                         <div ref={messagesEndRef} />
                       </div>
                     </CardContent>
                     <CardFooter className="flex items-center space-x-2">
                       <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                         <Input
                           placeholder="Type a message..."
                           value={input}
                           onChange={handleInputChange}
                           disabled={isLoading || isTyping}
                           className="flex-1 bg-white/90"
                         />
                         <Button
                           type="submit"
                           size="icon"
                           className="bg-seablue-600 hover:bg-seablue-700"
                           disabled={isLoading || isTyping || !input.trim()}
                         >
                           {isLoading || isTyping ? (
                             <Loader2 className="h-4 w-4 animate-spin" />
                           ) : (
                             <Send className="h-4 w-4" />
                           )}
                         </Button>
                       </form>
                     </CardFooter>
                   </Card>
                 </div>
               </div>
             </div>
           </div>
         </TabsContent>

         {/* Inventory count tab content */}
         <TabsContent value="inventory-count" className="space-y-4">
           <div className="relative">
             {/* Background with logo - same as main background but scoped to this tab */}
             <div
               className="absolute inset-0 z-0 overflow-hidden rounded-lg"
               style={{
                 backgroundColor: 'rgba(0, 102, 204, 0.05)', // Seabluecolor with low opacity
               }}
             >
               {logoLoaded && (
                 <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <img 
                     src="/images/aico-enhanced-logo.png" 
                     alt="AiCO Background" 
                     className="w-[70%] max-w-[600px] object-contain"
                     style={{
                       filter: 'blur(2px)',
                     }}
                   />
                 </div>
               )}
             </div>
             
             {/* Content with relative positioning to appear above background */}
             <div className="relative z-10 p-6 bg-white/80 backdrop-blur-sm rounded-lg">
               <Card>
                 <CardHeader>
                   <div className="flex items-center space-x-3">
                     {/* Replace AIAvatar with small logo */}
                     {logoLoaded && (
                       <img 
                         src="/images/aico-enhanced-logo.png" 
                         alt="AiCO" 
                         className="h-10 w-10 object-contain"
                       />
                     )}
                     <div>
                       <CardTitle>Inventory Counting</CardTitle>
                       <CardDescription>Upload Excel files or create inventory counts with AI assistance</CardDescription>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent>
                   {!isComplete ? (
                     <div className="space-y-6">
                       <div className="flex flex-col space-y-2">
                         <h3 className="text-sm font-medium">Upload Inventory File</h3>
                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white/80 backdrop-blur-sm">
                           {file ? (
                             <div className="space-y-2">
                               <div className="flex items-center justify-center">
                                 <FileSpreadsheet className="h-10 w-10 text-seablue-600" />
                               </div>
                               <p className="text-sm font-medium">{fileName}</p>
                               <p className="text-xs text-muted-foreground">File selected and ready for processing</p>
                               <Button
                                 onClick={processInventoryFile}
                                 className="mt-2 bg-seablue-600 hover:bg-seablue-700"
                                 disabled={isProcessing}
                               >
                                 {isProcessing ? (
                                   <>
                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                     Processing...
                                   </>
                                 ) : (
                                   <>
                                     <FileUp className="mr-2 h-4 w-4" />
                                     Process File
                                   </>
                                 )}
                               </Button>
                             </div>
                           ) : (
                             <div className="space-y-4">
                               <div className="flex items-center justify-center">
                                 {logoLoaded && (
                                   <img 
                                     src="/images/aico-enhanced-logo.png" 
                                     alt="AiCO" 
                                     className="h-16 w-16 object-contain"
                                   />
                                 )}
                               </div>
                               <div className="space-y-2">
                                 <p className="text-sm font-medium">Drag and drop your Excel file here or click to browse</p>
                                 <p className="text-xs text-muted-foreground">Supports Excel files (.xlsx, .xls, .csv)</p>
                               </div>
                               <div className="flex justify-center gap-4">
                                 <Input
                                   type="file"
                                   className="hidden"
                                   id="inventory-file"
                                   accept=".xlsx,.xls,.csv"
                                   onChange={handleFileChange}
                                 />
                                 <label htmlFor="inventory-file">
                                   <Button variant="outline" className="cursor-pointer" asChild>
                                     <span>
                                       <Upload className="mr-2 h-4 w-4" />
                                       Browse Files
                                     </span>
                                   </Button>
                                 </label>
                                 <Button variant="outline" onClick={downloadTemplate}>
                                   <Download className="mr-2 h-4 w-4" />
                                   Download Template
                                 </Button>
                               </div>
                             </div>
                           )}
                         </div>
                       </div>

                       <div className="flex flex-col space-y-2">
                         <h3 className="text-sm font-medium">Don't have an Excel file?</h3>
                         <p className="text-sm text-muted-foreground">
                           You can also create a new inventory count directly or use our AI to help you get started.
                         </p>
                         <div className="flex gap-4 mt-2">
                           <Link href="/upload">
                             <Button className="bg-seablue-600 hover:bg-seablue-700">
                               <Upload className="mr-2 h-4 w-4" />
                               Scan Documents
                             </Button>
                           </Link>
                           <Button variant="outline" onClick={() => setActiveTab("chat")}>
                             Ask AI Assistant
                           </Button>
                         </div>
                       </div>
                     </div>
                   ) : (
                     <div className="space-y-6">
                       <div className="flex items-center justify-between">
                         <h3 className="text-lg font-medium">Processed Inventory Items</h3>
                         <div className="flex gap-2">
                           <Button
                             variant="outline"
                             onClick={() => {
                               setFile(null)
                               setFileName("")
                               setIsComplete(false)
                               setInventoryItems([])
                             }}
                           >
                             Upload Another File
                           </Button>
                           <Button className="bg-seablue-600 hover:bg-seablue-700" onClick={saveToInventory}>
                             Save to Inventory
                           </Button>
                         </div>
                       </div>

                      <div className="border rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Item Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Quantity
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Price
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Category
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {inventoryItems.map((item, index) => (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {editingItem === index ? (
                                    <Input
                                      value={editValues.name}
                                      onChange={(e) => handleEditChange("name", e.target.value)}
                                    />
                                  ) : (
                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {editingItem === index ? (
                                    <Input
                                      type="number"
                                      value={editValues.quantity}
                                      onChange={(e) => handleEditChange("quantity", e.target.value)}
                                    />
                                  ) : (
                                    <div className="text-sm text-gray-900">{item.quantity}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {editingItem === index ? (
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={editValues.price}
                                      onChange={(e) => handleEditChange("price", e.target.value)}
                                    />
                                  ) : (
                                    <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {editingItem === index ? (
                                    <Input
                                      value={editValues.category}
                                      onChange={(e) => handleEditChange("category", e.target.value)}
                                    />
                                  ) : (
                                    <div className="text-sm text-gray-900">{item.category}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  {editingItem === index ? (
                                    <Button
                                      size="sm"
                                      onClick={() => saveEdit(index)}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <div className="flex space-x-2 justify-end">
                                      <Button size="sm" variant="ghost" onClick={() => startEditing(index)}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteItem(index)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <Button onClick={addNewItem} variant="outline" size="sm" className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>

                      <div className="pt-4">
                        <Textarea placeholder="Add notes about these items (optional)" className="w-full h-24" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="relative">
            {/* Background with logo - same as main background but scoped to this tab */}
            <div 
              className="absolute inset-0 z-0 overflow-hidden rounded-lg"
              style={{
                backgroundColor: 'rgba(0, 102, 204, 0.05)', // Seablue color with low opacity
              }}
            >
              {logoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <img 
                    src="/images/aico-enhanced-logo.png" 
                    alt="AiCO Background" 
                    className="w-[70%] max-w-[600px] object-contain"
                    style={{
                      filter: 'blur(2px)',
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Content with relative positioning to appear above background */}
            <div className="relative z-10 p-6 bg-white/80 backdrop-blur-sm rounded-lg">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {/* Replace AIAvatar with small logo */}
                    {logoLoaded && (
                      <img 
                        src="/images/aico-enhanced-logo.png" 
                        alt="AiCO" 
                        className="h-10 w-10 object-contain"
                      />
                    )}
                    <div>
                      <CardTitle>AI Analytics Dashboard</CardTitle>
                      <CardDescription>Advanced inventory insights and predictive analytics</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Stock Turnover Rate</CardTitle>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-seablue-900">4.2x</div>
                          <p className="text-xs text-muted-foreground">+0.5x from last month</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Average Days in Stock</CardTitle>
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-seablue-900">32 days</div>
                          <p className="text-xs text-muted-foreground">-5 days from last month</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Stockout Rate</CardTitle>
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-seablue-900">2.3%</div>
                          <p className="text-xs text-muted-foreground">-1.1% from last month</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Inventory Accuracy</CardTitle>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-seablue-900">98.7%</div>
                          <p className="text-xs text-muted-foreground">+0.8% from last month</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Tabs defaultValue="trends">
                      <TabsList>
                        <TabsTrigger value="trends">Inventory Trends</TabsTrigger>
                        <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
                        <TabsTrigger value="categories">Category Analysis</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="trends" className="space-y-4 mt-4">
                        <div className="h-[300px] w-full bg-white rounded-md border flex items-center justify-center">
                          <LineChart className="h-8 w-8 text-seablue-300" />
                          <span className="ml-2 text-sm text-muted-foreground">Inventory Trend Chart</span>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm">Top Performing Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                <li className="flex justify-between items-center">
                                  <span>Laptop - ThinkPad X1</span>
                                  <Badge className="bg-green-100 text-green-800 border-green-200">+15%</Badge>
                                </li>
                                <li className="flex justify-between items-center">
                                  <span>LED Monitor - 27"</span>
                                  <Badge className="bg-green-100 text-green-800 border-green-200">+12%</Badge>
                                </li>
                                <li className="flex justify-between items-center">
                                  <span>Wireless Keyboard</span>
                                  <Badge className="bg-green-100 text-green-800 border-green-200">+8%</Badge>
                                </li>
                              </ul>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm">Underperforming Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                <li className="flex justify-between items-center">
                                  <span>Office Desk</span>
                                  <Badge className="bg-red-100 text-red-800 border-red-200">-8%</Badge>
                                </li>
                                <li className="flex justify-between items-center">
                                  <span>Desk Lamp</span>
                                  <Badge className="bg-red-100 text-red-800 border-red-200">-5%</Badge>
                                </li>
                                <li className="flex justify-between items-center">
                                  <span>Ergonomic Chair</span>
                                  <Badge className="bg-red-100 text-red-800 border-red-200">-3%</Badge>
                                </li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="predictions" className="space-y-4 mt-4">
                        <div className="h-[300px] w-full bg-white rounded-md border flex items-center justify-center">
                          <BarChart className="h-8 w-8 text-seablue-300" />
                          <span className="ml-2 text-sm text-muted-foreground">Demand Forecast Chart</span>
                        </div>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>AI-Generated Recommendations</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <h4 className="font-medium text-blue-800">Restock Recommendations</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                  Based on current trends, consider restocking Wireless Mouse (5 units), Office Desk (3 units), 
                                  and Desk Lamp (10 units) within the next 7 days to avoid stockouts.
                                </p>
                              </div>
                              
                              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                <h4 className="font-medium text-green-800">Optimization Opportunities</h4>
                                <p className="text-sm text-green-700 mt-1">
                                  Reduce stock levels for USB-C Hubs by 15% to optimize inventory turnover. 
                                  Current levels exceed projected demand by approximately 3 weeks.
                                </p>
                              </div>
                              
                              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                                <h4 className="font-medium text-amber-800">Market Trends Alert</h4>
                                <p className="text-sm text-amber-700 mt-1">
                                  Seasonal increase in demand for office furniture expected in the next 30 days. 
                                  Consider increasing stock of Ergonomic Chairs by 20% to meet projected demand.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="categories" className="space-y-4 mt-4">
                        <div className="h-[300px] w-full bg-white rounded-md border flex items-center justify-center">
                          <PieChart className="h-8 w-8 text-seablue-300" />
                          <span className="ml-2 text-sm text-muted-foreground">Category Distribution Chart</span>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-3">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Electronics</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-seablue-900">$14,249.87</div>
                              <p className="text-xs text-muted-foreground">33 items</p>
                              <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="bg-seablue-600 h-full rounded-full" style={{ width: '45%' }}></div>
                              </div>
                              <p className="text-xs text-right mt-1">45% of total inventory value</p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Furniture</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-seablue-900">$9,874.50</div>
                              <p className="text-xs text-muted-foreground">18 items</p>
                              <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="bg-seablue-600 h-full rounded-full" style={{ width: '30%' }}></div>
                              </div>
                              <p className="text-xs text-right mt-1">30% of total inventory value</p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Accessories</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-seablue-900">$5,621.35</div>
                              <p className="text-xs text-muted-foreground">42 items</p>
                              <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="bg-seablue-600 h-full rounded-full" style={{ width: '25%' }}></div>
                              </div>
                              <p className="text-xs text-right mt-1">25% of total inventory value</p>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh Data
                        </Button>
                        <Select defaultValue="30days">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7days">Last 7 days</SelectItem>
                            <SelectItem value="30days">Last 30 days</SelectItem>
                            <SelectItem value="90days">Last 90 days</SelectItem>
                            <SelectItem value="year">Last year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button className="bg-seablue-600 hover:bg-seablue-700">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
}
\
