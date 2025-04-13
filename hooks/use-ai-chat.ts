"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { withRetry } from "@/utils/retry-utils"
import { serviceHealth } from "@/utils/service-health"
import { AIResponseSimulator } from "@/utils/ai-simulator"
import { toast } from "@/components/ui/use-toast"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export interface UseAIChatOptions {
  initialMessages?: Message[]
  apiEndpoint?: string
  fallbackToSimulation?: boolean
  maxRetries?: number
  onError?: (error: any) => void
}

export interface UseAIChatResult {
  messages: Message[]
  input: string
  setInput: (input: string) => void
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  isLoading: boolean
  isTyping: boolean
  aiThinking: boolean
  showFollowUpPrompt: boolean
  apiError: string | null
  serviceStatus: "operational" | "degraded" | "unavailable"
  resetChat: () => void
  retryLastMessage: () => Promise<void>
  simulationMode: boolean
  toggleSimulationMode: () => void
}

export function useAIChat({
  initialMessages = [],
  apiEndpoint = "/api/chat",
  fallbackToSimulation = true,
  maxRetries = 3,
  onError,
}: UseAIChatOptions = {}): UseAIChatResult {
  // State
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const [showFollowUpPrompt, setShowFollowUpPrompt] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [serviceStatus, setServiceStatus] = useState<"operational" | "degraded" | "unavailable">("operational")
  const [simulationMode, setSimulationMode] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Refs
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])
  const lastUserMessageRef = useRef<string | null>(null)

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout)
    }
  }, [])

  // Subscribe to service health updates
  useEffect(() => {
    if (!serviceHealth) return () => {} // Return empty cleanup function if serviceHealth is null

    const unsubscribe = serviceHealth.subscribe((serviceId, health) => {
      if (serviceId === "chat-api") {
        setServiceStatus(health.status)

        // Automatically switch to simulation mode if service is unavailable
        if (health.status === "unavailable" && fallbackToSimulation && !simulationMode) {
          setSimulationMode(true)
          toast({
            title: "Switched to Simulation Mode",
            description: "The AI service is currently unavailable. Using simulated responses.",
            variant: "default",
          })
        }
      }
    })

    return unsubscribe
  }, [fallbackToSimulation, simulationMode])

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value)
      if (apiError) {
        setApiError(null)
      }
    },
    [apiError],
  )

  // Reset chat
  const resetChat = useCallback(() => {
    setMessages(initialMessages)
    setInput("")
    setIsLoading(false)
    setIsTyping(false)
    setAiThinking(false)
    setShowFollowUpPrompt(false)
    setApiError(null)
    lastUserMessageRef.current = null
    setRetryCount(0)
  }, [initialMessages])

  // Toggle simulation mode
  const toggleSimulationMode = useCallback(() => {
    setSimulationMode((prev) => !prev)
    toast({
      title: simulationMode ? "Exiting Simulation Mode" : "Entering Simulation Mode",
      description: simulationMode
        ? "Now using real AI service responses."
        : "Using simulated AI responses for demonstration.",
      variant: "default",
    })
  }, [simulationMode])

  // Process message with API
  const processMessageWithAPI = useCallback(
    async (userMessage: string): Promise<string> => {
      try {
        const response = await withRetry(
          async () => {
            const result = await fetch(apiEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages: [...messages, { id: "temp", role: "user", content: userMessage }],
              }),
            })

            if (!response.ok) {
              throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            return result
          },
          {
            maxRetries,
            onRetry: (attempt, delay, error) => {
              console.log(`Retrying API call (${attempt}/${maxRetries}) after ${delay}ms due to:`, error)
              setRetryCount(attempt)
            },
          },
        )

        // Reset retry count on success
        setRetryCount(0)

        if (serviceHealth) {
          // Report success to service health monitor
          serviceHealth.reportSuccess("chat-api")
        }

        const data = await response.json()
        return data.content || data.text || "I'm sorry, I couldn't process that request."
      } catch (error) {
        console.error("API processing error:", error)

        if (serviceHealth) {
          // Report failure to service health monitor
          serviceHealth.reportFailure("chat-api")
        }

        // If we should fallback to simulation, do so silently
        if (fallbackToSimulation) {
          try {
            return await AIResponseSimulator.generateResponse(userMessage)
          } catch (simError) {
            throw error // If simulation also fails, throw the original error
          }
        }

        throw error
      }
    },
    [apiEndpoint, fallbackToSimulation, maxRetries, messages],
  )

  // Process message with simulation
  const processMessageWithSimulation = useCallback(
    async (userMessage: string): Promise<string> => {
      try {
        return await AIResponseSimulator.generateResponse(userMessage, {
          // Increase error probability if we're in degraded mode to simulate occasional failures
          errorProbability: serviceStatus === "degraded" ? 0.3 : 0,
        })
      } catch (error) {
        console.error("Simulation error:", error)
        throw new Error("Failed to generate simulated response")
      }
    },
    [serviceStatus],
  )

  // Handle message submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!input.trim() || isLoading || isTyping) return

      // Store the user message for potential retries
      lastUserMessageRef.current = input

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
        // Process the message using either API or simulation
        const aiResponse = simulationMode
          ? await processMessageWithSimulation(userMessage.content)
          : await processMessageWithAPI(userMessage.content)

        // Simulate typing delay
        setAiThinking(false)
        setIsTyping(true)

        // Add AI response after a delay
        const typingTimeout = setTimeout(() => {
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
          const followUpTimeout = setTimeout(() => {
            setShowFollowUpPrompt(true)
          }, 500)

          timeoutRefs.current.push(followUpTimeout)
        }, 1500)

        timeoutRefs.current.push(typingTimeout)
      } catch (error) {
        console.error("Chat error:", error)
        setAiThinking(false)
        setIsTyping(false)
        setIsLoading(false)

        const errorMessage = error instanceof Error ? error.message : "An error occurred while processing your request."

        setApiError(errorMessage)

        // Call onError callback if provided
        if (onError) {
          onError(error)
        }

        toast({
          title: "Chat Error",
          description: simulationMode
            ? "There was a problem with the AI simulation. Please try again."
            : "There was a problem connecting to the AI service. Switching to fallback mode.",
          variant: "destructive",
        })

        // If not already in simulation mode and fallback is enabled, switch to simulation
        if (!simulationMode && fallbackToSimulation) {
          setSimulationMode(true)
        }
      }
    },
    [
      input,
      isLoading,
      isTyping,
      simulationMode,
      processMessageWithAPI,
      processMessageWithSimulation,
      fallbackToSimulation,
      onError,
    ],
  )

  // Retry last message
  const retryLastMessage = useCallback(async () => {
    if (!lastUserMessageRef.current) return

    setApiError(null)

    // Create a synthetic submit event
    const event = {
      preventDefault: () => {},
    } as React.FormEvent

    // Set the input and submit
    setInput(lastUserMessageRef.current)

    // Small delay to ensure state updates
    setTimeout(() => {
      handleSubmit(event)
    }, 100)
  }, [handleSubmit])

  return {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    isTyping,
    aiThinking,
    showFollowUpPrompt,
    apiError,
    serviceStatus,
    resetChat,
    retryLastMessage,
    simulationMode,
    toggleSimulationMode,
  }
}
