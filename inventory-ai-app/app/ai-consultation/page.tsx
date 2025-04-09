"use client"

import { useChat } from "ai/react"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, User, Loader2 } from "lucide-react"

export default function AIConsultationPage() {
  const [logoLoaded, setLogoLoaded] = useState(false)

  // Preload the logo image
  useEffect(() => {
    const img = new Image()
    img.onload = () => setLogoLoaded(true)
    img.src = "/images/aico-enhanced-logo.png"
  }, [])

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your AiCO inventory consultant. How can I help you with your inventory management today?",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const suggestedQuestions = [
    "What products are running low on stock?",
    "Analyze sales trends for the last quarter",
    "Recommend optimal inventory levels for Product A",
    "Predict demand for next month based on historical data",
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-seablue-900">AI Consultation</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full border border-seablue-100 overflow-hidden">
                {logoLoaded && (
                  <img src="/images/aico-enhanced-logo.png" alt="AI Assistant" className="w-10 h-10 object-contain" />
                )}
              </div>
              <div>
                <CardTitle>Ask AI Assistant</CardTitle>
                <CardDescription>Get intelligent recommendations and insights about your inventory</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs text-muted-foreground">AI powered by ChatGPT</div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Suggested Questions</h3>
              <div className="grid gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleInputChange({ target: { value: question } } as any)}
                    disabled={isLoading}
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
                  className="min-h-[100px] flex-grow"
                  value={input}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit} className="w-full">
              <Button
                type="submit"
                className="w-full bg-seablue-600 hover:bg-seablue-700"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
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

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
            <CardDescription>Your conversation with the AI assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
                  >
                    <div
                      className={`w-7 h-7 flex items-center justify-center rounded-full overflow-hidden ${
                        message.role === "assistant" ? "bg-white border border-seablue-100" : "bg-seablue-600"
                      }`}
                    >
                      {message.role === "assistant" && logoLoaded ? (
                        <img src="/images/aico-enhanced-logo.png" alt="AI" className="w-6 h-6 object-contain" />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${message.role === "assistant" ? "bg-gray-100" : "bg-seablue-600 text-white"}`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="flex items-center space-x-2">
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-seablue-600 hover:bg-seablue-700"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

