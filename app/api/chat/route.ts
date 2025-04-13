import { NextResponse } from "next/server"
import { AIResponseSimulator } from "@/utils/ai-simulator"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Reduce the simulated failure rate to make the app more reliable
const SIMULATED_FAILURE_RATE = 0.05 // Reduced from 0.1 to 0.05 (5% chance of failure)

export async function POST(req: Request) {
  try {
    // Simulate random failures for testing resilience
    if (Math.random() < SIMULATED_FAILURE_RATE) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // Add a more specific error message that can be handled by the client
      return NextResponse.json(
        {
          error: "Service temporarily unavailable",
          errorType: "service_unavailable",
          retryable: true,
          message: "The AI service is temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      )
    }

    const { messages } = await req.json()

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid request format",
          errorType: "invalid_request",
          retryable: false,
          message: "Invalid messages format",
        },
        { status: 400 },
      )
    }

    // Get the last user message
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()

    if (!lastUserMessage) {
      return NextResponse.json(
        {
          error: "No user message",
          errorType: "invalid_request",
          retryable: false,
          message: "No user message found",
        },
        { status: 400 },
      )
    }

    // Use the AI simulator to generate a response
    const aiResponse = await AIResponseSimulator.generateResponse(lastUserMessage.content, {
      delay: 300, // Reduced delay for API responses
      errorProbability: 0.05, // 5% chance of error for testing resilience
    })

    // Simulate a delay to make it feel more realistic
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      role: "assistant",
      content: aiResponse,
    })
  } catch (error) {
    console.error("API route error:", error)

    // Standardized error response
    return NextResponse.json(
      {
        error: "Internal server error",
        errorType: "server_error",
        retryable: true,
        message: "There was an error processing your request. Please try again.",
      },
      { status: 500 },
    )
  }
}
